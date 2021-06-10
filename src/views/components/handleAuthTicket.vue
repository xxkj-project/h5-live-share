<!-- 
   入场票据码检验
-->
<template>
  <div class="dialog" v-show="dialogVisible">
    <div class="dialogWrap">
      <div class="dialogContent" :style="{ top: top }">
        <span class="icon"></span>
        <p class="title">我的入场票据码</p>
        <div class="inputBox">
          <van-field v-model="code" placeholder="请输入购买的入场票据码">
            <template #button>
              <van-button class="confirmBtn" size="small" type="primary" :loading="isLoading" @click="onConfirm"
                >确定</van-button
              >
            </template>
          </van-field>
        </div>
        <span class="buyBtn" @click="onGoBuy">点击购买入场票据码 ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { checkTicketAging } from '@/api/index'
export default {
  name: '',
  data() {
    return {
      top: '',
      code: '',
      isLoading: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  components: {},
  created() {
    let top = (window.innerHeight - 310) / 2 + 'px'
    this.top = top
  },
  mounted() {},
  methods: {
    onConfirm() {
      if (!this.code) {
        this.$toast('请输入入场票据码')
        return
      }
      this.isLoading = true
      const params = { code: this.code }
      checkTicketAging(params)
        .then(res => {
          this.isLoading = false
          if (res.data) {
            this.dialogVisible = false
            this.$toast('票据验证成功!')
            this.$emit('success', this.code)
            sessionStorage.setItem('tickets_code', this.code)
          } else {
            this.$toast('票据码不正确，请您重新输入!')
          }
        })
        .catch(err => {
          console.log('-err-', err)
          this.isLoading = false
          err.msg && this.$toast(err.msg)
        })
    },
    onGoBuy() {
      this.$emit('jump')
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@imgUrl: '~@/assets/images/share/';
@redColor: #fc3b52;
.dialog {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}
.dialogWrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .dialogContent {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    background: #fff;
    font-size: 14px;
    color: #fff;
    border-radius: 12px;
    padding: 30px 0 30px 0;

    .icon {
      width: 60px;
      height: 66px;
      background: url('@{imgUrl}icon-dialog-sign.png') no-repeat center / cover;
    }

    .title {
      font-size: 16px;
      color: #333;
      padding: 12px 0 40px 0;
    }

    .inputBox {
      width: 100%;
      padding: 0 30px;
      margin-bottom: 60px;

      .confirmBtn {
        background: @redColor;
        width: 48px;
        height: 48px;
        font-size: 12px;
        border: 1px solid @redColor;
        border-radius: 48px;

        /deep/ &.van-button--small {
          padding: 0;
        }
      }

      /deep/.van-field {
        display: flex;
        align-items: center;
        height: 50px;
        border: 1px solid @redColor;
        border-radius: 50px;
        padding: 0 0 0 16px;
        box-sizing: border-box;
      }
    }

    .buyBtn {
      color: @redColor;
      cursor: pointer;
    }
  }
}
</style>
