/**
 * 定义节流和防抖的控制器
*/
export default {
  // 节流  多长时间执行一次问题
  throttle (fun, threshold, scope) {
    threshold = threshold || 300
    let start
    let last
    let deferTime
    return function() {
      let ctx = scope || this
      const now = +new Date
      // 还在当前周期内
      if(last && now < last + threshold) {
        clearTimeout(deferTime)
        deferTime = setTimeout(() => {
          last = now
          fun.apply(ctx, arguments)
        }, threshold)
      }else {
        last = now
        fun.apply(ctx, arguments)
      }
    }
  },
  // 防抖  -> 上一个动作结束之后，最少多长时间之后才进行下一次操作
  debounce (fun, wait, scope) {
    let timeout
    return function() {
      let ctx = scope || this
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null // 释放内存
        fun.apply(ctx, arguments)
      }, wait);
    }
  }
}