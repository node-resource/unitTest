# React API

## Creating React Component
- React.Component
- React.PureComponent
 它是一种浅比较。 react.purecomponent的shouldComponentUpdate（）跳过整个组件子树的属性更新。确保所有子组件也是“纯”的。
- `create-react-class`类库
- 函数式组件（无生命周期）
- React.memo
react.memo是一个高阶组件。它类似于react.purecomponent，但用于函数组件而不是类。
  如果函数组件在相同的属性下呈现相同的结果，则可以将其包装在一个react.memo中，以便在某些情况下通过记忆结果来提高性能。这意味着react将跳过渲染组件，并重用上一次渲染的结果
``` javascript
  const MyComponent = React.memo(function MyComponent(props) {
    /* render using props */
  });
```
默认情况下，它只会比较props对象中的复杂对象。如果要控制比较，还可以提供自定义比较函数作为第二个参数
``` javascript
  function MyComponent(props) {
    /* render using props */
  }
  function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
  }
  export default React.memo(MyComponent, areEqual);
```

## Creating React Elements
- JSX
- React.createElement
``` javascript
  React.createElement(
    type,
    [props],
    [...children]
  )
```
- React.createFactory
返回一个生成给定类型的反应元素的函数
``` javascript
  React.createFactory(type)
```

## Transforming React Elements
- React.cloneElement
克隆并返回一个新的react元素，使用原始元素作为起点。生成的元素将原始元素的属性与新属性合并在一起。新的孩子将取代现有的孩子。保留原始元素的键和引用
``` javascript
  React.cloneElement(
    element,
    [props],
    [...children]
  )
  // clone原理如下：
  <element.type {...element.props} {...props}>{children}</element.type>
```
- React.isValidElement
- React.Children
react.children提供用于处理this.props.children不透明数据结构的实用程序
1. React.Children.map
对包含在此设置为thisarg的子级中的每个直接子级调用函数。如果子级是数组，则将遍历它，并为数组中的每个子级调用函数。如果子级为空或未定义，则此方法将返回空或未定义，而不是数组
``` javascript
  React.Children.map(children, function[(thisArg)])
```
2. React.Children.forEach
``` javascript
  React.Children.forEach(children, function[(thisArg)])
```
3. React.Children.count
返回子级中组件的总数
``` javascript
  React.Children.count(children)
```
4. React.Children.only
验证子级是否只有一个子级（react元素），并返回它。否则，此方法将引发错误
``` javascript
  React.Children.only(children)
```
5. React.Children.toArray
以平面数组的形式返回子级不透明数据结构，并为每个子级分配键。如果要在渲染方法中操作子集合，特别是要在传递之前重新排序或切片this.props.children，则非常有用
``` javascript
  React.Children.toArray(children)
```

## Fragments
- React.Fragment
``` javascript
  render() {
    return (
      <React.Fragment>
        Some text.
        <h2>A heading</h2>
      </React.Fragment>
    );
  }
```
- <> </>
``` javascript
  render() {
    return (
      <>
        Some text.
        <h2>A heading</h2>
      </>
    );
  }
```

## refs
- React.createRef
``` javascript
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      this.inputRef = React.createRef();
    }
    render() {
      return <input type="text" ref={this.inputRef} />;
    }
    componentDidMount() {
      this.inputRef.current.focus();
    }
  }
```
- React.forwardRef
``` javascript
  const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton">
      {props.children}
    </button>
  ));

  // You can now get a ref directly to the DOM button:
  const ref = React.createRef();
  <FancyButton ref={ref}>Click me!</FancyButton>;
```

## Suspense
- React.lazy
`React.lazy()`允许您定义动态加载的组件。这有助于减少代码块的大小，以延迟在初始渲染期间未使用的加载组件。
同样的换可以使用`react-loadable`来动态加载组件
  请注意，渲染惰性组件需要在渲染树中有一个更高的`<react.suspense>`组件。这是如何指定加载指示器的方法
``` javascript
  // This component is loaded dynamically
  const SomeComponent = React.lazy(() => import('./SomeComponent'));
```
- React.Suspense
React.Suspense let you specify the loading indicator in case some components in the tree below it are not yet ready to render. Today, lazy loading components is the only use case supported by `<React.Suspense>`
``` javascript
  // This component is loaded dynamically
  const OtherComponent = React.lazy(() => import('./OtherComponent'));

  function MyComponent() {
    return (
      // Displays <Spinner> until OtherComponent loads
      <React.Suspense fallback={<Spinner />}>
        <div>
          <OtherComponent />
        </div>
      </React.Suspense>
    );
  }
```
  it doesn’t have to wrap every one of them. The best practice is to place <Suspense> where you want to see a loading indicator, but to use lazy() wherever you want to do code splitting