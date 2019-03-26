## Strict Mode
  `StrictMode`是一个用以标记出应用中潜在问题的工具。它为其后代元素触发额外的检查和警告。
  注意: 严格模式检查只在开发模式下运行，不会与生产模式冲突

你可以在应用的任何地方启用严格模式。比如像这样：
``` javascript
  import React from 'react';
  function ExampleApplication() {
    return (
      <div>
        <Header />
        <React.StrictMode>
          <div>
            <ComponentOne />
            <ComponentTwo />
          </div>
        </React.StrictMode>
        <Footer />
      </div>
    );
  }

```
在上面的例子中，不会对组件Header、Footer进行strict mode检查。然而ComponentOne、ComponentTwo以及它们所有的后代将被检查。<br>
StrictMode常用于：
- 识别具有不安全生命周期的组件
在异步React应用中使用某些老式的生命周期方法不安全。但是, 如果应用程序使用第三方库, 则很难确保不使用这些生命周期方法。幸运的是, 严格的模式可以帮助解决这个问题!
![识别不安全的生命周期](https://reactjs.org/static/strict-mode-unsafe-lifecycles-warning-e4fdbff774b356881123e69ad88eda88-2535d.png)
- 有关旧式字符串ref用法的警告
React提供了2种方法管理ref：`旧式的字符串ref API和回调API`。虽然字符串ref API更加方便，但它有些许缺点，因此我们的正式建议是改用`回调方式`.React 16.3新增了第三种方式（` React.createRef()`）, 它提供了字符串 ref 的方便性, 而没有任何缺点。

- 检测意外的副作用
理论上，React在两个阶段起作用:
- 渲染阶段
决定了需要对 DOM 进行哪些更改。在此阶段, React调用render(方法), 然后将结果与上一次渲染进行比较。
- 提交阶段
是React执行任何更改的阶段。(在React DOM中, 指React插入、更新和删除 dom 节点）。在此阶段React也调用生命周期, 如 componentDidMount 和 componentDidUpdate




