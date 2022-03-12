import JoyCon, { type LoadResult } from 'joycon'
import path from 'path'
import merge from 'deepmerge'
import { exec } from 'child_process'
import { loaders, compleFiles } from './loaders'
import { extendKey } from './config'

/**
 * 加载配置文件数据
 *
 * @param name 配置文件名称
 * @param cwd 执行查询的基础路径
 * @returns 路径以及配置数据
 */
export async function loadConfig(
  name: string,
  cwd = process.cwd()
): Promise<LoadResult> {
  const files = generateSearchFiles(name)

  const joycon = new JoyCon({
    cwd,
    files,
    ...(files.includes('package.json') ? { packageKey: name } : {})
  })

  for (const item in loaders as { [fname: string]: () => void }) {
    if (Object.prototype.hasOwnProperty.call(loaders, item)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const loader = loaders[item]
      joycon.addLoader(loader.call())
    }
  }

  const { data, path: configStartPath = '' } = await joycon.load()
  let cleanData = data

  // 清理数据 1. package.json包含了外层数据
  if (path.basename(configStartPath) === 'package.json') cleanData = data[name]

  const extendsName = cleanData?.[extendKey]
  if (typeof extendsName === 'string') {
    const extendsData = await loadExtendsData(
      extendsName,
      configStartPath,
      cleanData
    )
    return {
      path: configStartPath,
      data: extendsData
    }
  }

  return {
    data: cleanData,
    path: configStartPath
  }
}

/**
 * 加载继承数据
 *
 * @param extendsName 继承的模块名称或者配置文件路径
 * @param configFilePath 当前具有继承属性的配置文件路径
 * @param beforeConfigData 上一次的继承数据
 */
async function loadExtendsData(
  extendsName: string,
  configFilePath: string,
  beforeConfigData: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const extendsTarget = await resolveResolvePath(extendsName, configFilePath)
  const extendsData = await compleFiles(extendsTarget)

  const currentExtendsName = extendsData?.[extendKey]
  const hasExtendConfig = typeof currentExtendsName === 'string'

  const mergeData = handleExtendsData(beforeConfigData, extendsData)
  if (hasExtendConfig) {
    const result = await loadExtendsData(
      currentExtendsName,
      extendsTarget,
      mergeData
    )
    return result
  }
  return mergeData
}

/**
 * 生成要搜索的配置文件列表
 *
 * @param name 配置模块名称
 * @returns 搜索的目标文件列表
 */
function generateSearchFiles(name: string) {
  const isFile = path.extname(name)
  if (isFile) return [name]
  const suffixes = ['.json', '.yaml', '.yml', '.ts', '.js', '.cjs']

  return [
    'package.json',
    `.${name}rc`,
    ...suffixes.map(suffix => `.${name}rc${suffix}`),
    `${name}.config.ts`,
    `${name}.config.js`,
    `${name}.config.cjs`
  ]
}

/**
 * 处理继承数据
 *
 * @param currentData 当前数据
 * @param extendsData 继承的数据
 * @returns 如果存在相同的配置项，当前数据的优先级更高
 */
function handleExtendsData(
  currentData: Record<string, unknown>,
  extendsData: Record<string, unknown>
): Record<string, unknown> {
  const result = merge(extendsData, currentData)
  delete result?.[extendKey]
  return result
}

/**
 * 指定cwd查找模块
 *
 * @param moduleName 模块名称
 * @param relativePath cwd路径
 * @returns 模块的路径
 */
async function resolveResolvePath(
  moduleName: string,
  relativePath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `node -e 'console.log(require.resolve("${moduleName}"))'`,
      {
        cwd: path.dirname(relativePath)
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(stderr))
          return
        }
        resolve(stdout.trim())
      }
    )
  })
}
