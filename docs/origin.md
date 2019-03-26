## 不适用es6
  如果你不打算使用 ES6，你也可以使用 `create-react-class` 模块来创建：以下简称 `CRC`

### 创建组件
- 使用class
``` javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
- 使用CRC
``` javascript
  var createReactClass = require('create-react-class');
  var Greeting = createReactClass({
    render: function() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  });
```
### 声明默认属性
- 使用class
``` javascript
  class Greeting extends React.Component {
    // ...
  }
  Greeting.defaultProps = {
    name: 'Mary'
  };
```
- 使用CRC
``` javascript
  var Greeting = createReactClass({
    getDefaultProps: function() {
      return {
        name: 'Mary'
      };
    }
  });
```
### 设置初始状态
- 使用class
``` javascript
 class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
}
```
- 使用CRC
``` javascript
  var Counter = createReactClass({
    getInitialState: function() {
      return {count: this.props.initialCount};
    }
  });
```
### 自动绑定
- 使用class
``` javascript
 class SayHello extends React.Component {
    constructor(props) {
      super(props);
      this.state = {message: 'Hello!'};
      // 这一行很关键
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
      alert(this.state.message);
    }
    render() {
      // 由于 `this.handleClick` 已经绑定至实例，因此我们才可以用它来处理点击事件
      return (
        <button onClick={this.handleClick}>
          Say hello
        </button>
      );
    }
  }
```
- 使用CRC
``` javascript
  var SayHello = createReactClass({
    getInitialState: function() {
      return {message: 'Hello!'};
    },
    handleClick: function() {
      alert(this.state.message);
    },
    render: function() {
      return (
        <button onClick={this.handleClick}>
          Say hello
        </button>
      );
    }
  });
```
关于this的绑定问题，以下方法都是可以的：
- 把方法绑定给构造器 (constructor)
- 使用箭头函数，比如这样写：onClick={(e) => this.handleClick(e)} 或者 onClick = { this.handleClick.bind(this) }
- 使用 createReactClass
- 定义时使用箭头函数，如：handleClick = () => { alert(this.state.message) }

## 不适用JSX
  每一个JSX元素都只是 `React.createElement(component, props, ...children)` 的语法糖
``` javascript
  class Hello extends React.Component {
    render() {
      return <div>Hello {this.props.toWhat}</div>;
    }
  }
  ReactDOM.render(
    <Hello toWhat="World" />,
    document.getElementById('root')
  );
```
不适用jsx的时候，可以像下边这样写：
``` javascript
  class Hello extends React.Component {
    render() {
      return React.createElement('div', null, `Hello ${this.props.toWhat}`);
    }
  }

  ReactDOM.render(
    React.createElement(Hello, {toWhat: 'World'}, null),
    document.getElementById('root')
  );
```