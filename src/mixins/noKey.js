/*
 * @Author: wangshengxian
 * @Date: 2021-01-14 16:18:57
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-21 15:54:32
 * @Desc: 点击按钮 --> 唤起app/去下载页 -- mixins
 */
import platform from '@/utils/platform'
import { mapState } from 'vuex'
import { appDownloadUrl, protocolHead } from '@/const/global'
export default {
  data() {
    return {
      timerObj: null
    }
  },
  computed: {
    ...mapState('user', ['accessToken']),
    isNoKey() {
      console.log('-key-mixin-复用-', !this.accessToken)
      return this.accessToken == 'undefined' || !this.accessToken
    }
  },
  mounted() {
    window.addEventListener('pagehide', this.handlePagehide)
    window.addEventListener('visibilitychange', this.handleVisibility)
  },
  destroyed() {
    window.removeEventListener('pagehide', this.handlePagehide)
    window.removeEventListener('visibilitychange', this.handleVisibility)
  },
  methods: {
    handlePagehide() {
      // TODO: 该函数会在打开新的界面之后触发，暂时不能解决唤起ios 唐僧直播app后还会去跳转下载页的bug
      console.log('-界面隐藏-ios可以监听-')
      clearTimeout(this.timerObj)
    },
    handleVisibility() {
      console.log('-visibility-安卓可以监听-')
      let hidden =
        window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
      console.log('-hidden-', hidden)
      if (hidden) {
        clearTimeout(this.timerObj)
      }
    },
    /**
     * 点击事件
     * @param {string} androidData 唤起 android 客户端地址(仅作参考): ?anchorId=2008200?h5_url=网页链接 (可不传)
     * @param {string} iosData 唤起 ios 客户端地址(仅作参考): 2008200?h5_url=网页链接 (可不传)
     */
    clickEventFunc(androidData, iosData) {
      console.log('-click-mixin-复用-')
      console.log('-params-data-', androidData, iosData)
      if (platform.isAndroid) {
        console.log('-jump-url-', `${protocolHead.android}${androidData}`)
        window.location.href = androidData ? `${protocolHead.android}${androidData}` : protocolHead.android
      }
      if (platform.isIos) {
        window.location.href = iosData ? `${protocolHead.ios}${iosData}` : protocolHead.ios
      }
      this.timerObj = setTimeout(() => {
        window.location.href = appDownloadUrl
      }, 3000)
    }
  }
}
