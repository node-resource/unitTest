import React from 'react'
import ReactDom from 'react-dom'
import { DatePicker } from 'antd'

// import 'antd/dist/antd.css';
import '@/assets/style/common.css'

import App from './app'

ReactDom.render(
  <App/>,
  document.getElementById('app')
)