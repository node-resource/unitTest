/**
 * 大图
*/
import React from 'react'

export class Big extends React.Component {
  constructor (props) {
    super()
  }
  render () {
    return (
      <div className="bigShow">
        <img src={this.props.src} style={{ left: `${this.props.position.left}px`,top: `${this.props.position.top}px`,width: `${this.props.size.width}px`,height: `${this.props.size.height}px` }}/>
      </div>
    )
  }
}
