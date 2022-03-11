<p align="center" style="font-size:55pt">🏗️</p>
 <h3 align="center">load-config</h3>
 <p align="center">
  为程序搜索并加载配置数据

<center>

![npm (scoped)](https://img.shields.io/npm/v/@hfcjoy/load-config) ![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@hfcjoy/load-config) ![npm type definitions](https://img.shields.io/npm/types/@hfcjoy/load-config)

</center>

基于 javascript 生态传统的智能默认值，`load-config`将按照一下优先级搜索配置文件：

- 在 `package.json` 配置的属性值
- `rc`文件：`.reeluprc`
- `rc`并且是以下后缀的文件：`.json`, `.yaml`, `.yml`, `.ts`, `.js`, `.cjs`，例如：`.reeluprc.json`
- 是以下后缀的文件：`.config.ts`、`.config.js`、`.config.cjs`

# 更强大的功能

- 让配置文件支持不限层级的继承，包括：从本地文件继承、或者 npm 包的方式继承；以及混合继承，例如：`json`配置文件可以继承`.ts`配置文件

```json
{
  // 本地继承
  "$extends": "../config.json",
  // npm包继承
  "$extends": "@xx/reelup",
  // 混合继承
  "$extends": "../config.ts"
}
```

# 用法

设置一个配置项的名称，`load-config`将自动搜索：

```javascript
import { loadConfig } from '@hfcjoy/load-config'

await loadConfig('reelup')
```
