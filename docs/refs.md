## refs && Dom
  在典型的 React 数据流中, 属性（props）是父组件与子组件交互的唯一方式。要修改子组件，你需要使用新的 props 重新渲染它。但是，某些情况下你需要在典型数据流外强制修改子组件。要修改的子组件可以是 React 组件的实例，也可以是 DOM 元素

### 使用原则
在你想使用ref的时候，为什么不考虑`状态提升`。不是非用不可，而是合理控制。

### 创建refs
使用 `React.createRef()` 创建 refs，通过 ref 属性来获得 React 元素。当构造组件时，refs `通常被赋值给实例的一个属性`，这样你可以在组件中任意一处使用它们.
``` javascript
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      // 创建refs,并赋值给实例的属性myRef
      this.myRef = React.createRef();
    }
    render() {
      // 通过ref来为目标元素定义ref
      return <div ref={this.myRef} />;
    }
  }
```

### 访问refs
当一个 ref 属性被传递给一个 `render` 函数中的元素时，可以使用 ref 中的 `current` 属性对节点的引用进行访问.<br>
ref的值取决于节点的类型：
- 当 ref 属性被用于一个普通的 HTML 元素时，React.createRef() 将接收底层 DOM 元素作为它的 current 属性以创建 ref
PS: React 会在组件加载时将 DOM 元素传入 current 属性，在卸载时则会改回 null。ref 的更新会发生在componentDidMount 或 componentDidUpdate 生命周期钩子之前
``` javascript
  class CustomTextInput extends React.Component {
    constructor(props) {
      super(props);
      // 创建 ref 存储 textInput DOM 元素
      this.textInput = React.createRef();
      this.focusTextInput = this.focusTextInput.bind(this);
    }

    focusTextInput() {
      // 直接使用原生 API 使 text 输入框获得焦点
      // 注意：通过 "current" 取得 DOM 节点
      this.textInput.current.focus();
    }

    render() {
      // 告诉 React 我们想把 <input> ref 关联到构造器里创建的 `textInput` 上
      return (
        <div>
          <input
            type="text"
            ref={this.textInput} />

          <input
            type="button"
            value="Focus the text input"
            onClick={this.focusTextInput}
          />
        </div>
      );
    }
  }
```
- 当 ref 属性被用于一个自定义类组件时，ref 对象将接收该组件已挂载的实例作为它的 current
``` javascript
  class AutoFocusTextInput extends React.Component {
    constructor(props) {
      super(props);
      this.textInput = React.createRef();
    }

    componentDidMount() {
      this.textInput.current.focusTextInput();
    }

    render() {
      return (
        <CustomTextInput ref={this.textInput} />
      );
    }
  }
```
- 你不能在函数式组件上使用 ref 属性，因为它们没有实例

### 对父组件暴露 DOM 节点
通过`Ref 转发`使组件可以像暴露自己的 ref 一样暴露子组件的 ref。

### 回调ref
React 也支持另一种设置 ref 的方式，称为“回调 ref”，更加细致地控制何时 ref 被设置和解除。React 将在组件挂载时将 DOM 元素传入ref 回调函数并调用，当卸载时传入 null 并调用它。ref 回调函数会在 `componentDidMount` 和 `componentDidUpdate` 生命周期函数前被调用.
``` javascript
  class CustomTextInput extends React.Component {
    constructor(props) {
      super(props);
      this.textInput = null;
      // 使用回调函数，element指的是dom元素或者react元素实例，会发生在 componentDidMount 和 componentDidUpdate 之前
      this.setTextInputRef = element => {
        this.textInput = element;
      };
      this.focusTextInput = () => {
        // 直接使用原生 API 使 text 输入框获得焦点
        if (this.textInput) this.textInput.focus();
      };
    }

    componentDidMount() {
      // 渲染后文本框自动获得焦点
      this.focusTextInput();
    }

    render() {
      // 使用 `ref` 的回调将 text 输入框的 DOM 节点存储到 React
      // 实例上（比如 this.textInput）
      return (
        <div>
          <input
            type="text"
            ref={this.setTextInputRef}
          />
          <input
            type="button"
            value="Focus the text input"
            onClick={this.focusTextInput}
          />
        </div>
      );
    }
  }
```
你也可以在组件间传递refs,比如：
``` javascript
  function CustomTextInput(props) {
    return (
      <div>
        <input ref={props.inputRef} />
      </div>
    );
  }

  class Parent extends React.Component {
    render() {
      return (
        <CustomTextInput
          inputRef={el => this.inputElement = el}
        />
      );
    }
  }
```
  在上面的例子中，Parent 传递给它的 ref 回调函数作为 inputRef 传递给 CustomTextInput，然后 CustomTextInput 通过 ref属性将其传递给 <input>。最终，Parent 中的 this.inputElement 将被设置为与 CustomTextIput 中的 <input> 元素相对应的 DOM 节点


### 受控组件和非受控组件
  在HTML当中，像<input>,<textarea>, 和 <select>这类表单元素会维持自身状态，并根据用户输入进行更新(非受控组件)。
  但在React中，可变的状态通常保存在组件的状态属性中，并且只能用 setState() 方法进行更新（受控组件）.
在大多数情况下，我们推荐使用 `受控组件` 来实现表单。 在受控组件中，表单数据由 React 组件处理。如果让表单数据由 DOM 处理时，替代方案为使用非受控组件.

