import React from 'react'

function Waring (props) {
  // 在极少数情况下，你可能希望隐藏组件，即使它被其他组件渲染。让 render 方法返回 null 而不是它的渲染结果即可实现
  if (!props.warn) {
    return null;
  }
  return (
    <div className="font-warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render() {
    return (
      <div>
        <Waring warn={this.state.showWarning} />
        <span className="btn-danger" onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </span>
      </div>
    );
  }
}

export default Page
