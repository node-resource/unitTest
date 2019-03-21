import React from 'react'
import Item from 'antd/lib/list/Item';

// 函数定义组件
const Head = (props) => {
  let closeEle = props.showClose ? <span className="icon-close" onClick={props.handleCancel}></span> : null
  return (
    <div>
      <span>{ props.title }</span>
      { closeEle }
    </div>
  )
}
const Body = (props) => {
  return (
    <ul>
      { props.list.map((item,idx) => <li key={item.id}>{ item.name }</li>) }
    </ul>
  )
}
const Foot = (props) => {
  return (
    <div>
      <span className="btn-disable" onClick={props.handleCancel}>取消</span>
      <span className="btn-info" onClick={props.handleSure}>确定</span>
    </div>
  )
}

const Box = (props) => {
  return props.show ? 
      (<div className="dialog">
        <div className="dialog-head">{ props.head }</div>
        <div className="dialog-body">{ props.children }</div>
        <div className="dialog-foot">{ props.foot }</div>
      </div>) : null
}

// 类（构造函数）定义组件
class Dialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showClose: true,
      title: '我是弹框标题',
      list: [
        {name:"列表1", id:"10001"},
        {name:"列表2", id:"10002"},
        {name:"列表3", id:"10003"},
        {name:"列表4", id:"10004"},
        {name:"列表5", id:"10005"},
        {name:"列表6", id:"10006"}
      ]
    }
  }
  handleCancel = () => {
    this.props.closeDialog()
  }
  handleSure = () => {
    if(this.state.list.length > 5){
      alert('总个数大于5');return false;
    }
    this.handleCancel()
  }
  render () {
    return (
      <Box show={this.props.show} head={<Head showClose={this.state.showClose} title={this.state.title} handleCancel={this.handleCancel}/>} foot={<Foot handleCancel={this.handleCancel} handleSure={this.handleSure}/>}>
        <Body list={this.state.list}/>
      </Box>
    )
  }
}

export default Dialog
