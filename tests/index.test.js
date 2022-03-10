const { loadConfig } = require('../dist/index.js')
const path = require('path')

const fixture = name => path.join(__dirname, 'fixtures', name)
describe('load', () => {
  it('have package.json key data', async () => {
    const cwd = fixture('package-key')
    const { data, path: configPath } = await loadConfig('reelup', cwd)
    expect(data).toEqual({
      file: 'pkg'
    })
    expect(configPath).toEqual(path.join(cwd, 'package.json'))
  })

  it('load typescript config data', async () => {
    const cwd = fixture('typescript-config')
    const { data, path: configPath } = await loadConfig('reelup', cwd)
    expect(data).toEqual({
      file: 'typescript'
    })
    expect(configPath).toEqual(path.join(cwd, 'reelup.config.ts'))
  })
})
