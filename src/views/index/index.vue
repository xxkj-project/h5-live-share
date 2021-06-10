<!--
 * @Author: wangshengxian
 * @Date: 2020-12-30 14:25:33
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-16 10:29:48
 * @Desc: 分享
-->
<template>
  <div class="share">
    <div class="header">
      <div class="headerLine"></div>
      <div class="headerBox">
        <div class="left">
          <img class="icon-pic" :src="infoData.image" alt="" v-if="infoData.image" />
        </div>
        <div class="right">
          <p class="userName">{{ infoData.nickName }}</p>
          <p class="userId">ID {{ infoData.userId }}</p>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="container">
        <div class="playerWrap" @touchstart="onTouchVideo" v-show="isShowVideo">
          <video
            id="my-player"
            class="video-js"
            x5-video-player-type="h5-page"
            x5-video-player-fullscreen="true"
            x5-video-orientation="landscape"
          ></video>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footerBox">
        <span class="giftBtn" @click="onOpenApp"></span>
        <span class="downloadBtn" @click="onJump"></span>
      </div>
    </div>

    <div class="noData" v-if="isNoData">
      <div class="noDataWrap">
        <p class="desc1">
          <span class="icon"></span>
          <span class="txt">主播正在赶来的路上</span>
        </p>
        <p class="desc2">
          下载APP，观看更多主播
        </p>
      </div>
    </div>

    <div class="maskWrap" @click="onMask" v-show="isMask">
      <span class="maskTxt"></span>
    </div>

    <authTicket :visible.sync="isAuthTicket" @success="handleAuthSuccess" @jump="handleAuthJump" />
  </div>
</template>

