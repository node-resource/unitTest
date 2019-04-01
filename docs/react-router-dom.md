## react-router-dom
参考地址：https://reacttraining.com/react-router/web/example/animated-transitions

首先引入`react-router-dom`到你的项目依赖
``` javascript
  import React, { Component } from "react";
  import { 
    BrowserRouter as Router, 
    Route, 
    Link,
    Redirect,
    withRouter
  } from 'react-router-dom'
```

### Route
定义路由对应的组建视图，比如：
``` html
  <Router>
    <!-- 可以匹配以/开头的任意路由，如：/home 等 -->
    <Route path="/:id" component={ Child }/>
    <!-- 只可以匹配： /order/asc  或者 /order/desc -->
    <Route path="/order/:direction(asc|desc)" component={ Order }/>
  </Router>
```

### Link
``` html
  <Router>
    <!-- 点击后，调转到路由 `/netflix` -->
    <Link to="/netflix">Netflix</Link>
  </Router>
```

### Redirect
重定向到下一个路由
``` javascript
  const PrivateRoute = ({component: Component, ...rest}) => {
    let isDirect = false
    return (
      <Route
        {...rest}
        render = {
          props => isDirect ? (<Component {...props}/>)
            : (
              <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
              }}/>
            )
        }
      />
    )
  }
```
### withRouter
记录路由历史栈
``` javascript
  const AuthButton = withRouter(({ history }) => <span className="btn-info btn-mini" onClick={() => history.push('/') }>退出</span>)
  )
```

### Switch
A <Switch> renders the first child <Route> that matches. A <Route> with no path always matches.
