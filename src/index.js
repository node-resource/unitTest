import React from 'react'
import ReactDom from 'react-dom'
import { DatePicker } from 'antd'

import Chess from '@/modules/chess'
import Counter from '@/Components/counter'

// import 'antd/dist/antd.css';
import '@/assets/style/common.css'

import App from './app'

ReactDom.render(
  <App>
    <Chess/>
    <Counter/>
  </App>,
  document.getElementById('app')
)