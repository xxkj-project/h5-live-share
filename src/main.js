/*
 * @Author: wangshengxian
 * @Date: 2020-04-20 15:29:40
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 01:03:51
 * @Desc:
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Loading from '@/components/loading'
// 全局样式
import 'normalize.css/normalize.css'
import '@/styles/index.less'
// 路由守卫
import '@/utils/routerGuards.js'
// vconsole调试工具
import '@/utils/vconsole.js'
// rem适配
import '@/utils/flexible.js'
// vant按需引入
import '@/utils/importVant.js'

const hls = require('videojs-contrib-hls')
Vue.use(hls)

Vue.use(Loading)

Vue.config.productionTip = false

// window.addEventListener(
//   'popstate',
//   function(e) {
//     router.isBack = true
//   },
//   false
// )

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
