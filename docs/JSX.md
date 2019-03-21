## 深入JSX
### React.createElement
本质上来讲，JSX 只是为 `React.createElement(component, props, ...children)` 方法提供的语法糖。
``` html
  <MyButton color="blue" shadowSize={2}>
    Click Me
  </MyButton>
```
被编译为：
``` javascript
  React.createElement(
    MyButton,
    {color: 'blue', shadowSize: 2},
    'Click Me'
  )
```
如果没有子代，你还可以使用自闭合标签，比如:
``` html
  <MyButton color="blue" shadowSize={2} />
```
被编译为：
``` javascript
  React.createElement(
    MyButton,
    {color: 'blue', shadowSize: 2},
    null
  )
```
### 点表示法用于JSX类型
你还可以使用 JSX 中的点表示法来引用 React 组件。你可以方便地从一个模块中导出许多 React 组件。
``` javascript
  import React from 'react';
  const MyComponents = {
    DatePicker: function DatePicker(props) {
      return <div>Imagine a {props.color} datepicker here.</div>;
    }
  }

  function BlueDatePicker() {
    return <MyComponents.DatePicker color="blue" />;
  }
```
### 在运行时选择类型
你`不能使用一个通用的表达式来作为 React 元素的标签`。如果你的确想使用一个通用的表达式来确定 React 元素的类型，请先将其赋值给大写开头的变量。这种情况一般发生于当你想基于属性值渲染不同的组件时:
``` javascript
  import React from 'react';
  import { PhotoStory, VideoStory } from './stories';

  const components = {
    photo: PhotoStory,
    video: VideoStory
  };

  function Story(props) {
    // 正确！JSX 标签名可以为大写开头的变量。
    const SpecificStory = components[props.storyType];
    return <SpecificStory story={props.story} />;
    // 错误！ 不能把表达式放在组件中
    // return <components[props.storyType] story={props.story} />;
  }
```
### 属性操作
- 属性默认为“True”
如果你没有给属性传值，它默认为 true。因此下面两个 JSX 是等价的：
``` html
  <MyTextBox autocomplete />
  <!-- 不推荐：es6中{foo} 是 {foo: foo} 的简写，但{true}能被html识别 -->
  <MyTextBox autocomplete={true} />
```
- 展开属性
``` javascript
  const Button = props => {
    const { kind, ...other } = props;
    const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
    return <button className={className} {...other} />;
  };

  const App = () => {
    return (
      <div>
        <Button kind="primary" onClick={() => console.log("clicked!")}>
          Hello World!
        </Button>
      </div>
    );
  };
```
### JSX子代
- React 组件也可以返回包含多个元素的一个数组
``` javascript
  render() {
    //PS: 不需要使用额外的元素包裹数组中的元素！。其它元素需要最外层包一个标签
    return [
      // 不要忘记 key :)
      <li key="A">First item</li>,
      <li key="B">Second item</li>,
      <li key="C">Third item</li>,
    ];
  }
```
- JavaScript 表达式作为子代
``` javascript
  function Item(props) {
    return <li>{props.message}</li>;
  }

  function TodoList() {
    const todos = ['finish doc', 'submit pr', 'nag dan to review'];
    return (
      <ul>
        {todos.map((message) => <Item key={message} message={message} />)}
      </ul>
    );
  }
```
- 函数作为子代
``` javascript
  // Calls the children callback numTimes to produce a repeated component
  function Repeat(props) {
    let items = [];
    for (let i = 0; i < props.numTimes; i++) {
      items.push(props.children(i));
    }
    return <div>{items}</div>;
  }

  function ListOfTenThings() {
    return (
      <Repeat numTimes={10}>
        {(index) => <div key={index}>This is item {index} in the list</div>}
      </Repeat>
    );
  }
```
