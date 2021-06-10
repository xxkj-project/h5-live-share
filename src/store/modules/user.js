/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:46:43
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-09-15 16:34:51
 * @Desc:
 */
export default {
  // 开启命名空间
  namespaced: true,

  state: {
    accessToken: '',
    userDetail: {}
  },

  getters: {
    accessToken(state) {
      return state.accessToken
    }
  },

  mutations: {
    setAccessToken(state, accessToken) {
      // console.log(accessToken)
      state.accessToken = accessToken
    },
    userInfo(state, user) {
      // console.log(user)
      state.userDetail = user
    }
  },

  actions: {}
}
