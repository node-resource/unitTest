import React from 'react'
import PropTypes from 'prop-types'

class Counter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0
    }
    // This binding is necessary to make `this` work in the callback
    // 你必须谨慎对待 JSX 回调函数中的 this，类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined
    // this.handleClick = this.handleClick.bind(this)
  }

  // 通过定义静态属性来为props指定默认值；和 Counter.defaultProps 的方法有相同想过
  static defaultProps = {
    step: 2
  }

  componentDidMount () {
    this.timer = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount () {
    clearInterval(this.timer)
  }
  tick () {
    // 这种处理主要是为了防止数据发生异步，比如ajax
    this.setState((preState, props) => ({
      count: preState.count + props.step
    }))
    if(this.state.count >= 10){
      clearInterval(this.timer)
    }
  }
  // 此处使用箭头函数是为了保证this在回调函数中统一
  handleClick = (count, e) =>{
    // 换成 return false 来尝试阻止浏览器默认行为看看
    e.preventDefault()
    alert(count)
    console.log(this) // 尝试如果不在constructor中进行强制this绑定会发生什么
    console.error('在 React 中另一个不同是你不能使用返回 false 的方式阻止默认行为。你必须明确的使用 preventDefault')
  }
  render () {
    return (
      <div>
        <a href="http://www.baidu.com" onClick={this.handleClick.bind(this, this.state.count)} className="btn-info">阻止默认行为</a>
        我从{ this.props.step }开始,我现在是{ this.state.count }。
      </div>
    )
  }
}
// 定义默认值
// Counter.defaultProps ={
//   step: 1
// }

Counter.propTypes = {
  step: PropTypes.number
}

export default Counter