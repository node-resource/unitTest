# 高阶组件（HOC: higherOrderComponent）

  高阶组件就是一个`函数`，且该函数`接受一个组件作为参数`，并返回一个新的组件。主要用来`重用组件逻辑`

高阶组件既不会修改输入组件，也不会使用继承拷贝它的行为。而是，高阶组件 组合（composes） 原始组件，通过用一个容器组件 包裹着（wrapping） 原始组件。高阶组件就是一个没有副作用的纯函数

## 不要改变原始组件，使用组合（包裹）
  `不要在高阶组件内修改一个组件的原型（或以其它方式修改组件）`
``` javascript
  function logProps(InputComponent) {
    InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    };
    // The fact that we're returning the original input is a hint that it has
    // been mutated.
    return InputComponent;
  }
  // EnhancedComponent will log whenever props are received
  const EnhancedComponent = logProps(InputComponent);
```
上述示例有几个问题：
- 输入组件`InputComponent`不能独立于增强组件`logProps`被重用
- 如果有A，B2个增强型组件，A和B分别都对InputComponent原型的componentWillReceiveProps方法执行了重写，那么在A组件上应用B的时候，原先A定义的InputComponent原型的componentWillReceiveProps方法就会被覆盖
- 如果组件InputComponent是一个没有生命周期的函数，那么高阶组件对没有生命周期方法的函数式组件也是无效的。

## 约定：过滤不相关props属性给被包裹的组件
``` javascript
  render() {
    // 过滤掉专用于这个阶组件的props属性，
    const { extraProp1, extraProp2, ...passThroughProps } = this.props;

    // 向被包裹的组件注入props属性，这些一般都是状态值或
    // 实例方法
    const injectedProp = someStateOrInstanceMethod;

    // 向被包裹的组件传递props属性
    return (
      <WrappedComponent
        injectedProp={injectedProp}
        {...passThroughProps}
      />
    );
  }
```
需要说明的是：
  extraProp1,extraProp2: 高阶组件自定义的prop属性(有几个罗列几个，不要污染passThroughProps)
  passThroughProps：指的是需要过渡到引入组件的信息(采用rest扩展，放到最后)

## 一些需要特别注意的地方
如果你是React新手，你要知道高阶组件自身也有一些需要特别注意的地方。

### 不要在render方法内使用高阶组件
根据差分算法，如果render方法返回的组件和前一次渲染返回的组件是完全相同的(===)，React就递归地更新子树，这是通过差分它和新的那个完成。如果它们不相等，前一个子树被完全卸载掉。`重新加载一个组件会引起原有组件的状态和它的所有子组件丢失`。看下边的例子：
``` javascript
  render() {
    // 每一次渲染，都会创建一个新的EnhancedComponent版本
    // EnhancedComponent1 !== EnhancedComponent2
    const EnhancedComponent = enhance(MyComponent);
    // 那引起每一次都会使子对象树完全被卸载/重新加载
    return <EnhancedComponent />;
  }
```
  你可能需要动态的应用高阶组件。你也可以在组件的`生命周期方法或构造函数`中操作
``` javascript
  constructor () {
    super()
    // 高阶组件在构造函数里初始化
    this.Table = enhanceTable(Table)
  }
```

### 必须将静态方法做拷贝
当你应用一个高阶组件到一个组件时，尽管，原始组件被包裹于一个容器组件内，也就意味着新组件会没有原始组件的任何静态方法
``` javascript
  // 定义静态方法
  WrappedComponent.staticMethod = function() {/*...*/}
  // 使用高阶组件
  const EnhancedComponent = enhance(WrappedComponent);

  // 增强型组件没有静态方法
  typeof EnhancedComponent.staticMethod === 'undefined' // true
```
为解决这个问题，在返回之前，将原始组件的方法拷贝给容器：
``` javascript
  function enhance(WrappedComponent) {
    class Enhance extends React.Component {/*...*/}
    // 前提：必须得知道要拷贝的方法 （好不方便是吧？？？？？？）
    Enhance.staticMethod = WrappedComponent.staticMethod;
    return Enhance;
  }
```
上边的方法前提是你要知道引入组件上有哪些静态方法，如果有多个呢？？是不是好麻烦？可以考虑引入`hoist-non-react-statics`库。当然也可以分别导出自己的静态方法，感觉也挺麻烦有没有！
``` javascript
  import hoistNonReactStatic from 'hoist-non-react-statics';
  function enhance(WrappedComponent) {
    class Enhance extends React.Component {/*...*/}
    hoistNonReactStatic(Enhance, WrappedComponent);
    return Enhance;
  }
```

### Refs属性不能贯穿传递
一般来说，高阶组件可以传递所有的props属性给包裹的组件，但是不能传递refs引用。如果你向一个由高阶组件创建的组件的元素添加ref应用，那么ref指向的是最外层容器组件实例的，而不是被包裹的组件。可以通过使用`React.forwardRef()`来解决。