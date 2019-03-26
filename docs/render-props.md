## Render Props
  一种在 React 组件之间使用一个`值为函数`的 prop 在 React 组件间共享代码的简单技术。函数返回一个 React 元素的函数，并在组件render中调用该函数而不是实现自己的渲染逻辑。比如：React Router
看下边这个例子：
``` javascript
  class Cat extends React.Component {
    render() {
      const mouse = this.props.mouse;
      return (
        <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
      );
    }
  }

  class Mouse extends React.Component {
    constructor(props) {
      super(props);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.state = { x: 0, y: 0 };
    }

    handleMouseMove(event) {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }

    render() {
      return (
        <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

          {/*
            Instead of providing a static representation of what <Mouse> renders,
            use the `render` prop to dynamically determine what to render.
          */}
          {this.props.render(this.state)}
        </div>
      );
    }
  }

  class MouseTracker extends React.Component {
    render() {
      return (
        <div>
          <h1>Move the mouse around!</h1>
          <Mouse render={mouse => (
            <Cat mouse={mouse} />
          )}/>
        </div>
      );
    }
  }
```
  render prop 是一个组件，用来了解要渲染什么内容的函数 prop。

关于 render props 一个有趣的事情是你可以使用一个带有 render props 的常规组件来实现大量的 高阶组件 (HOC)。例如，如果你更偏向于使用一个 withMouse 的高阶组件而不是一个 <Mouse> 组件，你可以轻松的创建一个带有 render prop 的常规 <Mouse> 组件的高阶组件。
``` javascript
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
  function withMouse(Component) {
    return class extends React.Component {
      render() {
        return (
          <Mouse render={mouse => (
            <Component {...this.props} mouse={mouse} />
          )}/>
        );
      }
    }
  }
```

### 使用 Props 而非 render
尽管之前的例子使用了 render，我们也可以简单地使用 `children` prop。
``` javascript
  <Mouse children={mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}/>
```
并记住，children prop 并不真正需要添加到 JSX 元素的 “attributes” 列表中。相反，你可以直接放置到元素的内部
``` javascript
  <Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```
由于这一技术有些不寻常，当你在设计一个类似的 API 时，你可能要直接地在你的 propTypes 里声明 children 应为一个函数类型
``` javascript
  Mouse.propTypes = {
    children: PropTypes.func.isRequired
  };
```

### 在 React.PureComponent 中使用 render props 要注意
  如果你在 render 方法里创建函数，那么使用 render prop 会抵消使用 React.PureComponent 带来的优势。这是因为`浅 prop 比较对于新 props 总会返回 false`，并且在这种情况下每一个 render 对于 render prop 将会生成一个新的值
``` javascript
  class Mouse extends React.PureComponent {
    // Same implementation as above...
  }

  class MouseTracker extends React.Component {
    render() {
      return (
        <div>
          <h1>Move the mouse around!</h1>

          {/*
            This is bad! The value of the `render` prop will
            be different on each render.
            每次 <MouseTracker> 渲染，它会生成一个新的函数作为 <Mouse render> 的 prop，因而在同时也抵消了继承自 React.PureComponent 的 <Mouse> 组件的效果
          */}
          <Mouse render={mouse => (
            <Cat mouse={mouse} />
          )}/>
        </div>
      );
    }
  }
```
为了绕过这一问题，有时你可以定义一个 prop 作为实例方法，类似如下：
``` javascript
  class MouseTracker extends React.Component {
    constructor(props) {
      super(props);

      // This binding ensures that `this.renderTheCat` always refers
      // to the *same* function when we use it in render.
      this.renderTheCat = this.renderTheCat.bind(this);
    }

    renderTheCat(mouse) {
      return <Cat mouse={mouse} />;
    }

    render() {
      return (
        <div>
          <h1>Move the mouse around!</h1>
          <Mouse render={this.renderTheCat} />
        </div>
      );
    }
  }
```
