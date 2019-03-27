/**
 * 用canvas模拟节流和防抖
 * 参考网站： http://demo.nimius.net/debounce_throttle/
*/
import React from 'react'
import optimize from './controler'

import '@/assets/style/pages/optimize.css'

class Opt extends React.Component {
  constructor () {
    super()
    this.canvas = null
    this.ctx = null
    this.canvasTimeScale = 5* 1000
    this.marginLeft = 100
    this.paintColors = ["#bbd","#464","#d88"]
    this.moveArea = React.createRef()
  }
  componentDidMount () {
    if(this.canvas) {
      this.ctx = this.canvas.getContext('2d')
      this.canvas.width = window.innerWidth - 250
    }
    this.init()
  }
  init () {
    let box = this.moveArea.current
    this.flush()
    box.addEventListener('mousemove', this.handleMoveRegular)
    box.addEventListener('mousemove', optimize.throttle(this.handleMoveThrottle, 100, this), false)
    box.addEventListener('mousemove', optimize.debounce(this.handleMoveDebounce,100, this), false)
  }
  // 初始化画布
  flush () {
    // 绘制
    this.ctx.fillStyle = '#ddd'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.font      = "200 18px Roboto,Helvetica,Arial"
    // // 绘制常规
    this.ctx.fillStyle = this.paintColors[0]
    this.ctx.fillText('Regular', 0, 100)
    // // 绘制防抖
    this.ctx.fillStyle = this.paintColors[1]
    this.ctx.fillText('Throttle', 0, 300)
    // // 绘制节流
    this.ctx.fillStyle = this.paintColors[2]
    this.ctx.fillText('Debounce', 0, 500)
  }
  // 绘制图案
  paintRect (lang, time) {
    // 如果超过一屏的时候，执行重绘
    if(time > this.canvasTimeScale){
      this.startTime += time;
      time = 0;
      this.flush()
    }
    let x = (this.canvas.width - this.marginLeft) / this.canvasTimeScale * time + this.marginLeft
    let y = (this.canvas.height/3) * lang
    let height = this.canvas.height/3
    this.ctx.fillStyle = this.paintColors[lang]
    this.ctx.fillRect(x, y, 1, height)
  }
  // 获取时间差
  getTimeDiff () {
    let time = +new Date
    if(!this.startTime){
      this.startTime = time
    }
    return time - this.startTime
  }
  // 处理鼠标移动 (常规)
  handleMoveRegular = () => {
    this.paintRect(0, this.getTimeDiff())
  }
  // 处理鼠标移动 (节流)
  handleMoveThrottle = () => {
    this.paintRect(1, this.getTimeDiff())
  }
  // 处理鼠标移动 (防抖)
  handleMoveDebounce = () => {
    this.paintRect(2, this.getTimeDiff())
  }
  render () {
    return (
      <React.Fragment>
        <div className="moveonme" ref={this.moveArea}>move your mouse here</div>
        <canvas className="paintonme" ref={ele => this.canvas = ele} width="600" height="600"></canvas>
      </React.Fragment>
    )
  }
}
export default Opt
