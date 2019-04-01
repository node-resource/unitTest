import React from 'react'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

import '@/assets/style/pages/transition.css'

const style = {}
style.fill = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
};

style.content = {
  ...style.fill,
  top: "40px",
  textAlign: "center"
};

style.nav = {
  padding: 0,
  margin: 0,
  position: "absolute",
  top: 0,
  height: "40px",
  width: "100%",
  display: "flex"
};

style.navItem = {
  textAlign: "center",
  flex: 1,
  listStyleType: "none",
  padding: "10px"
};

style.hsl = {
  ...style.fill,
  color: "white",
  paddingTop: "20px",
  fontSize: "30px"
};

style.rgb = {
  ...style.fill,
  color: "white",
  paddingTop: "20px",
  fontSize: "30px"
};


const NavLink = (props) => {
  return (
    <li style={style.navItem}>
      <Link {...props}/>
    </li>
  )
}

const HSL = ({match: {params}}) => {
  return (
    <div style={{...style.fill, ...style.hsl, backgroundColor:`hsl(${params.h}, ${params.s}%, ${params.l}%)`}}>
      hsl({params.h},{params.s}%, {params.l}%)
    </div>
  )
}

const RGB = ({match: {params}}) => {
  return (
    <div style={{...style.fill, ...style.rgb, backgroundColor:`rgb(${params.r}, ${params.g}, ${params.b})`}}>
      rgb({params.r},{params.g}, {params.b})
    </div>
  )
}

export const Transition = (props) => {
  return (
    <Route {...props} render={ ({location}) => (
      <div style={style.fill}>
        <Route exact path="/transition"
          render={() => <Redirect to="/transition/hsl/10/90/50" />}
        />
        <nav>
          <ul style={style.nav}>
            <NavLink to="/transition/hsl/10/90/50">Red</NavLink>
            <NavLink to="/transition/hsl/120/100/40">Green</NavLink>
            <NavLink to="/transition/rgb/33/150/243">Blue</NavLink>
            <NavLink to="/transition/rgb/240/98/146">Pink</NavLink>
            <NavLink to="/">exit</NavLink>
          </ul>
        </nav>
        <div style={style.content}>
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
              <Switch location={location}>
                <Route path="/transition/hsl/:h/:s/:l" component={ HSL }/>
                <Route path="/transition/rgb/:r/:g/:b" component={ RGB }/>
                <Route render={ () => <h1>Not found! 404</h1>}/>
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    )}/>
  )
}