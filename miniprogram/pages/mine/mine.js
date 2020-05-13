// miniprogram/pages/mine/mine.js
Page({
  data: {
    phoneNumber:"18226793726"
  },
  onLoad: function (options) {

  },
  onPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
    })
  },
  toMyCollect(){
    wx.navigateTo({
      url: '/pages/myCollect/myCollect',
    })
  },
  toMyHistory(){
    wx.navigateTo({
      url: '/pages/myHistory/myHistory',
    })
  },
  toMyBlog(){
    wx.navigateTo({
      url: '/pages/myBlog/myBlog',
    })
  }
})