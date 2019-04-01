import React from 'react'
import Loadable from 'react-loadable'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Loading = () => (<div>Loading...</div>)
// 以下为使用 react-loadable 进行异步加载
const Chess = Loadable({
  loader: () => import('@/modules/chess'),
  loading: Loading
})
const Life = Loadable({
  loader: () => import('@/modules/lifeCycle'),
  loading: Loading
})
const AutoFocus = Loadable({
  loader: () => import('@/components/autofocus'),
  loading: Loading
})
const Portal = Loadable({
  loader: () => import('@/modules/portals'),
  loading: Loading
})
const Opt = Loadable({
  loader: () => import('@/modules/throttle_debounce'),
  loading: Loading
})
import {HOC} from '@/modules/fragment/hoc'
import {Magnifier} from '@/modules/magnifier'


const usePortal = false
const Root = !usePortal ? (<Router>
                              <nav>
                                <ul>
                                  <li><Link to={{ pathname: "/opt", search: "?name=netflix">opt</Link></li>
                                  <li><Link to="/chess">chess</Link></li>
                                  <li><Link to="/life">life</Link></li>
                                  <li><Link to="/autoFocus">autoFocus</Link></li>
                                  <li><Link to="/hoc">hoc</Link></li>
                                  <li><Link to="/magnifier">magnifier</Link></li>
                                </ul>
                              </nav>
                              <Route exact path="/opt" component={Opt}/>
                              <Route path="/chess" component={Chess}/>
                              <Route path="/life" component={Life}/>
                              <Route path="/autoFocus" component={AutoFocus}/>
                              <Route path="/hoc" component={HOC}/>
                              <Route path="/magnifier" component={Magnifier}/>
                            </Router>) : (<Portal/>)


// 如果不适用es6，可以考虑引入create-react-class
// 参考：https://react.docschina.org/docs/react-without-es6.html
class App extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
     {/* 在这里写注释 */}
    return Root
  }
}
App.propTypes = {
  // children: PropTypes.element.isRequired
}

export default App