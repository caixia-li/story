const COUNT = 10;
let blogId = -1;
let userInfo = {};
let blogLike = []
Page({
  data: {
    blogList:[],
    isShow:false
  },
  onShow: function () {
    userInfo = wx.getStorageSync("userInfo")
    this.setData({
      blogList:[]
    })
    this.getBlogLike().then(()=>{
      this.getBlogList();
    })
  },
  onGetUserInfo() {
    let  userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      wx.navigateTo({
        url: '/pages/find-edit/find-edit',
      })
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                userInfo = res.userInfo;
                wx.setStorageSync("userInfo", userInfo);
                wx.navigateTo({
                  url: '/pages/find-edit/find-edit',
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '只有授权过后才能共享乐事哦~',
              showCancel: false,
              confirmColor: "#d81e06"
            })
          }
        }
      })
    }
  },
  getBlogList(){
    wx.cloud.callFunction({
      name:"blog",
      data:{
        $url:"getBlogList",
        start:this.data.blogList.length,
        count:COUNT
      }
    }).then(res=>{
      let blogList = this.data.blogList.concat(res.result.data)
      blogList.forEach(item=>{
        item.isLike = false
        blogLike.forEach(temp=>{
          if(item._id == temp.blogId){
            item.isLike = true
          }
        })
      })
      this.setData({
        blogList:blogList
      })
      wx.hideLoading()
    })
  },
  getBlogLike(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
   return new Promise((reslove,reject)=>{
     wx.cloud.callFunction({
       name: "blogLike",
       data: {
         $url: 'getBlogLike'
       }
     }).then(res => {
       blogLike = res.result.data;
       reslove()
     })
   })
  },
  onPullDownRefresh(){
   this.onShow();
  },
  onReachBottom(){
   this.getBlogList();
  },
  onComment(event){
    blogId = event.detail.blogId;
    this.setData({
      isShow: true
    })
  },
  onLike(event){
    blogId = event.detail.blogId;
    let isLike = event.detail.isLike;
    if(isLike){
      wx.cloud.callFunction({
        name:"blogLike",
        data:{
          $url:"removeBlogLike",
          blogId
        }
      }).then(res=>{
        let blogList = this.data.blogList;
        blogList.forEach(item=>{
          if(item._id == blogId){
            item.isLike = false
          }
        })
        this.setData({
          blogList
        })
      })
    }else{
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
  onClose(){
    this.setData({
      isShow: false
    })
  },
  onSend(event){
    this.setData({
      isShow: false
    })
    let content = event.detail.value;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.cloud.callFunction({
      name: 'blogComment',
      data:{
        $url:"addBlogComment",
        blogId,
        content,
        avatarUrl:userInfo.avatarUrl,
        nickName:userInfo.nickName
      }
    }).then(res=>{
      wx.hideLoading();
    })
  },
  onSearch(event){
    let { value } = event.detail;
    wx.showLoading({
      title: '小编正在努力加载...',
      mask:true
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:"getBlogListBySearch",
        value
      }
    }).then(res=>{
      this.setData({
        blogList:res.result.data
      })
      wx.hideLoading();
    })
  },
  onCancel(){
    this.onShow()
  }

})