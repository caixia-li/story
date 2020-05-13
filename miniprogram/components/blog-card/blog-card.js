import timeFormate from "../../utils/timeFormate.js"
Component({
  properties: {
    blog: {
      type: Object
    }
  },
  data: {
    createTime: ''
  },

  methods: {
    onComment() {
      let blogId = this.properties.blog._id;
      this.triggerEvent("onComment", {
        blogId
      })
    },
    onLike() {
      let blogId = this.properties.blog._id;
      let isLike = this.properties.blog.isLike;
      this.triggerEvent("onLike", {
        blogId,
        isLike
      })
    },
    onPreviewShow(event) {
      let {
        index
      } = event.currentTarget.dataset;
      wx.previewImage({
        urls: this.properties.blog.imgList,
        current: this.properties.blog.imgList[index]
      })
    },
    toBlogDetail() {
      let blogId = this.properties.blog._id;
      wx.navigateTo({
        url: `/pages/blog-detail/blog-detail?blogId=${blogId}`,
      })
    },
    ongetuserinfo() {
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo) {
        this.onComment()
      } else {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: res => {
                  userInfo = res.userInfo;
                  wx.setStorageSync("userInfo", userInfo);
                  this.onComment;
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '只有授权才能评论和点赞哦',
                showCancel: false,
                confirmColor: "#d81e06"
              })
            }
          }
        })
      }
    }
  },
  observers: {
    "blog.createTime": function(value) {
      this.setData({
        createTime: timeFormate(value)
      })
    }
  }
})