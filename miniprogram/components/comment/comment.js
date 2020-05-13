// components/comment/comment.js
let value = "";
Component({
  properties: {
    isShow:{
      type:Boolean,
      value:false
    }
  },
  data: {
    words:0,
    warning:false,
    bottom:0
  },
  methods: {
    onInput(event){
      value = event.detail.value;
      let warning = false;
      if(value.length>=140){
        warning = true;
      }
      this.setData({
        words:value.length,
        warning
      })
    },
    onFocus(event){
      let {height} = event.detail
      this.setData({
        bottom:height
      })
    },
    onBlur(){
      this.setData({
        bottom: 0
      })
    },
    onConfirm(event){
      value = event.detail.value
    },

    onSend(){
      if(value.trim()){
        this.triggerEvent('onSend', { value })
      }else{
        wx.showModal({
          title: '提示',
          content: '评论内容不能为空哦',
          showCancel:false,
          confirmColor:"#1296db"
        })
      }
    },
    onClose(){
      this.triggerEvent('onClose')
    }
  }
})
