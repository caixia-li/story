const COUNT = 10;
Page({
  data: {
    navList: ["推荐", "全部作品", "完本", "连载", "VIP", "免费", "分类"],
    chooseNavIndex: 0,
    swiperList: [],
    current:0,
    bookList:[],
  },
  onLoad: function (options) {
    this.getSwiperList()
  },
  getSwiperList(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'swiper',
      data:{}
    }).then(res=>{
      this.setData({
        swiperList:res.result.data[0].swiperList
      })
      this.getIntroList()
      this.selectComponent("#recommend").getIntroList()
      wx.hideLoading();
    })
  },
  getIntroList(){
    let swiperList = this.data.swiperList;
    let promiseArr = [];
    swiperList.forEach(item=>{
      let bookId = item.bookId;
      let promise = new Promise((reslove,reject)=>{
        wx.cloud.callFunction({
          name: "book",
          data: {
            $url: "bookDetail",
            bookId
          }
        }).then(res => {
          let bookDetail = res.result.data[0];
          reslove({
            title: bookDetail.title,
            tags: bookDetail.tags.split(","),
            intro: bookDetail.intro,
            bookId: bookDetail.bookId
          })
        })
      })
      promiseArr.push(promise)
    })
    Promise.all(promiseArr).then(res=>{
      wx.setStorageSync("introList", res)
    })
  },
  currentChange(e){
    this.setData({
      current:e.detail.current
    })
  },
  getChooseNavIndex(event){
    let { index } = event.currentTarget.dataset
    this.setData({
      chooseNavIndex:index
    })
    let tag = this.data.navList[index];
    if(index == 1){
      tag = ","
    }
    if(index == this.data.navList.length-1){
      wx.navigateTo({
        url: '/pages/book-classify/book-classify'
      })
    }else{
      this.data.bookList = [];
      this.getBookList(tag)
    }
  },
  getBookList(tag){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'book',
      data:{
        $url:"getBookList",
        tag,
        count:COUNT,
        start:this.data.bookList.length
      }
    }).then(res=>{
      if(res.result.data < 10 && this.data.chooseNavIndex != 0){
        wx.showToast({
          title: '没有更多了',
        })
      }
      this.setData({
        bookList: this.data.bookList.concat(res.result.data)
      })
      wx.hideLoading()
    })
  },
  onShow: function () {
    if(this.data.chooseNavIndex == 6){
      this.setData({
        chooseNavIndex: 0
      })
    }
  },
  onReachBottom: function () {
    let index = this.data.chooseNavIndex;
    let tag = this.data.navList[index];
    if (index == 1) {
      tag = ","
    }
    this.getBookList(tag)
  }
})