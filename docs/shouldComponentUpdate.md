## shouldComponentUpdate实战
  从react的生命周期来看，如果想让组件只在props.color或者state.count的值变化时重新渲染，你可以像下面这样设定shouldComponentUpdate：
``` javascript
  export default class Life extends React.Component {
    constructor () {
      super()
      this.state = {
        count: 0
      }
    }

    shouldComponentUpdate (nextProps, nextState) {
      return this.props.color !== nextProps.color || this.state.count !== nextState.color
    }

    render () {
      return (
        <div>
          { this.state.count }
          <span className="btn-info" color={this.props.color} onClick={ () => this.setState(preState => ({count: preState.count + 1})) }>Count:{ this.state.count }</span>
        </div>
      )
    }
  }
```
### 纯组件
React提供了一个辅助对象来实现上述逻辑 - 继承自`React.PureComponent`
  它只做一个`浅比较`。如果属性或状态可以以浅比较会错失的方式变化，此时你不能使用它
``` javascript
  class CounterButton extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {count: 1};
    }
    render() {
      return (
        <button
          color={this.props.color}
          onClick={() => this.setState(state => ({count: state.count + 1}))}>
          Count: {this.state.count}
        </button>
      );
    }
  }
```
### `不会突变的数据`的力量
先来看一个例子：
``` javascript
  class ListOfWords extends React.PureComponent {
    render() {
      return <div>{this.props.words.join(',')}</div>;
    }
  }

  class WordAdder extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        words: ['marklar']
      };
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      // This section is bad style and causes a bug
      // 要时刻关注数据的不可变性（关注引用类型的数据）
      const words = this.state.words;
      words.push('marklar');
      this.setState({words: words});
    }

    render() {
      return (
        <div>
          <button onClick={this.handleClick} />
          <ListOfWords words={this.state.words} />
        </div>
      );
    }
  }
```
问题是PureComponent将会在this.props.words的新旧值之间做一个简单的比较。由于代码中words数组在WordAdder的handleClick方法中被改变了，尽管数组中的实际单词已经改变，this.props.words的新旧值还是相等的，因此即便ListOfWords具有应该被渲染的新单词，它还是不会更新

### 不会突变的数据的力量
避免上述问题的发生，一个很好的解决方案是`免使用值可能会突变的属性或状态`。比如以下方法：
``` javascript
// 方案1
this.setState(prevState => ({
  words: prevState.words.concat(['marklar'])
}));
// 方案2
this.setState(prevState => ({
  words: [...prevState.words, 'marklar'],
}));

```
同样的，对于对象类型的变化监测和更新，可以像下边这样：
``` javascript
  // 错误
  function updateColorMap(colormap) {
    colormap.right = 'blue';
  }
  // 方案1
  function updateColorMap(colormap) {
    return Object.assign({}, colormap, {right: 'blue'});
  }
  // 方案2
  function updateColorMap(colormap) {
    return {...colormap, right: 'blue'};
  }
```