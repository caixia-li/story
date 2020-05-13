// miniprogram/pages/myBlog/myBlog.js
Page({
  data: {
    blogList:[]
  },
  onLoad: function (options) {
    this.getBlogList()
  },
  getBlogList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: "blog",
      data: {
        $url: "getMyBlog",
      }
    }).then(res => {
      if(res.result.data.length == 0){
        wx.showModal({
          title: '提示',
          content: '您暂时还没有发布生活圈哦~',
          showCancel: false,
          confirmColor: "#1296db",
          success: res => {
            wx.navigateBack()
          }
        })
      }
      this.setData({
        blogList: res.result.data
      })
      wx.hideLoading()
    })
  }
})