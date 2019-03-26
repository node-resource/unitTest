## 代码分割
代码分割你的应用能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管你不用减少你的应用中过多的代码体积，你仍然能够避免加载用户永远不需要的代码，并在初始化时候减少所需加载的代码量。

  代码分割你的应用能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管你不用减少你的应用中过多的代码体积，你仍然能够避免加载用户永远不需要的代码，并在初始化时候减少所需加载的代码量

### 动态import语法
  在你的应用中引入代码分割的最佳方式是通过`动态 import()` 语法。当 Webpack 解析到该语法时，它会自动地开始进行代码分割
``` javascript
  // 之前
  import { add } from './math';
  console.log(add(16, 26));
  // 过渡时期
  require.ensure(['./math'], function(){
    var add = require('./math')
    console.log(math.add(16, 26));
  }, 'add')
  // 现在
  import("./math").then(math => {
    console.log(math.add(16, 26));
  });
```

### React Loadable
React Loadable 将动态引入(dynamic import)封装成了一个对 React 友好的 API 来在特定组件下引入代码分割的功能
``` javascript
  // 之前
  import OtherComponent from './OtherComponent';
  const MyComponent = () => (
    <OtherComponent/>
  );
  // 现在
  import Loadable from 'react-loadable';
    //帮助你创建加载状态、错误状态、超时、预加载等等。它甚至能通过大量的代码分割帮助进行服务端渲染
  const LoadableOtherComponent = Loadable({
    loader: () => import('./OtherComponent'),
    loading: () => <div>Loading...</div>,
  });

  const MyComponent = () => (
    <LoadableOtherComponent/>
  );
```

#### 基于路由的代码分割
``` javascript
  import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
  import Loadable from 'react-loadable';

  const Loading = () => <div>Loading...</div>;

  const Home = Loadable({
    loader: () => import('./routes/Home'),
    loading: Loading,
  });

  const About = Loadable({
    loader: () => import('./routes/About'),
    loading: Loading,
  });

  const App = () => (
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Router>
  );
```
