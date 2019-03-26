  React 中一个常见模式是为一个组件返回多个元素。`Fragments` 可以让你聚合一个子元素列表，并且不在DOM中增加额外节点。类似于vue中的`template`

先来看一个很常见的例子：

``` javascript
  class Columns extends React.Component {
    render () {
      <div>
        <th>1</th>
        <th>2</th>
      <div/>
    }
  }

  class Table extends React.Component {
    render() {
      return (
        <table>
          <tr>
            <Columns />
          </tr>
        </table>
      );
    }
  }
```
为了渲染有效的 HTML ， <Columns /> 需要返回多个 <td> 元素。如果一个父 div 在 <Columns /> 的 render() 函数里面使用，那么最终的 HTML 将是无效的。<br>
同样的像ul,li,dl等这些元素，都会存在类似问题。

## 开始使用Fragment 
- 使用空组件
``` javascript
  class Columns extends React.Component {
    render () {
      <>
        <th>1</th>
        <th>2</th>
      </>
    }
  }
```
  ps: `<></> 语法不能接受键值或属性`
- 借助 `React.Fragment`
``` javascript
  class Columns extends React.Component {
    render () {
      <React.Fragment>
        <th>1</th>
        <th>2</th>
      <React.Fragment/>
    }
  }
```
  PS: `如果你需要一个带 key 的片段，你可以直接使用 <React.Fragment />`