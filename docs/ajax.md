## 怎么发送ajax
任何你喜欢的ajax库，你都可以使用。比如 `axios`,`jquery Ajax`以及浏览器内置的`window.fetch`等都可以使用

## 在react中何时发送ajax请求
在 `componentDidMount` 生命周期方法内调用ajax。这样你才能在收到数据时使用 `setState` 更新组件。

``` javascript
  class Userlist extends React.Component {
    constructor () {
      super()
      this.state = {
        error: null,
        loaded: false,
        data: []
      }
    }
    componentDidMount () {
      fetch('http://api.biyao.com/userlist')
      .then(res => res.json())
      .then(res => {
        this.setState({
          error: res.error,
          loaded: true,
          data: res.data
        })
      }, error => {
        this.setState({
          loaded: true,
          error
        })
      })
    }
    render () {
      const {error, loaded, data} = this.state
      if(error){
        return <div>error: {error.message}</div>
      }else if(!loaded){
        return <div>loading...</div>
      }else{
        return (
          {
            <ul>
              {
                data.map((item, idx) => (
                  <li key={idx}>{item.name}</li>
                ))
              }
            </ul>
          }
        )
      }
    }
  }
  
```
