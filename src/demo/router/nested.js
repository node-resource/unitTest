import React from 'react'
import { 
  BrowserRouter as Router, 
  Route, 
  Link,
  Redirect,
  withRouter,
  Switch 
} from 'react-router-dom'

import Recursive from './recursive'
import {Transition} from './transition'

class Head extends React.PureComponent {
  render () {
    return (
      <ul>
        <li><Link exact to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
        <li><Link to="/private">private</Link></li>
        <li><Link to="/transition">transition</Link></li>
        <li><Link to="/no">重定向</Link></li>
      </ul>
    )
  }
}

const Home = () => {
  return (<h2>home page</h2>)
}
const About = () => {
  return (<h2>about page</h2>)
}

const Item = ({match}) => {
  return (<h3>Requested Param: {match.params.id}</h3>)
}
const Topic = (props) => {
  return (
    <ul>
      <li><Link to={`${props.url}/components`}>components</Link></li>
      <li><Link to={`${props.url}/props-v-state`}>props-v-state</Link></li>
    </ul>
  )
}
const Topics = ({match}) => {
  return (
    <>
      <h2>Topics page</h2>
      <Topic url={match.url}></Topic>
      <Route path={`${match.path}/:id`} component={Item}/>
      <Route exact path={match.path} render={() => <h3>Please select a topic.</h3>}/>
    </>
  )
}




const fakeAuth = {
  isAuthenticated: false,
  authenticate (cb) {
    this.isAuthenticated = true
    cb && cb()
  },
  signout (cb) {
    this.isAuthenticated = false;
    cb && cb()
  }
}

const AuthButton = withRouter(({ history }) => 
  fakeAuth.isAuthenticated ? (
    <>
      <span className="font-success">欢迎登陆</span>
      <span className="btn-info btn-mini" onClick={() => fakeAuth.signout(() => history.push('/'))}>退出</span>
    </>
  ):(
    <h1 className="font-danger">您还未登陆~</h1>
  )
   
)

const Protected = () => {
  return <h3>Protected</h3>
}

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render = {
        props => fakeAuth.isAuthenticated ? (<Component {...props}/>)
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

class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      redirectToReferrer: false
    }
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }
  render () {
    let { redirectToReferrer } = this.state
    let { from } = this.props.location.state || {from: {pathname:"/"}}
    if(redirectToReferrer) return <Redirect to={ from }/>
    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <span className="btn-info btn-mini" onClick={this.login}>开始登陆</span>
      </div>
    )
  }
}

const OldSchoolMenuLink = ({label, to, exact}) => {
  return (
    <Route
      path={to}
      exact={exact}
      children={
        ({match}) => (
          <div className={match?'active':''}>
            <Link to={to}>{label}</Link>
          </div>
        )
      }
    />
  )
}

const NoMatch = ({location}) => {
  return (<h3>No match for <code>{location.pathname}</code></h3>)
}

export default class Nested extends React.Component {
  render () {
    return (
      <Router>
        <AuthButton/>
        <Head />
        <OldSchoolMenuLink exact={true} to="/test" label="test-router"/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/private" component={Protected}/>
          <Redirect from="/no" to="/login" />  {/* 重定向 */}
          <Transition path="/transition" />
          <Route component={NoMatch}/>
        </Switch>
        {/* <Recursive/> */}
      </Router>
    )
  }
}
