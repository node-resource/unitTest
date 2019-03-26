## 差分算法
  当你使用React，在某一个时间点，你可以认为render()函数是在创建React元素树。在下一状态或属性更新时，render()函数将返回一个不同的React元素树。React需要算出如何高效更新UI以匹配最新的树<br>
  diffing算法用来找出两棵树的所有不同点

### 根元素
  当差分两棵树时，React首先比较两个根元素。依赖于根元素的类型不同，其行为也不同。

- 不同类型的元素
每当根元素有不同类型，React将拆除旧树并且从零开始重新构建新树。当拆除一棵树时，旧的DOM节点被销毁。组件实例收到componentWillUnmount()。当构建一棵新树时，新的DOM节点被插入到DOM中。组件实例先收到componentWillMount()，然后收到componentDidMount()。任何与旧树有关的状态都被丢弃.
``` html
  <div>
    <Counter />
  </div>

  <span>
    <Counter />
  </span>
```

- 相同类型的DOM元素
当比较两个相同类型的React DOM元素时，React则会观察二者的属性(attributes)，保持相同的底层DOM节点，并仅更新变化的属性。
``` html
  <div className="before" title="stuff" />

  <div className="after" title="stuff" />
```
PS: `在处理完DOM元素后，React递归其子代`


- 相同类型的组件元素
当组件更新时，实例保持相同，这样状态跨渲染被维护。React通过更新底层组件实例的属性(props)来匹配新元素，并在底层实例上调用componentWillReceiveProps() 和 componentWillUpdate()。下一步，render()方法被调用，差分算法递归处理前一次的结果和新的结果

### 子代们上的递归
  默认时，当递归DOM节点的子节点时，React就是迭代在同一时间点的两个子节点列表，并在不同时产生一个变更。
当在子节点末尾增加一个元素，两棵树的转换效果很好：
``` html
  <ul>
    <li>first</li>
    <li>second</li>
  </ul>

  <ul>
    <li>first</li>
    <li>second</li>
    <li>third</li>
  </ul>
```
但是：如果把third放在最前面，上边的diff算法就会变得很糟糕。怎么办呢？
- keys
为解决该问题，React支持了一个key属性。当子节点有key时，React使用key来匹配原始树的子节点和随后树的子节点。例如，增加一个key到上面低效的示例，能让树的转换变得高效.
``` html
  <ul>
    <li key="2015">Duke</li>
    <li key="2016">Villanova</li>
  </ul>

  <ul>
    <li key="2014">Connecticut</li>
    <li key="2015">Duke</li>
    <li key="2016">Villanova</li>
  </ul>
```