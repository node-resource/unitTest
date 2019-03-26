import React from 'react'

const Input = (props) => {
  return (
    <input ref={props.inputRef}/>
  )
}

class AutoFocus extends React.Component {
  constructor () {
    super()
    this.inputRef = null
  }
  componentDidMount () {
    this.inputRef && this.handleClick()
  }
  handleClick = () => {
    // 想一想，为何这个地方不加current
    this.inputRef.focus()
  }
  render () {
    return (
      <div>
        <Input inputRef={el => this.inputRef = el}/>
        <span className="btn-info" onClick={this.handleClick}>点击我</span>
      </div>
    )
  }
}

export default AutoFocus