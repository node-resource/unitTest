import React from 'react'
import { Redirect } from 'react-router-dom'


export default {
  path: '/demo',
  component: () => <Redirect to="/demo/chess"/>,
  routes: [
    {
      path: '/demo/chess',
      component: () => import('@/views/demo/chess')
    },{
      path: '/demo/transition',
      component: null
    }
  ]
}