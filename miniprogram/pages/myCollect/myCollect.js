let bookArr = [];
let startTime = 0;
let endTime = 0;
Page({
  data: {
    bookList: [],
    bookDetail: {},
    isShow: false,
  },
  onShow() {
    bookArr = []
    this.setData({
      bookList: []
    })
    this.getBookCollect()
  },
  getBookCollect() {
    wx.cloud.callFunction({
      name: "bookcollect",
      data: {
        $url: "getBookCollect"
      }
    }).then(res => {
      let list = res.result.data;
      if (list.length > 0) {
        list.forEach(item => {
          bookArr.push({
            bookId: item.bookId
          })
        })
        this.getBookList()
      } else {
        wx.showModal({
          title: '提示',
          content: '您暂时还没有收藏任何书籍哦~',
          showCancel:false,
          confirmColor:"#1296db",
          success:res=>{
            wx.navigateBack()
          }
        })
      }
    })
  },
  getBookList() {
    let promiseArr = [];
    bookArr.forEach((item, index) => {
      let promise = new Promise((reslove, reject) => {
        wx.cloud.callFunction({
          name: 'book',
          data: {
            $url: "bookDetail",
            bookId: item.bookId
          }
        }).then(res => {
          let bookDetail = res.result.data[0];
          reslove(bookDetail)
        })
      })
      promiseArr.push(promise)
    })
    Promise.all(promiseArr).then(res => {
      this.setData({
        bookList: res
      })
    })
  },
  goArticle(event) {
    if (endTime - startTime < 350) {
      wx.redirectTo({
        url: `/pages/article/article?articleUrl=${articleUrl}&index=${0}`
      })
    }
  },
  bookHandle(event) {
    let { index } = event.currentTarget.dataset;
    let bookDetail = this.data.bookList[index];
    this.setData({
      bookDetail,
      isShow: true
    })
  },
  onClose() {
    this.setData({
      isShow: false
    })
  },
  onDel(event) {
    let { bookId } = event.detail;
    wx.showLoading({
      title: '删除...',
    })
    wx.cloud.callFunction({
      name: "bookcollect",
      data: {
        $url: "removeBookCollect",
        bookId
      }
    }).then(res => {
      bookArr = []
      this.setData({
        isShow: false,
        bookList: []
      })
      this.getBookCollect();
      wx.hideLoading();
    })
  },
  touchstartHandle(e) {
    startTime = e.timeStamp;
  },
  touchendHandle(e) {
    endTime = e.timeStamp;
  },
  onShareAppMessage: function (event) {
    console.log(event)
    let { bookid, title, imgsrc } = event.target.dataset;
    return {
      title: `${title}`,
      path: `/pages/book-detail/book-detail?bookId=${bookid}`,
    }
  }
})