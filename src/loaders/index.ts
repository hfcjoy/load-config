import path from 'path'
import { compileTypescriptData, useTypescriptLoader } from './typescript'

/**
 * 加载器用来解析文件路径
 */
export const loaders = {
  useTypescriptLoader
}

/**
 * 编译各种文件数据
 *
 * @param filePath 文件路径
 * @returns 数据
 */
export async function compleFiles(filePath: string) {
  const ext = path.extname(filePath)

  switch (ext) {
    case '.ts': {
      const data = await compileTypescriptData(filePath)
      return data
    }
    case '.js': {
      const data = require(filePath)
      return data.default || data
    }
    default:
      break
  }
}
