/**
 * 根据相应的平台做处理
 * 针对客户端页面头部的处理
 * */
import platform from '@/utils/platform'
import iosBridge from '@/utils/bridge'

export default {
  mounted() {
    this.setMixinsJsBridge()
  },
  methods: {
    setMixinsJsBridge() {
      console.log('-mixinsJsBridge-')
      if (platform.isIos) {
        // console.log('-ios-')
        // 设置ios顶部标题栏,0使用h5标题栏，1使用ios标题栏
        iosBridge.callNativeBridge('showNavigationBar', '0', null)
        iosBridge.callNativeBridge('showBackButton', '0', null)
      }
    }
  }
}
