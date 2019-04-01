## 技术栈
webpack + react + antd + redux + react-router-dom + postcss + typescript + 单元测试 + git 

## 生命周期
1、组件运行之前
- static defaultProps = {}    static propTypes = {}
- constructor(){ super(); this.state = {} }
- componentWillMount
- render
- componentDidMount

2、组件运行时
- 父组件更新render,props改变 -> componentWillReceiveProps -> shouldComponentUpdate() -> componentWillUpdate() -> render() -> componentDidUpdate()
- state改变 -> shouldComponentUpdate() -> componentWillUpdate() -> render() -> componentDidUpdate()
- 组件销毁-> componentWillUnmount() -> 结束

## setState
  setState 的调用是`异步`的——不要紧接在调用 setState 之后，依赖 `this.state `来反射新值。

``` javascript
  incrementCount() {
    // Note: this will *not* work as intended.
    this.setState({count: this.state.count + 1});
  }

  handleSomething() {
    // Let's say `this.state.count` starts at 0.
    this.incrementCount();
    this.incrementCount();
    this.incrementCount();
  }
```
  如果你需要`基于当前状态计算值`，则传递一个更新函数而不是一个对象
``` javascript
  incrementCount() {
    this.setState((state) => {
      // Important: read `state` instead of `this.state` when updating.
      return {count: state.count + 1}
    });
  }

  handleSomething() {
    // Let's say `this.state.count` starts at 0.
    this.incrementCount();
    this.incrementCount();
    this.incrementCount();
  }
```


## babel 转移 JSX
babel 转译器会把 JSX 转换成一个名为 `React.createElement()` 的方法调用。下边方式效果是一样的。
``` javascript
// JSX 语法
const ele = (
  <div className="app">Hello, world!</div>
);

// 也可以用es6来定义
class ele extends React.Component {
  render () {
    return <div className="app">Hello, world!</div>
  }
}

// 自定义组件
function Welcome (props) {
  return <h1>Hello, {props.name}</h1>;
}
// 我们对<Welcome name="Sara" />元素调用了ReactDOM.render()方法
// React将{name: 'Sara'}作为props传入并调用Welcome组件
// Welcome组件将<h1>Hello, Sara</h1>元素作为结果返回
const element = <Welcome name="Sara" />;

// jsx语法实际上是调用了createElement方法
// React.createElement
const ele = React.createElement(
  'div',
  {className: 'app'},
  'Hello, world!'
);

```
上述调用会返回下边这种结构：React 元素
``` javascript
const ele = {
  type: 'div',
  props: {
    className: 'app',
    children: 'Hello, world!'
  }
}
```

## 事件处理
### 事件处理程序this问题
你必须谨慎对待 JSX 回调函数中的 this，类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined。通常有以下几种方法来处理this问题。
- 使用属性初始化器语法,强制绑定this
``` javascript
constructor(props) {
  super(props);
  // This binding is necessary to make `this` work in the callback
  this.handleClick = this.handleClick.bind(this);
}
```
- 使用箭头函数
``` javascript
  handleClick = () => {
    console.log('this is:', this);
  }
```
- 在回调函数中使用 箭头函数 (不推荐)
ps: 会在每次组件渲染时创建一个新的函数，可能会影响性能.
``` javascript
 <button onClick={(e) => this.handleClick(e)}>
    Click me
  </button>
  <button onClick={this.handleClick.bind(this)}>
    Click me
  </button>
```
### 事件处理程序参数传递问题
``` html
  <!-- 以下2种方法是等价的 -->
  <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
  <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
  <!-- 通过data-属性传递参数 -->
  <button onClick={this.deleteRow} data-id={id}>Delete Row</button>
```
注意：***很重要**
- `参数 e 作为 React 事件对象将会被作为第二个参数进行传递。`
- `通过箭头函数的方式，事件对象必须显式的进行传递`
- `通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递`

### 为什么绑定是必须的
先来看一个例子
``` javascript
  var obj = {
    name: 'test',
    say: function(){ console.log(this.name) }
  }
  var method = obj.say

  method() // undefined
  method.call(obj) // test
  method.apply(obj) //test
  method.bind(obj)() // test
```

### 怎样阻止函数被调用太快或者太多次
如果你有一个onClick或者onScroll这样的事件处理器，想要阻止回调被触发的太快，那么可以限制执行回调的速度，可以通过以下几种方式做到这点:
- 节流
基于时间的频率来进行抽样更改 (例如 _.throttle)
- 防抖
一段时间的不活动之后发布更改 (例如 _.debounce)
- requestAnimationFrame节流
基于requestAnimationFrame的抽样更改 (例如 raf-schd)
  注意：`_.debounce` , `_.throttle`和`raf-schd` 都提供了一个 `cancel`方法来取消延迟回调。 所以在`componentWillUnmount`生命周期里要调用`cancel`来取消延迟回调。

