import fs from 'fs/promises'

/**
 * 查找项目安装的依赖项
 *
 * @param pkgPath package.json路径
 * @returns 安装的本地依赖项
 */
export async function findDependencies(pkgPath: string) {
  const pkgData = await fs.readFile(pkgPath, { encoding: 'utf-8' })
  const { dependencies = {}, devDependencies = {} } = JSON.parse(pkgData)

  return {
    ...dependencies,
    ...devDependencies
  }
}
