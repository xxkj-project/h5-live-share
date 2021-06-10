export default {
  mounted() {
    document.body.addEventListener('touchmove', this.handleTouchmove, {
      passive: false
    })
  },
  destroyed() {
    console.log('组件销毁')
    document.body.removeEventListener('touchmove', this.handleTouchmove)
  },
  methods: {
    handleTouchmove(e) {
      console.log('-event-', e._isScroller)
      if (e._isScroller) return
      // 阻止默认事件
      e.preventDefault()
    }
  }
}