#### 节流
通过控制函数调用的频率(多长时间执行一次)。下面这个例子会节流“click”事件处理器每秒钟的只能调用一次
``` javascript
  import throttle from 'lodash.throttle'
  class Loadmore extends React.Component {
    constructor (props) {
      super(props)
      this.handleClickThrottled = throttle(this.handleClick, 1000)
    },
    handleClick = () => {
      this.props.loadmore()
    }
    componentWillUnmount () {
      this.handleClickThrottled.cancel()
    }
    render () {
      return (
        <button onClick={this.handleClickThrottled}>Load More</button>
      )
    }
  }
```

#### 防抖
防抖确保函数在上一次执行结束后的一段约定时间内（多久时间后再执行下一次），不会被再次执行。以250ms的延迟来改变文本输入：
``` javascript
  import debounce from 'lodash.debounce'
  class Searchbox extends React.Component {
    constructor (props) {
      super(props)
      this.handleChangeDebounce = debouce(this.hanldeChange, 250)
    }
    handleChange = (e) => {
      this.props.onChange(e.target.value)
    }
    componentWillUnmount () {
      this.handleChangeDebounce.cancel()
    }
    render () {
      return (
        <input
          type="text"
          onChange={this.handleChangeDebounce}
          placeholder="Search..."
          defaultValue={this.props.value}
        />
      )
    }
  }
```
#### requestAnimationFrame节流
`requestAnimationFrame`是在浏览器中排队等待执行的一种方法，它可以在呈现性能的最佳时间执行。一个函数被requestAnimationFrame放入队列后将会在下一帧触发
``` javascript
  import rafSchedule from 'raf-schd'
  class ScrollListener extends React.Component {
    constructor (props) {
      super(props)
      this.scheduleUpdate = rafSchedule(
        point => this.props.onScroll(point)
      )
    }
    componentWillUnmount () {
      this.scheduleUpdate.cancel()
    }
    handleScroll = (e) => {
      this.scheduleUpdate({x:e.clientX, y: e.clientY})
    },
    render () {
      return (
        <div
          style={{ overflow: 'scroll' }}
          onScroll={this.handleScroll}>
          <img src="/my-huge-image.jpg" />
        </div>
      )
    }
  }
```




## 状态提升
在React应用中，对应任何可变数据理应只有一个单一“数据源”。通常，状态都是首先添加在需要渲染数据的组件中。然后，如果另一个组件也需要这些数据，你可以将数据提升至离它们最近的共同祖先中。你应该依赖 `自上而下的数据流`，而不是尝试在不同组件中同步状态。在React中，`状态分享是通过将state数据提升至离需要这些数据的组件最近的父组件来完成的。这就是所谓的**状态提升**`。
### 状态提升 pk 双向数据绑定
状态提升要写更多的“炉墙代码”，比起双向绑定方式，但带来的好处是，你也可以花更少的工作量找到和隔离bug。因为任何生活在某些组件中的状态数据，也只有该组件它自己能够操作这些数据，发生bug的表面积就被大大地减小了。此外，你也可以使用自定义逻辑来拒绝（reject）或转换（transform）用户的输入。

### 如何做到状态提升
状态提升一般是把几个组件需要共用状态数据的情况，提升至距离这几个组件最近的父组件中。通过父组件中引入子组件，把父组件的state通过props属性到子组件中，从而达到父组件的状态变化影响其下的所有子组件。但是在子组件中不能直接修改props，所以在传递子组件时，必须在props上有相应的处理函数。这点和vue的$emit是不一样的。
``` javascript
//  父组件
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />

        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />

        <BoilingVerdict
          celsius={parseFloat(celsius)} />

      </div>
    );
  }
}
// 子组件
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>在{scaleNames[scale]}:中输入温度数值</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

## 组合 && 继承
React 具有强大的组合模型，我们建议`使用组合而不是继承来复用组件之间的代码`。
>>> 属性和组合为你提供了以清晰和安全的方式自定义组件的样式和行为所需的所有灵活性。请记住，组件可以接受任意元素，包括基本数据类型、React 元素或函数 <br/>
我们建议这些组件使用 `children` 属性将子元素直接传递到输出。也可以指定别的名字，来确保指定的内容插入到指定的区域。这个和vue的slot有异曲同工之妙。<br/>
代码可参考`Dialog`组件。

## 数据不可变性
在react，我们一般对引用数据执行浅拷贝，比如使用slice或者解构等方法。以此来防止对已有数据的改变。有以下优点：
- 很轻松地实现 撤销/重做以及时间旅行
改变已有的数据内容可以让我们在需要的时候随时切换回历史数据。
- 记录变化
在我们直接修改一个对象的内容之后，是很难判断它哪里发生了改变的。我们想要判断一个对象的改变，必须拿当前的对象和改变之前的对象相互比较，遍历整个对象树，比较每一个值，这样的操作复杂度是非常高的。<br>而运用不可变性原则之后则要轻松得多。因为我们每次都是返回一个新的对象，所以只要判断这个对象被替换了，那么其中数据肯定是改变了的
- 在 React 当中判定何时重新渲染
根据对象数据是否发生改变了，那么也就很好决定何时根据数据的改变重新渲染组件。（`shouldComponentUpdate()` ）
