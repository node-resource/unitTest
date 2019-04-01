import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import routes from '../router'

const LoadRoute = (route) => {
  let {routes, redirect, ...routeNow} = route
  if(routes && routes.length > 0){
    let component =  routeNow.redirect ? <Redirect from={routeNow.path} to={routeNow.redirect}/> : <Route path={routeNow.path} component={routeNow.component}/>
    console.log(component)
    return (
      <Route render={ ({location}) => (
        <div>
          { component }
          <ul>
            { 
              routes.map((sub, idx) => (
                <li key={idx}><LoadRoute {...sub}/></li>
              )) 
            }
          </ul>
        </div>
      )}/>
    )
    // <Route
    //   {...routeNow}
    //   render={props => (
    //     // pass the sub-routes down to keep nesting
    //     <route.component {...props} routes={routes} />
    //   )}
    // />
  }
  return <Route {...routeNow}/>
}

class SPA extends React.Component {
  render () {
    return (
      <Router>
        <nav>
          <Link to="/demo/chess">chess</Link>
        </nav>
        <ul>
          { 
            routes.map((route, idx) => (
              <li key={idx}>
                <LoadRoute {...route}/>
              </li>
            )) 
          }
        </ul>
      </Router>
    )
  }
}

export default SPA
