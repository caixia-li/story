Component({
  properties: {
    bookList:{
      type:Array
    }
  },
  methods: {
    goBookDetail(event) {
      let { bookid } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/book-detail/book-detail?bookId=${bookid}`
      })
    }
  }
})
