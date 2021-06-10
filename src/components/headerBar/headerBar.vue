<!-- 
  全局header
-->
<template>
  <div class="header" :style="{ height: headerHeight }">
    <div class="headerLine" :style="{ height: lineHeight }" v-if="isNeedStatusBar"></div>
    <div
      class="header-global"
      :class="{ header_bottom_shadow: isNeedShadow }"
      ref="headerRef"
      :style="{ paddingTop: headerPaddingTop, backgroundColor: background }"
    >
      <div class="left" :style="{ top: leftIconTop }" @click="goBack">
        <span class="leftIcon" :class="arrowsType === 'black' ? 'blackArrows' : 'whiteArrows'"></span>
      </div>

      <div class="headTitle" :style="{ opacity: titleOpacity, color: titleColor }">{{ headTitle || routerTitle }}</div>

      <span class="right" :style="{ top: rightTop }" @click="onRight">
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
import platform from '@/utils/platform'
import { mapGetters } from 'vuex'
import openNative from '@/utils/openNative'
export default {
  name: '',
  data() {
    return {
      remBase: 37.5,
      routerTitle: ''
    }
  },
  props: {
    background: {
      type: String,
      default: ''
    },
    // 返回箭头颜色，默认为 黑色(black/white)
    arrowsType: {
      type: String,
      default: 'black'
    },
    // 标题的透明度，默认为 1
    titleOpacity: {
      type: Number,
      default: 1
    },
    // 标题字体颜色，默认为 #000
    titleColor: {
      type: String,
      dafault: '#000'
    },
    // 自定义标题
    headTitle: {
      type: String,
      default: ''
    },
    // 自定义按钮返回事件
    onBack: {
      type: Function
    },
    // 右边slot点击事件
    onRight: {
      type: Function,
      default: () => {}
    },
    // 主题内容是否全屏
    isMainFullScreen: {
      type: Boolean,
      default: false
    },
    // 顶部状态栏是否亮色 ==》亮色状态栏使用h5 header同一颜色，暗色状态栏使用白色，true亮色；false暗色
    isHighColor: {
      type: Boolean,
      default: true
    },
    // 是否需要顶部状态栏
    isNeedStatusBar: {
      type: Boolean,
      default: true
    },
    isNeedShadow: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getTitle()
  },
  mounted() {
    this.setHighColor()
  },
  computed: {
    ...mapGetters('globalStatus', ['statusBarHeight']),
    // 状态栏基础rem数值
    baseRemVal() {
      const baseVal = this.isNeedStatusBar ? this.statusBarHeight : 0
      return baseVal / this.remBase
    },
    // header高度 == title + 状态栏
    headerHeight() {
      let hei = this.isMainFullScreen ? this.baseRemVal : this.baseRemVal + 41 / this.remBase
      return hei + 'rem'
    },
    // header状态栏高度
    lineHeight() {
      return this.baseRemVal + 'rem'
    },
    headerPaddingTop() {
      return this.baseRemVal + 'rem'
    },
    leftIconTop() {
      // 10.5 = (header高度 - leftIcon高度) / 2  ==》(41 - 20) / 2
      // console.log(+this.statusBarHeight, this.remBase)
      return this.statusBarHeight / this.remBase + 'rem'
      // return this.baseRemVal + 10.5 / this.remBase + 'rem'
    },
    rightTop() {
      return this.baseRemVal + 'rem'
    }
  },
  methods: {
    // TODO 调用安卓的方法设置头部状态栏颜色，也可以不调用安卓方法
    setHighColor() {
      // console.log('-isHighColor-', this.isHighColor)
      this.isHighColor ? openNative.setStatusBarColor() : openNative.setStatusBarColor(2)
    },
    getTitle() {
      if (this.$route.meta) {
        this.routerTitle = this.$route.meta.title || ''
      }
    },
    goBack() {
      if (this.onBack) {
        this.onBack()
        return
      }
      if (this.$route.path == '/index') {
        console.log('-返回客户端-')
      } else {
        this.$router.go(-1)
      }
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
// @import url(); 引入公共css类
// @import '~@/styles/variable';
// header高度
@height: 41px;
// 客户端状态栏预留高度
@statusBarHeight: 20px;
// 图片路径
@imgUrl: '~@/assets/images/';
// 基础设计去图375，蓝湖标准设计图750 需要除以2
// @multiple: 0.5;

.header {
  width: 100%;

  .headerLine {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    margin: auto;
    width: 100%;
  }

  .highColor {
    background: #fff;
  }

  .header-global {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 41px;
    background-color: #fff;
    text-align: center;
    line-height: @height;
    color: #171717;
    // font-family: PingFangSC-Medium,PingFang SC;
    font-family: PingFang-SC-Bold;
    font-size: 18px;
    box-sizing: content-box;
    .left {
      position: absolute;
      left: 0;
      top: 0;
      // left: 12px;
      // top: 10.5px;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: @height;

      .leftIcon {
        width: 12px;
        height: 20px;
        &.blackArrows {
          background: url('@{imgUrl}blackLeftArrow.png') no-repeat center / cover;
        }
        &.whiteArrows {
          background: url('@{imgUrl}whiteLeftArrow.png') no-repeat center / cover;
        }
      }
    }
    .right {
      position: absolute;
      right: 10px;
      top: 0;
      z-index: 10;
      font-size: 14px;
    }
  }
}
.header-global {
  &.header_bottom_shadow {
    box-shadow: 4px 4px 10px rgba(250, 248, 248, 0.5);
  }
}
</style>
