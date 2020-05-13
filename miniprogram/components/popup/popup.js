// components/popup/popup.js
Component({
  externalClasses: ['shanchu','fenxiang','iconfont'],
  properties: {
    bookDetail:{
      type:Object
    },
    isShow:{
      type:Boolean,
      value:false
    }
  },
  data: {

  },
  methods: {
    onClose(){
      this.triggerEvent("onClose")
    },
    goBookDetail(event) {
      let { bookid } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/book-detail/book-detail?bookId=${bookid}`
      })
    },
    onDel(event){
      let { bookid } = event.currentTarget.dataset;
      this.triggerEvent("onDel",{bookId:bookid})
    }
  },
  
})
