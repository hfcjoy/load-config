import type { AsyncLoader } from 'joycon'
import esbuild from 'esbuild'
import tmp from 'tmp'

export function useTypescriptLoader(): AsyncLoader {
  return {
    test: /\.ts/,
    load: loadTypescriptData
  }
}

async function loadTypescriptData(filePath: string) {}

/**
 * 编译typescript代码到文件系统
 *
 * @param tsFilePath typescript文件路径
 */
async function compileTypescriptData(
  tsFilePath: string
): Promise<CompileResult> {
  const buildResult = await esbuild.build({
    entryPoints: [tsFilePath],
    write: false,
    bundle: true,
    format: 'cjs',
    target: 'node10'
  })

  const result = await new Promise((resolve, reject) => {
    tmp.file((err, path, fd, cleanupCallback) => {
      if (err) {
        reject(err)
        return
      }

      resolve({
        jsFilePath: path,
        cleanCache: cleanupCallback
      })

      cleanupCallback()
    })
  })

  return result as CompileResult
}

interface CompileResult {
  /**
   * 编译之后输出的js文件路径
   */
  jsFilePath: string
  /**
   * 拿到数据之后可以手动清除缓存
   */
  cleanCache: () => void
}
