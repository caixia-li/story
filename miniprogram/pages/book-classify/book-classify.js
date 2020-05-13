// miniprogram/pages/book-classify/book-classify.js
Page({
  data: {
    navList:["古代言情","仙侠奇缘","现代言情","浪漫青春","玄幻言情","悬疑推理","科幻空间","游戏竞技","轻小说","短篇"],
    classifyList:[],
    bookList:[],
    isShow:false
  },
  onLoad: function (options) {
    this.getClassifyList()
  },
  onShow: function () {

  },
  getClassifyList(){
    wx.showLoading({
      title: '小编正在努力加载中...',
    })
    this.setData({
      classifyList:[]
    })
    let navList = this.data.navList;
    let promiseArr = []
    navList.forEach((item,index)=>{
      let promise = new Promise((reslove,reject)=>{
        wx.cloud.callFunction({
          name: 'book',
          data: {
            $url: "getClassifyList",
            tag: item
          }
        }).then(res => {
          reslove(res.result)
        })
      })
      promiseArr.push(promise)
    })
    Promise.all(promiseArr).then(res=>{
      this.setData({
        classifyList:res
      })
      wx.hideLoading();
    })
  },
  getNavList(event){
    let { index } = event.currentTarget.dataset;
    this.setData({
      isShow:true,
      bookList:[],
      tag: this.data.navList[index]
    })
    let tag = this.data.navList[index];
    this.getBookListByTag(tag)
  },
  getBookListByTag(tag){
    wx.cloud.callFunction({
      name:'book',
      data:{
        $url:"getBookList",
        tag,
        count:10,
        start:this.data.bookList.length
      }
    }).then(res=>{
      this.setData({
        bookList: this.data.bookList.concat(res.result.data)
      })
    })
  },
  getBookListByTitle(content) {
    wx.cloud.callFunction({
      name: 'book',
      data: {
        $url: "getBookListByTitle",
        content
      }
    }).then(res => {
      this.setData({
        bookList: res.result.data
      })
    })
  },
  goBack(){
    this.setData({
      isShow: false
    })
  },
  onReachBottom(){
    this.getBookListByTag(this.data.tag)
  },
  getBookListByTitle(content){
    wx.cloud.callFunction({
      name:'book',
      data:{
        $url:"getBookListByTitle",
        content:`${content}`
      }
    }).then(res=>{
      this.setData({
        bookList:res.result.data,
        isShow:true
      })
    })
  },
  onSearch(event){
    let { value } = event.detail;
    this.getBookListByTitle(value);
  },
  onCancel(){
    this.setData({
      isShow:false
    })
  }
  
})