import React from 'react'
import HoistNonReactStatics from 'hoist-non-react-statics'
import {Table} from './table'

// 定义基于【基础表格】的高阶组件
// 主要扩展功能：
//   1、支持动态获取数据
//   2、支持展示总记录数
//   更多功能……
const enhanceTable = (BaseTable, getList) => {
  // 包装显示名字以便于调试
  class EnhanceTable extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        trs: getList()
      }
    }
    render () {
      // 过滤掉不相关的属性信息
      // 通过passThroughProps 传递给BaseTable的信息
      const {name, forwardedRef, ...passThroughProps } = this.props;
      return (
        <div>
          <BaseTable trs={this.state.trs} {...passThroughProps} ref={forwardedRef}/>
          <div>总记录数：<span className="font-danger">{this.state.trs.length}</span></div>
          <div>{ name }</div>
        </div>
      )
    }
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  // 通过高阶组件能访问到BaseTable的ref
  let HOC = React.forwardRef((props, ref) => <EnhanceTable {...props} forwardedRef={ref} /> )
  // 拷贝引入组件上的静态方法
  HoistNonReactStatics(HOC, BaseTable)
  return HOC
}

export class HOC extends React.Component {
  constructor () {
    super()
    // 千万注意：不要在render函数里调用高阶组件,因为即使数据不发生任何改变的情况下，render函数也会重新执行一次
    this.Table = enhanceTable(Table, (...args) => ([
      {'proName':"眼镜", 'proId':"1001", 'suPrice':"35", 'supplierName':'必要'},
      {'proName':"眼镜", 'proId':"1001", 'suPrice':"35", 'supplierName':'必要'},
      {'proName':"眼镜", 'proId':"1001", 'suPrice':"35", 'supplierName':'必要'},
      {'proName':"眼镜", 'proId':"1001", 'suPrice':"35", 'supplierName':'必要'},
      {'proName':"眼镜", 'proId':"1001", 'suPrice':"35", 'supplierName':'必要'}
    ]))
    this.state = {
      ths: ['商品名称','商品编号','商品价格','商家名称'],
      refEle: React.createRef()
    }
  }
  componentDidMount () {
    // 我是调用的Table组件的静态方法，快来研究研究是如何调用的呗
    this.Table.show()
    // 我是通过React.forwardRef来实现高阶组件向引入组件的ref传递
    this.state.refEle.current.testRef()
  }
  render () {
    return (
      <div>
        <this.Table ths={this.state.ths} name="高阶组件" ref={this.state.refEle}/>
      </div>
    )
  }
}
