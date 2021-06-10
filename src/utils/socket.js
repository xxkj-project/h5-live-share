/**
 * socket模块封装
 */
class Socket {
  config = {
    isReconnect: true, // 是否自动重连
    reconnectCount: 10 // 重连次数
  }
  reconnectTime = 5000 // 重连时间间隔
  ws = null // socket实例
  connectStatus = false // 连接状态
  reconnectTimer = null // 重连计时器
  params = null // 类的参数

  constructor(params) {
    this.params = params
    this.init()
  }

  init() {
    this.reconnectTimer && clearInterval(this.reconnectTimer)
    let { url } = this.params
    delete this.ws
    this.ws = new WebSocket(url)
  }
  onOpen(func) {
    this.ws.onopen = () => {
      console.log('SOCKET_OPEN:')
      this.connectStatus = true
      func && func()
    }
  }
  onMessage(func) {
    this.ws.onmessage = e => {
      console.log('SOCKET_MESSAGE:', e)
      const res = JSON.parse(e.data)
      func && func(res)
    }
  }
  onClose(func) {
    this.ws.onclose = e => {
      console.log('SOCKET_CLOSE:', e)
      this.connectStatus = false
      func && func(e)
    }
  }
  onError(func) {
    this.ws.onerror = e => {
      console.log('SOCKET_ERROR', e)
      this.connectStatus = false
      func && func(e)
    }
  }
  reconnect(func) {
    if (this.connectStatus) {
      console.log('-当前正在连接中，不需要重连-')
      return
    }
    console.log('-开始重连-')
    this.connectStatus = true
    // 清除重连计时器
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
    this.reconnectTimer = setTimeout(() => {
      this.connectStatus = false
      func()
    }, this.reconnectTime)
  }
}

export default Socket
