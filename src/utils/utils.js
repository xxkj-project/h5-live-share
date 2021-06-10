import md5 from 'js-md5'
/**
 * hls协议的播放流，添加防盗链后的播放地址
 */
export function entryVideoHlsUrl(url) {
  let mid = url.split('/')
  // console.log('-mid-', mid)
  let flowName = mid[mid.length - 2]
  // console.log('-流名-', flowName)
  let wsTime = Math.floor(new Date().getTime() / 1000)
  wsTime = wsTime.toString(16) // 16进制时间格式
  // console.log('-wsTime-', wsTime)
  let wsSecret = `${flowName}${wsTime}tangseng`
  wsSecret = md5(wsSecret)
  // console.log('-ws-secret-', wsSecret)
  return url + '?wsSecret=' + wsSecret + '&wsTime=' + wsTime
}
