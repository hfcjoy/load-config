import JoyCon, { type LoadResult } from 'joycon'
import path from 'path'
import * as loaders from './loaders'

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

  const result = await joycon.load()
  return result
}

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
