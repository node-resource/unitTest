/**
 * 原图
*/
import React from 'react'
import throttle from 'lodash.throttle' // 引入节流
import debounce from 'lodash.debounce' // 引入防抖
import rafSchedule from 'raf-schd' // 引入浏览器渲染帧  -> 不需要设置时间

import {Zoomer} from './zoomer'

export class Small extends React.Component {
  constructor (props) {
    super()
    this.small = React.createRef()
    this.handleMoveThrottle = throttle((left, top) => this.props.refreshBig(left, top), 100)
    this.state = {
      disX: null,
      disY: null,
      width:null,
      height:null,
      left: 0,
      top:0
    }
  }
  componentDidMount () {
    const box = this.small.current
    this.setState({
      disX: box.offsetLeft,
      disY: box.offsetTop,// 使用clientY的时候包括状态栏的高度；使用pageY的时候，不包括状态栏的高度
      width: box.offsetWidth,
      height: box.offsetHeight
    })
  }
  // componentWillUnmount() {
  //   this.scheduleUpdate.cancel();
  // }
  handleMouseMove = (event) =>{
    console.log(event)
    const x = event.pageX - this.props.size.width/2 - this.state.disX
    const y = event.pageY - this.props.size.height/2 - this.state.disY
    this.setState(state => ({
      left: x < 0 ? 0 : (x + this.props.size.width < state.width ? x : state.width-this.props.width),
      top: y < 0 ? 0 : (y + this.props.size.height < state.height ? y : state.height-this.props.height)
    }))
    this.handleMoveThrottle(this.state.left, this.state.top)
  }
  render () {
    const {src,refreshBig, ...smallProps} = this.props
    return (
      <div className="smallShow" onMouseMove={this.handleMouseMove} ref={this.small}>
        <img src={src}/>
        <Zoomer {...smallProps} position={{left:this.state.left, top:this.state.top}}/>
      </div>
    )
  }
}
