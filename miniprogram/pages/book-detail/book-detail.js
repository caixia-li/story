let bookId = -1;
let userInfo = {};
Page({
  data: {
    navList: ["简介", "目录"],
    chooseNavIndex: 0,
    isCollect: false,
    isAddBookrack: false,
    isShow: false,
    commmentList:[]
  },
  onLoad: function(options) {
    bookId = options.bookId;
    this.getBookDetail(options.bookId)
    this.queryBookrack();
    this.queryBookCollect();
    this.getBookComment();
  },
  getBookDetail(bookId) {
    wx.cloud.callFunction({
      name: "book",
      data: {
        $url: "bookDetail",
        bookId
      }
    }).then(res => {
      let bookDetail = res.result.data[0];
      let {
        author,
        imgSrc,
        intro,
        sign,
        tags,
        title,
        catalog
      } = bookDetail;
      wx.setNavigationBarTitle({
        title: title
      })
      this.setData({
        author,
        imgSrc,
        intro,
        sign,
        tags: tags.split(","),
        title,
        catalog
      })
      wx.setStorageSync("bookDetail", bookDetail);
    })
  },
  getBookComment(){
    return new Promise((reslove,reject)=>{
      wx.cloud.callFunction({
        name: "bookComment",
        data: {
          $url: "getBookComment",
          bookId
        }
      }).then(res => {
        this.setData({
          commmentList: res.result.data
        })
        reslove()
      })
    })
  },
  getChooseNavIndex(event) {
    this.setData({
      chooseNavIndex: event.currentTarget.dataset.index
    })
  },
  goArticle(event) {
    let {
      index
    } = event.currentTarget.dataset;
    let articleUrl = this.data.catalog[index].content;
    wx.redirectTo({
      url: `/pages/article/article?articleUrl=${articleUrl}&index=${index}`
    })
  },
  onCollect() {
    this.setData({
      isCollect: true
    })
    this.addBookCollect(bookId)
  },
  onAddBookrack() {
    this.setData({
      isAddBookrack: true
    })
    this.addBookrack(bookId)
  },
  addBookrack(bookId) {
    wx.cloud.callFunction({
      name: 'bookrack',
      data: {
        $url: "addBookrack",
        bookId,
        chapter: 0
      }
    }).then(res => {
      if (res.result._id) {
        wx.showToast({
          title: '添加成功'
        })
      }
    })
  },
  queryBookrack() {
    wx.cloud.callFunction({
      name: 'bookrack',
      data: {
        $url: "queryBookrack",
        bookId
      }
    }).then(res => {
      if (res.result.total == 0) {
        this.setData({
          isAddBookrack: false
        })
      } else {
        this.setData({
          isAddBookrack: true
        })
      }
    })
  },
  addBookCollect(bookId) {
    wx.cloud.callFunction({
      name: 'bookcollect',
      data: {
        $url: "addBookCollect",
        bookId
      }
    }).then(res => {
      if (res.result._id) {
        wx.showToast({
          title: '添加成功'
        })
      }
    })
  },
  queryBookCollect() {
    wx.cloud.callFunction({
      name: 'bookcollect',
      data: {
        $url: "queryBookCollect",
        bookId
      }
    }).then(res => {
      if (res.result.total == 0) {
        this.setData({
          isCollect: false
        })
      } else {
        this.setData({
          isCollect: true
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `/pages/book-detail/book-detail?bookId=${bookId}`,
    }
  },
  onGetUserInfo() {
    userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.onComment();
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                userInfo = res.userInfo;
                wx.setStorageSync("userInfo", userInfo);
                this.onComment();
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '只有授权才能评论哦',
              showCancel: false,
              confirmColor: "#d81e06"
            })
          }
        }
      })
    }
  },
  onComment() {
    this.setData({
      isShow: true
    })
  },
  onSend(event) {
    this.setData({
      isShow: false
    })
    let content = event.detail.value;
    wx.showLoading({
      title: '发布中...',
    })
    wx.cloud.callFunction({
      name: "bookComment",
      data: {
        $url: "addBookComment",
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        content,
        bookId
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功'
      })
    })
    this.getBookComment();
  },
  onClose() {
    this.setData({
      isShow: false
    })
  }
})