let bookArr = [];
let startTime = 0;
let endTime = 0;
Page({
  data: {
    bookList:[],
    bookDetail:{},
    isShow:false,
    flag:true
  },
  onShow(){
    bookArr = []
    this.setData({
      bookList: []
    })
    this.getBookrack()
  },
  getBookrack(){
    wx.cloud.callFunction({
      name:"bookrack",
      data:{
        $url:"getBookrack"
      }
    }).then(res=>{
      let list = res.result.data;
      if(list.length>0){
        list.forEach(item => {
          bookArr.push({
            bookId: item.bookId,
            chapter: item.chapter
          })
        })
        this.setData({
          flag:true
        })
        this.getBookList()
      }else{
        this.setData({
          flag: false
        })
      }
    })
  },
  getBookList(){
    wx.showLoading({
      title: '加载中...',
    })
    let promiseArr = [];
    bookArr.forEach((item, index)=>{
      let promise = new Promise((reslove,reject)=>{
        wx.cloud.callFunction({
          name: 'book',
          data:{
            $url: "bookDetail",
            bookId:item.bookId
          }
        }).then(res=>{
          let bookDetail = res.result.data[0];
          reslove(bookDetail)
        })
      })
      promiseArr.push(promise)
    })
    Promise.all(promiseArr).then(res=>{
      res.forEach((item,index)=>{
        item.chapter = bookArr[index].chapter;
      })
      this.setData({
        bookList:res
      })
      wx.hideLoading();
    })
  },
  goArticle(event){
    if(endTime-startTime<350){
      let { index } = event.currentTarget.dataset;
      let bookDetail = this.data.bookList[index];
      wx.setStorageSync("bookDetail", bookDetail);
      let catalog = bookDetail.catalog;
      let chapter = bookDetail.chapter;
      let articleUrl = catalog[chapter].content;
      wx.redirectTo({
        url: `/pages/article/article?articleUrl=${articleUrl}&index=${chapter}`
      })
    }
  },
  bookHandle(event){
    let { index } = event.currentTarget.dataset;
    let bookDetail = this.data.bookList[index];
    this.setData({
      bookDetail,
      isShow:true
    })
  },
  onClose(){
    this.setData({
      isShow:false
    })
  },
  onDel(event){
    let { bookId } = event.detail;
    wx.showLoading({
      title: '删除...',
    })
    wx.cloud.callFunction({
      name:"bookrack",
      data:{
        $url:"removeBookrack",
        bookId
      }
    }).then(res=>{
      bookArr = []
      this.setData({
        isShow: false,
        bookList: []
      })
      this.getBookrack();
      wx.hideLoading();
    })
  },
  touchstartHandle(e){
    startTime = e.timeStamp;
  },
  touchendHandle(e){
    endTime = e.timeStamp;
  },
  onShareAppMessage: function (event) {
    console.log(event)
    let { bookid, title, imgsrc } = event.target.dataset;
    return{
      title:`${title}`,
      path: `/pages/book-detail/book-detail?bookId=${bookid}`,
    }
  },
  toHomepage(){
    wx.switchTab({
      url: '/pages/homepage/homepage'
    })
  }
})