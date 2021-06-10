/**
 * 播放限制 房间 id
 */
export const roomIds = {
  TEST_ROOM_ID: '2008189', // 测试房间 id
  NEW_YEAR_ROOM_ID: '20073630', // 年会活动房间 id
  CONCERT_ROOM_ID: '19999699' // 2021五一音乐演唱会活动 房间id
}

/**
 * 拉流域名
 */
export const videoPullUrl = 'http://h5pull.whkuaiyu.com/live'

/**
 * app下载页地址
 */
export const appDownloadUrl = (() => {
  let urls = {
    test: 'http://twww.tangseng.io/download/index.html',
    prod: 'http://down.tangseng.io/download/index.html'
  }
  return process.env.VUE_APP_SERVER_ENV === 'prod' ? urls.prod : urls.test
})()

/**
 * socket 连接地址
 */
export const socketUrl = (() => {
  const wsUrls = {
    test: 'ws://54.222.167.84:50669/api/v1/tickets',
    prod: 'ws://live.whkuaiyu.com:50669/api/v1/tickets'
  }
  return process.env.VUE_APP_SERVER_ENV === 'prod' ? wsUrls.prod : wsUrls.test
})()

/**
 * 唤起客户端app协议url
 */
export const protocolHead = {
  android: 'app://com.xinxin.tangseng',
  ios: 'tangsengLive://'
}
