import React from 'react'
import ReactDOM from 'react-dom'

const RootApp = document.getElementById('root-app')

class Modal extends React.Component {
  constructor () {
    super()
    this.el = document.createElement('div')
  }
  componentDidMount () {
    RootApp.appendChild(this.el)
  }
  componentWillUnmount () {
    RootApp.removeChild(this.el)
  }
  render () {
    // Portals 提供了一种很好的将子节点渲染到父组件以外的 DOM 节点的方式。
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

const Child = (props) => {
  // 通过 Portals 进行事件冒泡
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <button className="modal">Click me</button>
  )
}

class Portal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  handleClick = () => {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState((prevState) => ({
      count: prevState.count + 1 // 为何不能用++
    }))
  }
  render () {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks:{this.state.count}</p>
        <Modal> <Child/> </Modal>
      </div>
    )
  }
}



export default Portal