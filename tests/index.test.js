const { loadConfig } = require('../dist/index.js')
const path = require('path')

const fixture = name => path.join(__dirname, 'fixtures', name)
describe('load', () => {
  it('have package.json key data', async () => {
    const cwd = fixture('package-key')
    const result = await loadConfig('reelup', cwd)
    const { data, path: configPath } = result

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

describe('extends', () => {
  it('extends local', async () => {
    const cwd = fixture('extends-local')
    const { data, path: configPath } = await loadConfig('reelup', cwd)
    expect(data).toEqual({
      mini: true,
      target: 'node8'
    })
    expect(configPath).toEqual(path.join(cwd, '.reeluprc.json'))
  })
})
