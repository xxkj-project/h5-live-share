/*
 * @Author: wangshengxian
 * @Date: 2020-04-22 18:33:57
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 01:41:21
 * @Desc: 请求模块
 */

import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

console.log('-server-url-', process.env.VUE_APP_SERVER_URL, '-env-', process.env.NODE_ENV)
const service = axios.create()

// request interceptor
service.interceptors.request.use(
  config => {
    config.baseURL = process.env.NODE_ENV === 'production' ? `${process.env.VUE_APP_SERVER_URL}/live` : '/live'
    config.timeout = config.timeout || 10000
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.method = config.method || 'post'
    if (config.method === 'post') {
      config.data = config.data || {}
    } else if (config.method === 'get') {
      config.params = config.data || config.params
    }
    if (store.state.user.accessToken) {
      config.headers['key'] = store.state.user.accessToken
    }
    config.headers['language'] = 0
    return config
  },
  error => {
    // Do something with request error
    console.log('-req-error-', error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log('-res-', res)
    if (+res.code === 200) {
      return res
    }
    Toast({
      message: 'error：' + res.msg,
      duration: 2000
    })
    return Promise.reject(res)
  },
  error => {
    console.log('_RES_ERROR_', error, error.message)
    Toast({
      message: 'error：' + error.message,
      duration: 2000
    })
    return Promise.reject(error)
  }
)

export default service
