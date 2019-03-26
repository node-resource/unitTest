/**
 * 放大镜
*/
import React from 'react'

export class Zoomer extends React.Component {
  constructor (props) {
    super()
  }
  render () {
    return (
      <div className="zoomer" style={{ width:`${this.props.size.width}px`, height:`${this.props.size.height}px`, left:`${this.props.position.left}px`, top:`${this.props.position.top}px` }} />
    )
  }
}
