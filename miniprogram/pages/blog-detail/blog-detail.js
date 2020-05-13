let blogId = -1;
let userInfo = {};
let blogLike = [];
Page({
  data: {
    blog:{},
    blogCommentList:[],
    isShow:false
  },
  onLoad: function (options) {
    userInfo = wx.getStorageSync("userInfo")
    blogId = options.blogId;
    this.getBlogLike();
    this.getBlogDetail();
    this.getBlogCommentList();
  },
  onShow: function () {

  },
  getBlogDetail(){
    wx.cloud.callFunction({
      name:"blog",
      data:{
        $url:"getBlogDetail",
        blogId
      }
    }).then(res=>{
      let blog = res.result.data[0];
      this.setData({
        blog:blog
      })
    })
  },
  getBlogCommentList(){
    wx.cloud.callFunction({
      name:"blogComment",
      data:{
        $url:"getBlogCommentList",
        blogId
      }
    }).then(res=>{
      this.setData({
        blogCommentList:res.result.data
      })
    })
  },
  onComment(event) {
    blogId = event.detail.blogId;
    this.setData({
      isShow: true
    })
  },
  onClose() {
    this.setData({
      isShow: false
    })
  },
  onSend(event) {
    this.setData({
      isShow: false
    })
    let content = event.detail.value;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'blogComment',
      data: {
        $url: "addBlogComment",
        blogId,
        content,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      }
    }).then(res => {
      wx.hideLoading();
      this.getBlogCommentList()
    })
  },
  onLike(event) {
    blogId = event.detail.blogId;
    let isLike = event.detail.isLike;
    if (isLike) {
      wx.cloud.callFunction({
        name: "blogLike",
        data: {
          $url: "removeBlogLike",
          blogId
        }
      }).then(res => {
        let blogList = this.data.blogList;
        blogList.forEach(item => {
          if (item._id == blogId) {
            item.isLike = false
          }
        })
        this.setData({
          blogList
        })
      })
    } else {
      wx.cloud.callFunction({
        name: "blogLike",
        data: {
          $url: "addBlogLike",
          blogId
        }
      }).then(res => {
        let blogList = this.data.blogList;
        blogList.forEach(item => {
          if (item._id == blogId) {
            item.isLike = true
          }
        })
        this.setData({
          blogList
        })
      })
    }
  },
  getBlogLike() {
    wx.cloud.callFunction({
      name: "blogLike",
      data: {
        $url: 'queryBlogLike',
        blogId
      }
    }).then(res => {
      if(res.result){
        let blog = this.data.blog;
        blog.isLike = true
        this.setData({
          blog
        })
      }else{
        let blog = this.data.blog;
        blog.isLike = false
        this.setData({
          blog
        })
      }
    })
  },
})