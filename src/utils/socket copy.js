// websocket 相关
// const wsUrl = 'ws://192.168.90.136:50670/api/v1/tickets'
// const wsUrl = 'ws://54.222.167.84:50670/api/v1/tickets'

const wsUrls = {
  test: 'ws://54.222.167.84:50669/api/v1/tickets',
  prod: 'ws://live.whkuaiyu.com:50669/api/v1/tickets'
}

// 基本配置信息
const config = {
  // 是否自动重连,
  isReconnect: true,
  // 重连时间间隔
  reconnectTime: 5000,
  // 重连次数,
  reconnectCount: 10
}

let socket = {
  connectStatus: false, // 连接状态
  reconnectTimer: null // 重连计时器
}

/**
 * 创建webSocket实例
 */
function initSocket(callback) {
  let url = process.env.VUE_APP_SERVER_ENV === 'prod' ? wsUrls['prod'] : wsUrls['test']
  let ws = new WebSocket(url)
  ws.onopen = () => {
    console.log('-建立websocket连接-', ws)
    socket.connectStatus = true
    callback('open')
  }
  ws.onmessage = e => {
    console.log('-接收到socket消息-', e)
    const res = JSON.parse(e.data)
    callback('message', res)
  }
  ws.onclose = e => {
    console.log('-监听到websocket关闭-', e)
    socket.connectStatus = false
    callback('close', e)
  }
  ws.onerror = e => {
    console.log('-监听到websocket连接出错了-', e)
    socket.connectStatus = false
    callback('error', e)
  }
  return ws
}

function reconnect() {
  if (socket.connectStatus) {
    console.log('-已经重新建立了连接，不需要再重连了-')
    return
  }
  console.log('-开始重连-')
  socket.connectStatus = true
  // 清除重连计时器
  socket.reconnectTimer && clearTimeout(socket.reconnectTimer)
  socket.reconnectTimer = setTimeout(() => {
    socket.connectStatus = false
    initSocket()
  }, config.reconnectTime)
}

export default {
  /**
   * 初始化
   */
  initSocket,
  /**
   * 重连
   */
  reconnect
}
