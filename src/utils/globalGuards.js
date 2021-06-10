/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:46:43
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 01:02:14
 * @Desc: 全局守卫
 */
import store from '@/store'

/**
 * 设置顶部状态栏高度
 */
function setStatusBarHeight(to, from) {
  if (to.query.statusBarHeight) {
    let statusBH = to.query.statusBarHeight
    store.commit('globalStatus/setStatusBarHeight', statusBH)
  }
}

/**
 * 存储登录状态
 */
function setLoginStatus(to, from) {
  if (to.query.key) {
    let accessToken = to.query.key
    store.commit('user/setAccessToken', accessToken)
  }
}

/**
 * 修改页面title
 */
function setDocumentTitle(to, from) {
  document.title = '' // TODO 根据具体的项目自行更改
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
    // console.log(document.title)
  }
}

/**
 * 跳转登录页
 */
function jumpNeedLogin(to, from) {
  if (to.query && to.query.need_login) {
    if (store.getters && !store.getters['/user/accessToken']) {
      this.toast({
        message: '去登录页',
        duration: '3000'
      })
    }
  }
}

export default {
  // 设置顶部状态栏高度
  setStatusBarHeight,
  // 存储登录状态
  setLoginStatus,
  // 修改页面title
  setDocumentTitle,
  // 跳转登录页
  jumpNeedLogin
}
