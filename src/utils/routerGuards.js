/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:46:43
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 00:50:48
 * @Desc:
 */
// 路由守卫
import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import glg from './globalGuards'

// NProgress.configure({ showSpinner: false }) // 禁用进度环

router.beforeEach((to, from, next) => {
  // console.log('-router-before-', to, from)

  // first progress bar
  // NProgress.start()
  // 顶部状态栏高度(setStatusBarHeight)
  glg.setStatusBarHeight(to, from)
  // 存储登录状态(setLoginStatus)
  glg.setLoginStatus(to, from)
  // 判断用户是否需要登录访问(jumpNeedLogin)
  // glg.jumpNeedLogin(to, from)
  // 路由改变修改页面title(setDocumentTitle)
  glg.setDocumentTitle(to, from)

  next()
})

router.afterEach(() => {
  // finish progress bar
  // NProgress.done()
})
