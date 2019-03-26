import React from 'react'

export default class Life extends React.Component {
  constructor () {
    super()
    this.state = {
      count: 0
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.color !== nextProps.color || this.state.count !== nextState.color
  }

  render () {
    return (
      <div>
        { this.state.count }
        <span className="btn-info" color={this.props.color} onClick={ () => this.setState(preState => ({count: preState.count + 1})) }>Count:{ this.state.count }</span>
      </div>
    )
  }
}