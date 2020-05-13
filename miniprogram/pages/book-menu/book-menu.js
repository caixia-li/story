let clientHeight = 0;
Page({
  data: {
    nowIndex:-1,
    catalog:[]
  },
  onLoad: function (options) {
    let { index } =  options 
    this.setData({
      catalog: wx.getStorageSync("bookDetail").catalog,
      nowIndex:index
    })
    let query = wx.createSelectorQuery();
    query.select('.menu-item').boundingClientRect(rect => {
      clientHeight = rect.height;
      wx.pageScrollTo({
        scrollTop: clientHeight * index,
        duration: 0
      })
    }).exec();
  },
  goArticle(event) {
    let { index } = event.currentTarget.dataset;
    let articleUrl = this.data.catalog[index].content;
    wx.redirectTo({
      url: `/pages/article/article?articleUrl=${articleUrl}&index=${index}`
    })
  },
})