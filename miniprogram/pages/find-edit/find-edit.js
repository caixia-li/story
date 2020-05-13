const MAX_COUNT = 9;
let value = ""
let userInfo = {}
Page({
  data: {
    imgList: [],
    isAddShow: true,
    wordsNum: 0
  },
  onLoad(){
    userInfo = wx.getStorageSync("userInfo")
  },
  onChooseImage() {
    let count = MAX_COUNT - this.data.imgList.length;
    wx.chooseImage({
      count: count,
      success: res => {
        this.setData({
          imgList: this.data.imgList.concat(res.tempFilePaths)
        })
        count = MAX_COUNT - this.data.imgList.length;
        if (count <= 0) {
          this.setData({
            isAddShow: false
          })
        }
      }
    })
  },
  onDel(event) {
    let {
      index
    } = event.currentTarget.dataset;
    this.data.imgList.splice(index, 1);
    this.setData({
      imgList: this.data.imgList,
      isAddShow: true
    })
  },
  onInput(event) {
    value = event.detail.value
    let length = value.length;
    this.setData({
      wordsNum: length
    })
  },
  onPublish() {
    if (value.trim()) {
      wx.showLoading({
        title: '发布中',
        mask:true
      })
      let imgList = this.data.imgList;
      let promiseArr = []
      imgList.forEach(item => {
        let promise = new Promise((reslove, reject) => {
          let suffix = /\.\w+$/.exec(item)[0]
          wx.cloud.uploadFile({
            cloudPath: `blog/${Math.random() * 1000000}-${(new Date()).getTime()}${suffix}`,
            filePath: item,
            success: res => {
              reslove(res.fileID)
            }
          })
        })
        promiseArr.push(promise)
      })
      Promise.all(promiseArr).then(res=>{
        wx.cloud.callFunction({
          name:"blog",
          data:{
            $url:"addBlog",
            imgList:res,
            content:value,
            avatarUrl:userInfo.avatarUrl,
            nickName:userInfo.nickName
          }
        }).then(res=>{
          wx.hideLoading();
          wx.switchTab({
            url: '/pages/find/find',
          })
        })
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '发布内容不能为空',
        showCancel: false,
        confirmColor: "#1296db"
      })
    }
  }
}) 