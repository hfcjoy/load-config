import type { AsyncLoader } from 'joycon'
import Json5 from 'json5'
import { readFile } from 'fs/promises'

export function useJson5Loader(): AsyncLoader {
  return {
    test: /\.json(c|5|)$/,
    load: compileJsonData
  }
}

export async function compileJsonData(jsonFilePath: string) {
  const jsonStr = await readFile(jsonFilePath, { encoding: 'utf-8' })
  return Json5.parse(jsonStr)
}
