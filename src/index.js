import React from 'react'
import ReactDom from 'react-dom'
import { DatePicker } from 'antd'

// import 'antd/dist/antd.css';
import '@/assets/style/common.css'

// import App from './app'
// import NestRouter from './demo/router/nested'
import SPA from './root'

ReactDom.render(
  <SPA />,
  document.getElementById('app')
)