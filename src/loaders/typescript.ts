import type { AsyncLoader } from 'joycon'
import esbuild from 'esbuild'
import vm from 'vm'
import Module from 'module'

export function useTypescriptLoader(): AsyncLoader {
  return {
    test: /\.ts/,
    load: compileTypescriptData
  }
}

/**
 * 编译typescript代码到文件系统
 *
 * @param tsFilePath typescript文件路径
 */
async function compileTypescriptData(tsFilePath: string): Promise<unknown> {
  const buildResult = await esbuild.build({
    entryPoints: [tsFilePath],
    write: false,
    bundle: true,
    format: 'cjs',
    target: 'node10'
  })

  const content = buildResult.outputFiles?.[0]?.contents
  const contentStr = new TextDecoder('utf-8').decode(content)

  const container = {
    exports: {}
  }
  vm.runInThisContext(Module.wrap(contentStr))(
    container.exports,
    require,
    container,
    __filename,
    __dirname
  )
  return container.exports
}
