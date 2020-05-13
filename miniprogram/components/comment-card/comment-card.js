import timeFormate from "../../utils/timeFormate.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentItem:{
      type:Object
    }
  },
  data: {
    createTime:''
  },
  methods: {

  },
  observers:{
    "commentItem.createTime":function(value){
      this.setData({
        createTime:timeFormate(value)
      })
    }
  }
})
