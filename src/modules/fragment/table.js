import React from 'react'
import PropTypes from 'prop-types'

// 定义表格头部
const Th = (props) => {
  return (
    <>
      {
        props.ths.map( (th, idx) => <th key={idx}>{th}</th>)
      }
    </>
  )
}
const Thead = (props) => {
  return (
    <thead>
      <tr>
        <Th ths={props.ths} />
      </tr>
    </thead>
  )
}
Thead.propTypes = {
  ths: PropTypes.arrayOf(PropTypes.string)
}
// 定义tbody
const Tr = (props) => {
  return (
    <tr>
      {
        Object.values(props.tdInfo).map((td, idx) => <td key={idx}>{td}</td>)
      }
    </tr>
  )
}
const TBody = (props) => {
  return (
    <tbody>
      {
        props.trs.map((tr, idx) => (
          <Tr key={idx} tdInfo={tr}/>
        ))
      }
    </tbody>
  )
}
TBody.propTypes = {
  trs: PropTypes.arrayOf(PropTypes.object)
}

// 定义表格
export class Table extends React.Component {
  constructor (props) {
    super(props)
  }
  static defaultProps = {
    role: 'table',
    ths: [],
    trs: []
  }
  testRef () {
    console.log("我是通过React.forwardRef方法来实现访问高阶组件中引入组件的ref传递的")
  }
  render () {
    return (
      <table role={this.props.role}>
        <Thead ths={this.props.ths}/>
        <TBody trs={this.props.trs}/>
      </table>
    )
  }
}
// 定义静态方法
Table.show = () => console.info('我是静态方法哦')