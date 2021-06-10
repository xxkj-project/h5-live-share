/*
 * @Author: wangshengxian
 * @Date: 2021-01-13 00:23:55
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 01:03:04
 * @Desc:
 */
// 全局状态模块
export default {
  // 开启命名空间
  namespaced: true,
  state: {
    device: '',
    statusBarHeight: '20',
    key: '',
    scollTop: 0, // 滚动高度
    loadErrorCount: 0 // 加载失败次数
  },
  getters: {
    statusBarHeight(state) {
      return state.statusBarHeight
    },
    scollTop(state) {
      return state.scollTop
    },
    loadErrorCount(state) {
      return state.loadErrorCount
    }
  },
  mutations: {
    setStatusBarHeight(state, h) {
      state.statusBarHeight = h
    },
    setScollTop(state, scollTop) {
      state.scollTop = scollTop
    },
    setLoadErrorCount(state) {
      console.log('-mutations-state-loadErrorCount')
      state.loadErrorCount++
    },
    clearLoadErrorCount(state) {
      state.loadErrorCount = 0
    }
  },
  actions: {}
}
