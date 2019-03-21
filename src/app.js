import React from 'react'
import PropTypes from 'prop-types'

class App extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div>{ this.props.children }</div>
    )
  }
}
App.propTypes = {
  children: PropTypes.element.isRequired
}

export default App