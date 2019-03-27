## ReactDom

### render()
``` javascript
  ReactDOM.render(element, container, [callback])
```
把`element`渲染到指定的`container`中，并返回对组件的引用（对于无状态组件返回`null`）。如果`container`中已经包含其他react组件，则对其执行更新。如果提供了`callback`则会在创建或者更新element之后触发此回调。


### hydrate()
``` javascript
  ReactDOM.hydrate(element, container, [callback])
```

### unmountComponentAtNode()
``` javascript
  ReactDOM.unmountComponentAtNode(container)
```
从dom结构中移除目标元素`container`，包括其事件和状态。成功移除返回`true`。否则返回`false`

### createPortal()
``` javascript
  ReactDOM.createPortal(child, container)
```
Creates a portal. Portals provide a way to render children into a DOM node that exists outside the hierarchy of the DOM component



## ReactDOMServer
``` javascript
  // ES modules
  import ReactDOMServer from 'react-dom/server';
  // CommonJS
  var ReactDOMServer = require('react-dom/server');
```
- The following methods can be used in both the server and browser environments
1. renderToString()
Render a React element to its initial HTML. React will return an HTML string.If you call `ReactDOM.hydrate()` on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very `performant first-load experience`
``` javascript
  ReactDOMServer.renderToString(element)
```
2. renderToStaticMarkup()
Similar to renderToString, except this `doesn’t create extra DOM attributes` that React uses internally
``` javascript
  ReactDOMServer.renderToStaticMarkup(element)
```
3. renderToNodeStream()
``` javascript
  ReactDOMServer.renderToNodeStream(element)
```
4. renderToStaticNodeStream()
``` javascript
  ReactDOMServer.renderToStaticNodeStream(element)
```
- only available on the server, and won’t work in the browser


## DOM Elements
在react中，所有的dom属性和属性（包括事件处理程序）都应该采用camelcase。例如，HTML属性tabindex对应于react中的属性tabindex。例外情况是aria-*和data-*属性，这两个属性应该比较低。例如，可以将aria-label保留为aria-label
### Differences In Attributes
1. checked -> defaultChecked
2. class -> className
3. dangerouslySetInnerHTML
`dangerouslySetInnerHTML` is React’s replacement for using `innerHTML` in the browser DOM.you can set HTML directly from React, but you have to type out `dangerouslySetInnerHTML` and pass an object with a `__html` key, to remind yourself that it’s dangerous
``` javascript
  function createMarkup() {
    return {__html: 'First &middot; Second'};
  }

  function MyComponent() {
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  }
```
4. htmlFor
Since `for` is a reserved word in JavaScript, React elements use `htmlFor` instead
``` html
  <label htmlFor="name">姓名：<label>
  <input id="name" defaultValue=""/>
```
5. style
``` javascript
  const divStyle = {
    color: 'blue',
    backgroundImage: 'url(' + imgUrl + ')',
  };

  function HelloWorldComponent() {
    return <div style={divStyle}>Hello World!</div>;
  }

```
``` html
  // Result style: '10px'
  <div style={{ height: 10 }}>
    Hello World!
  </div>

  // Result style: '10%'
  <div style={{ height: '10%' }}>
    Hello World!
  </div>
```
6. value -> defaultValue 