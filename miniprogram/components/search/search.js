// components/search/search.js
Component({
  data:{
    inputValue:""
  },
  methods: {
    onSearch(event){
      let { value } = event.detail;
      this.triggerEvent("onSearch",{ value })
    },
    onCancel(){
      this.triggerEvent("onCancel")
      this.setData({
        inputValue:""
      })
    }
  }
})
