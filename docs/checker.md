# 静态类型检查
  像 Flow 和 TypeScript 这样的静态类型检查器可以在运行代码之前识别某些类型的问题。 他们还可以通过添加自动完成功能来改善开发人员的工作流程。 
  出于这个原因，对于更大的代码库我们建议使用 `Flow `或者 `TypeScript` 来替代 `PropTypes`

## [flow](https://flow.org/en/docs/getting-started/)
Flow 是一个针对 JavaScript 代码的静态类型检查器。它是在Facebook开发的，经常和React一起使用。 `它可以让你使用特殊的类型语法来注释变量，函数和React组件`，并尽早地发现错误
- 项目中添加flow
``` bash
  npm install --save-dev flow-bin
  npm run flow init  // 创建flow的配置文件
```
将 flow 添加到你的 package.json中的 "scripts" 部分
``` json
 "scripts": {
    "flow": "flow"
  },
```
- 从编译过的代码中剥离 Flow 语法
如果你手动为你的项目配置了 Babel，你将需要为 Flow 安装一个特殊的 preset。
``` bash
  npm install --save-dev babel-preset-flow
```
然后将 flow preset 加入你的 Babel 配置。比如，如果你通过 `.babelrc` 文件配置 Babel。<br>
PS：Flow 不需要 react preset，但他们经常在一起使用。 Flow 本身就理解 JSX 语法
``` json
{
  "presets": [
    "flow",
    "react"
  ]
}
```
- 运行flow
``` bash
 npm run flow
```

## TypeScript
