# Context
开始本节的讨论之前，我们先假设以下的场景：
  有三个组件 `App` `Toolbar` `ThemedButton`。我们需要通过`App`来定义整体的 `ThemedButton`组件的主题？怎么办呢
  传统的方案是：在`App`上定义一个state，传递到`Toolbar`的props属性上，再通过`Toolbar`传递到 `ThemedButton`的props属性上。
  那么随着业务的深入，组件的嵌套和交叉会越来越复杂，总不能这样一直这样传递下去，肿么办？？？

## 何时使用 Context
  注意：不要仅仅为了避免在几个层级下的组件传递 props 而使用 context，它是被用于在多个层级的多个组件需要访问相同数据的情景。

我们来使用`context`来实现上述的情景：
``` javascript
  // 创建一个 theme Context,  默认 theme 的值为 light 
  const ThemeContext = React.createContext('light')
  const ThemedButton = (props) => {
    // ThemedButton 组件从 context 接收 theme
    return (
      <ThemeContext.Consumer>
        {
          theme => <button theme={theme} {...props} />
        }
      </ThemeContext.Consumer>
    )
  }
  // 中间组件
  const Toolbar = (props) => {
    return (
      <ThemedButton />
    )
  }
  // 根组件
  class App extends React.Component {
    constructor () {
      super()
      this.state = {
        theme: 'dark'
      }
    }
    render () {
      return (
        // 通过value来制定上下文的传递值
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar/>
        <ThemeContext.Provider/>
      )
    }
  }

```

## 初识Context API
- React.createContext
``` javascript
  const {Provider, Consumer} = React.createContext(defaultValue);
```
创建一对 { Provider, Consumer }。当 React 渲染 context 组件 Consumer 时，它将从组件树的上层中最接近的匹配的 Provider 读取当前的 context 值。
如果上层的组件树没有一个匹配的 Provider，而此时你需要渲染一个 Consumer 组件，那么你可以用到 defaultValue 。这有助于在不封装它们的情况下对组件进行测试

- Provider
``` html
  <Provider value={/* some value */}>
```
接收一个 value 属性传递给 Provider 的后代 Consumers。一个 Provider 可以联系到多个 Consumers。Providers 可以被嵌套以覆盖组件树内更深层次的值
- Consumer
``` html
  <Consumer>
    {value => /* render something based on the context value */}
</Consumer>
```
接收一个 函数作为子节点. 函数接收当前 context 的值并返回一个 React 节点。传递给函数的 value 将等于组件树中上层 context 的最近的 Provider 的 value 属性。如果 context 没有 Provider ，那么 value 参数将等于被传递给 createContext() 的 defaultValue

  PS：每当Provider的值发生改变时, 作为Provider后代的所有Consumers都会重新渲染。 从Provider到其后代的Consumers传播不受shouldComponentUpdate方法的约束，因此即使祖先组件退出更新时，后代Consumer也会被更新

## 深入Context

### 父子耦合
经常需要从组件树中某个深度嵌套的组件中更新 context。在这种情况下，可以`通过 context 向下传递一个函数`，以允许 Consumer 更新 context 
**theme-context.js**
``` javascript 
  // 确保默认值<<按类型传递>>
  // createContext() 匹配的属性是 Consumers 所期望的
  export const ThemeContext = React.createContext({
    theme: 'light',
    toggleTheme: () => {}
  })
```
**theme-toggler-button.js**
``` javascript 
  import {ThemeContext} from './theme-context'
  export default const ThemeToggleButton = (props) => {
    return (
      <ThemeContext.Consumer>
        {
          ({theme, toggleTheme}) => (
            <button style={{ backgroundColor: theme }}> onClick={toggleTheme} {...props}>
              Toggle Theme
            </button>
          )
        }
      </ThemeContext.Consumer>
    )
  }
```
**app.js**
``` javascript
 import {ThemeContext} from './theme-context'
 import ThemeTogglerButton from './theme-toggler-button'
 class App extends React.Component {
   constructor () {
     super()
     this.state = {
       themeConf: {
         theme: 'dark',
         toggleTheme: this.toggleTheme
       }
     }
   }
   toggleTheme = () => {
      this.setState(state => ({
          theme: state.themeConf.theme === 'dark' ? 'light' :'dark'
        })
      )
   }
   render () {
     return (
       <ThemeContext.Provider value={this.state.themeConf}>
         <ThemeTogglerButton />
       </ThemeContext.Provider>
     )
   }
 }
```

### 在生命周期方法中访问 Context
在生命周期方法中从上下文访问值是一种相对常见的用例。而不是将上下文添加到每个生命周期方法中，只需要将它作为一个 props 传递，然后像通常使用 props 一样去使用它
``` javascript
class Button extends React.Component {
  componentDidMount () {
     // ThemeContext value is this.props.theme
  }
  componentDidUpdate (prevProps, prevState) {
    // Previous ThemeContext value is prevProps.theme
    // New ThemeContext value is this.props.theme
  }
  render () {
    const {theme, children} = this.props
    return (
      <button className={theme}>{ children }</button>
    )
  }
} 

export default (props) => {
  return (
    <ThemeContext.Consumer>
      { theme => <Button theme={theme} {...props}/> }
    </ThemeContext.Consumer>
  )
}

```


### 高阶组件中的 Context
某些类型的上下文被许多组件（例如主题或者地点信息）共用。使用 <Context.Consumer> 元素显示地封装每个依赖项是冗余的
``` javascript
  const ThemeContext = React.createContext('light')
  export default const WithTheme = (Component) => {
    return function ThemedComponent (props) {
      return (
        <ThemeContext.Consumer>
          {theme => <Component theme={theme} {...props} /> }
        </ThemeContext.Consumer>
      )
    }
  }
```
``` javascript
  function Button({theme, ...rest}) {
    return <button className={theme} {...rest} />;
  }
  const ThemedButton = withTheme(Button);
```

### 转发refs
refs 不会自动的传递给被封装的元素。为了解决这个问题，使用 `React.forwardRef`
**fancy-button.js**
``` javascript
  class FancyButton extends React.Component {
    focus () {}
    // ....
  }
  // 使用 context 传递当前的 "theme" 给 FancyButton.
  // 使用 forwardRef 传递 refs 给 FancyButton 也是可以的.
  export default React.forwardRef((props, ref) => {
    <ThemeContext.Consumer>
      {theme => <FancyButton ref={ref} {...props} theme={theme}/>}
    </ThemeContext.Consumer>
  })
```
**app.js**
``` javascript
  import FancyButton from './fancy-button'
  class App extends React.Component {
    constructor () {
      super()
      this.state = {
        ref: React.createRef()
      }
    }
    render () {
      return (
        // ref属性将指向 FancyButton 组件,
        // ThemeContext.Consumer 没有包裹它
        // 这意味着我们可以调用 FancyButton 的方法就像这样 ref.current.focus()
        <FancyButton ref={this.state.ref} onClick={handleClick}>Click me</FancyButton>
      )
    }
  }
```