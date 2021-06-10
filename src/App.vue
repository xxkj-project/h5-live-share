<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:46:43
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-13 01:05:01
 * @Desc: 根组件
-->
<template>
  <div id="app">
    <router-view class="app-view" v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      // 初始过度动画方向
      transitionName: 'slide-right'
    }
  },
  watch: {
    $route(to, from) {
      // 切换动画
    }
  },
  methods: {
    // 重新加载当前页
    reload() {
      console.log('重新加载...')
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less">
#app {
  height: 100%;
  // overflow: auto;
  font-size: 14px;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
}
.loading-transition-enter {
  opacity: 1;
  transition: all 100ms;
}
.loading-transition-leave-active {
  opacity: 0;
  transition: all 100ms;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