<script>
import authTicket from '@/views/components/handleAuthTicket'
import platform from '@/utils/platform'
import wsPlayer from '@/utils/wsPlay'
import { getShareData } from '@/api'
import '@/utils/rotate'
import noKey from '@/mixins/noKey'
import { videoPullUrl, roomIds, appDownloadUrl, socketUrl } from '@/const/global'
import { entryVideoHlsUrl } from '@/utils/utils'
import Socket from '@/utils/socket'
export default {
  name: '',
  mixins: [noKey],
  data() {
    return {
      anchorId: '',
      infoData: {},

      isAuthTicket: false, // 音乐演唱会验证 dialog
      ticketsCode: '', // 票据码

      isShowVideo: true, // 是否显示视频
      isOpenApp: false,
      isMask: false,
      isNoData: true, // 是否没有直播拉流，默认为true
      videoObj: null, // 播放器实例
      // 2021五一音乐演唱会相关
      socketObj: null, // socket模块类
      socketCode: '', // 接收的socket code值，1 正常连接，2 踢人
      isInit: true // 是否初始化
    }
  },
  computed: {
    isWx() {
      return platform.isWechat
    },
    // 拉流地址
    videoHlsUrl() {
      return `${videoPullUrl}/${this.anchorId}/playlist.m3u8`
    }
  },
  components: { authTicket },
  watch: {},
  created() {
    this.anchorId = this.$route.query.anchorId
    if (!this.anchorId) {
      this.$toast('活动暂未开始，请耐心等待')
      return
    }
    this.getData()
  },
  mounted() {
    // TODO: 主播切换后台的时候，当前的拉流会断掉
  },
  methods: {
    // TODO: 验证当前的直播观看是否需要先决条件
    handleValidAnchorId(anchorId) {
      if (this.isWx) {
        this.isMask = true
        return
      }
      console.log('-valid-anchorid-', anchorId, roomIds)
      if (anchorId == roomIds.NEW_YEAR_ROOM_ID) {
        console.log('年会门票限制')
        this.handleNewYearRoomValidate()
        return
      }
      if (anchorId == roomIds.CONCERT_ROOM_ID) {
        console.log('五一音乐演唱会门票限制')
        this.handleConcertRoomValidate()
        return
      }
      if (anchorId == roomIds.TEST_ROOM_ID) {
        console.log('测试视频播放限制')
        this.handleConcertRoomValidate()
        return
      }
      console.log('没有播放限制--白名单')
      this.onPlayHLS()
    },
    // 票据验证成功后，开始连接 websocket
    handleAuthSuccess(data) {
      this.ticketsCode = data
      this.initSocket()
    },
    initSocket() {
      this.socketObj = new Socket({ url: socketUrl })
      this.socketObj.onOpen(() => this.handleOpen())
      this.socketObj.onMessage(res => this.handleMessage(res))
      this.socketObj.onClose(e => this.handleReconnect())
      this.socketObj.onError(e => this.handleReconnect())
    },
    handleOpen() {
      if (this.isInit) this.onPlayHLS()
      let msg = JSON.stringify({ type: 1, data: { ticket: this.ticketsCode } })
      console.log('-send-msg-', msg)
      this.socketObj.ws.send(msg)
    },
    handleMessage(res) {
      console.log('-接收到消息-', res)
      this.socketCode = res.data.code
      console.log('-socket-code-', this.socketCode)
      if (this.socketCode == 2) this.handleRepeatLogin()
    },
    // websocket 重连
    handleReconnect() {
      if (this.socketCode === 2) return
      this.isInit = false
      this.socketObj.reconnect(() => {
        this.socketObj = null
        this.initSocket()
      })
    },
    /**
     * 用户被踢下线
     * 1、清除 tickets_code 本地存储，2、暂停播放，3、关闭websocket
     */
    handleRepeatLogin() {
      sessionStorage.removeItem('tickets_code')
      this.videoObj && this.videoObj.pause()
      this.socketObj.ws.close()
      this.$dialog
        .alert({
          title: '提示',
          message: '检测到您的账号在别的地方登录了'
        })
        .then(() => {})
        .catch(() => {})
    },
    handleNewYearRoomValidate() {
      this.$dialog
        .confirm({
          message: '对不起，本场直播需要门票才能进入，是否购买？',
          confirmButtonText: '去购买',
          confirmButtonColor: '#000',
          cancelButtonColor: '#666'
        })
        .then(() => {
          this.clickEventFunc()
        })
        .catch(() => {})
    },
    handleConcertRoomValidate() {
      this.ticketsCode = sessionStorage.getItem('tickets_code')
      if (this.ticketsCode) {
        this.isAuthTicket = false
        this.initSocket()
        return
      }
      this.isAuthTicket = true
    },
    onPlayHLS() {
      let videoUrl = entryVideoHlsUrl(this.videoHlsUrl)
      this.videoObj = wsPlayer.play('my-player', videoUrl, 'hls', eventType => {
        // console.log('-111-', eventType)
        if (eventType === 'play') {
          this.isOpenApp = true
        }
        if (eventType === 'error') {
          this.isNoData = true
        }
      })
    },
    onMask() {
      this.isMask = false
    },
    onTouchVideo() {
      // TODO: android端手机自带浏览器事件不生效，需要再寻找方法
      console.log('-touch-', this.isOpenApp)
      console.log('-唤起app-')
    },
    // 点击购票判断是否下载过app，若没有下载则跳转到下载页
    handleAuthJump() {
      this.clickEventFunc()
    },
    // TODO: 唤起app时，需要先把直播暂停，android端有些不会自动暂停播放，需要手动暂停
    onOpenApp() {
      if (this.isWx) {
        this.isMask = true
        return
      }
      let androidData = `?anchorId=${this.anchorId}`
      this.clickEventFunc(androidData)
    },
    onJump() {
      if (this.isWx) {
        this.isMask = true
        return
      }
      // TODO: 跳转的时候，android端部分手机自带浏览器不会关闭视频播放，需要手动把视频暂停隐藏掉
      // TODO: 后退的时候，暂时没办法刷新当前页面，再次播放，后续再进行处理
      if (platform.isAndroid) {
        this.isNoData = true
        this.isShowVideo = false
        this.videoObj && this.videoObj.pause()
      }
      window.location.href = appDownloadUrl
    },
    getData() {
      this.$loading.show()
      const params = { id: this.anchorId }
      getShareData(params)
        .then(res => {
          console.log('-data-', res.data)
          this.$loading.hide()
          this.infoData = res.data
          if (!this.infoData.open) {
            this.isNoData = true
            return
          }
          // 正在直播中
          this.isNoData = false
          this.handleValidAnchorId(this.anchorId)
        })
        .catch(err => {
          this.$loading.hide()
        })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@imgUrl: '~@/assets/images/share/';

/deep/ .video-js {
  .vjs-big-play-contain {
    height: 100%;
    z-index: 600;
  }
  .vjs-big-play-button {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 600;
  }
}

.share {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: url('@{imgUrl}noBg.png') no-repeat center / cover;
  overflow: hidden;

  .header {
    height: 50px;
  }

  .main {
    flex: 1;
  }

  .footer {
    height: 56px;
  }
}

.headerBox {
  position: absolute;
  left: 10px;
  top: 5px;
  z-index: 800;
  display: flex;
  align-items: center;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 0 10px 0 5px;

  .left {
    display: inline-block;
    margin-right: 6px;
    .icon-pic {
      display: block;
      width: 30px;
      height: 30px;
      background: rgb(94, 180, 180);
      border-radius: 15px;
    }
  }

  .right {
    display: inline-block;
    font-size: 12px;
    color: #fff;
  }
}

.container {
  height: 100%;
}

.footerBox {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 800;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 14px;

  .giftBtn {
    width: 44px;
    height: 44px;
    background: url('@{imgUrl}giftBtn.png') no-repeat center;
    background-size: 100% 100%;
  }

  .downloadBtn {
    width: 155px;
    height: 37px;
    background: url('@{imgUrl}downloadBtn.png') no-repeat center / cover;
  }
}

.noData {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('@{imgUrl}noBg.png') no-repeat center / cover;
  font-size: 15px;
  color: #fff;

  .desc1 {
    display: flex;
    justify-content: center;
    margin-bottom: 26px;

    .icon {
      width: 9px;
      height: 10px;
      background: url('@{imgUrl}icon-dot.png') no-repeat center / cover;
    }

    .txt {
      padding: 6px 0 0 4px;
    }
  }

  .desc2 {
    display: flex;
    justify-content: center;
    font-size: 18px;
  }
}

.playerWrap {
  width: 100%;
  height: 100%;

  .video-js {
    width: 100%;
    height: 100%;
    // height: 50px;
  }
}

.maskWrap {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  padding: 8px 25px 0 0;
  .maskTxt {
    display: block;
    width: 281px;
    height: 150px;
    background: url('@{imgUrl}mask_txt.png') no-repeat center / cover;
  }
}
</style>
