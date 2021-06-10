/*
 * @Author: wangshengxian
 * @Date: 2021-01-13 00:23:55
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 00:36:49
 * @Desc:
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import(/* webpackChunkName: 'index' */ '@/views/index'),
    meta: {
      title: '分享'
    }
  }
]

console.log('-base-url-', process.env.BASE_URL)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
