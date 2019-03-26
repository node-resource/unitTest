/**
 * 放大镜效果
*/
import React from 'react'

import '@/assets/style/pages/zoomer.css'
import {Small} from './small'
import {Big} from './big'

export class Magnifier extends React.Component {
  constructor (props) {
    super()
    this.refreshBig = this.refreshBig.bind(this)
    this.state = {
      src: 'http://img.zcool.cn/community/01b1af56ed122132f875a944735652.jpg@900w_1l_2o_100sh.jpg',
      scale: 2,
      position: {
        left: 0,
        top:0
      }
    }
  }
  refreshBig (x, y) {
    this.setState(preState => ({
      position: {
        left: -preState.scale * x,
        top: - preState.scale * y
      }
    }))
  }
  render () {
    return (
      <>
        <Small src={this.state.src} size={{width:100,height:100}} refreshBig={ this.refreshBig}/>
        <Big position={this.state.position} size={{width:400, height:400}} src={this.state.src}/>
      </>
    )
  }
}




