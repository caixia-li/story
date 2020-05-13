// components/recommend/recommend.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperList:{
      type:Array
    }
  },
  data:{
    current:0,
    introList:[]
  },
  methods: {
    goBookDetail(event) {
      let { bookid } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/book-detail/book-detail?bookId=${bookid}`
      })
    },
    currentChange(event){
      let {current} = event.detail;
      this.setData({
        current
      })
      this.triggerEvent("currentChange",{current})
    },
    getIntroList(){
      let introList = wx.getStorageSync("introList");
      this.setData({
        introList
      })
    }
  },
  lifetimes:{
    ready(){
      this.getIntroList()
    }
  }
})
