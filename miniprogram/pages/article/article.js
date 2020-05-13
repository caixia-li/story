let nowIndex = -1;
let catalog = [];
let bookId = -1;
let flag = true;
Page({
  onLoad: function (options) {
    nowIndex = options.index;
    let bookDetail = wx.getStorageSync("bookDetail");
    catalog = bookDetail.catalog;
    bookId = bookDetail.bookId;
    this.getArticle(options.articleUrl);
    this.queryBookrack();
    this.queryBookHistory();
  },
  onUnload(){
    if(flag){
      this.updateBookrack()
    }else{
      this.addBookrack()
    }
  },
  getArticle(articleUrl){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'book',
      data:{
        $url:'getArticle',
        articleUrl:"https:"+articleUrl
      }
    }).then(res=>{
      let article = res.result;
      wx.setNavigationBarTitle({
        title:article.head
      })
      this.setData({
        ...article
      })
      wx.hideLoading();
      this.goTop();
    })
  },
  onPre(){
    nowIndex--
    if(nowIndex<0){
      nowIndex = 0;
      wx.showToast({
        title: '已经是第一章啦~',
      })
    }
    this.getArticle(catalog[nowIndex].content);
  },
  onNext(){
    nowIndex++
    if(nowIndex>catalog.length-1){
      nowIndex = catalog.length-1;
      wx.showToast({
        title: '已经是最后一章啦~',
      })
    }
    this.getArticle(catalog[nowIndex].content);
  },
  toMenu(){
    wx.redirectTo({
      url: `/pages/book-menu/book-menu?index=${nowIndex}`
    })
  },
  goTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    })
  },
  addBookrack(){
    wx.showModal({
      title: '提示',
      content: '喜欢本书就加入书架吧',
      confirmText: "加入书架",
      confirmColor: "#d81e06",
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'bookrack',
            data: {
              $url: "addBookrack",
              bookId,
              chapter: nowIndex
            }
          }).then(() => {
            wx.showToast({
              title: '添加成功'
            })
          })
        }
      }
    })
  },
  queryBookrack(){
    wx.cloud.callFunction({
      name: 'bookrack',
      data: {
        $url: "queryBookrack",
        bookId
      }
    }).then(res => {
      if(res.result.total == 0){
        flag = false;
      }else{
        flag = true;
      }
    })
  },
  updateBookrack(){
    wx.cloud.callFunction({
      name: 'bookrack',
      data: {
        $url: "updateBookrack",
        bookId,
        chapter: nowIndex
      }
    })
  },
  //历史记录
  addBookHistory() {
    wx.cloud.callFunction({
      name: 'bookHistory',
      data: {
        $url: "addBookHistory",
        bookId,
        chapter: nowIndex
      }
    })
  },
  queryBookHistory() {
    wx.cloud.callFunction({
      name: 'bookHistory',
      data: {
        $url: "queryBookHistory",
        bookId
      }
    }).then(res => {
      if (res.result.total == 0) {
        this.addBookHistory();
      } else {
        this.updateBookrack();
      }
    })
  },
  updateBookrack() {
    wx.cloud.callFunction({
      name: 'bookrack',
      data: {
        $url: "updateBookrack",
        bookId,
        chapter: nowIndex
      }
    })
  }
})