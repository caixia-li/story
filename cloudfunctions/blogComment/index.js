// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')

cloud.init({
  env: 'shopping-gpdk9'
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.APPID;
  const app = new tcbRouter({
    event
  })

  app.router("addBlogComment", async (ctx, next) => {
    let {  content, avatarUrl, nickName,blogId } = event
    ctx.body = await db.collection('blogComment')
      .add({
        data: {
          blogId,
          content,
          avatarUrl,
          nickName,
          createTime: db.serverDate()
        }
      })
      .then(res => {
        return res
      })
  })

  app.router("getBlogCommentList",async (ctx,next)=>{
    let {blogId} = event;
    ctx.body = await db.collection('blogComment')
      .where({
        blogId
      })
      .get()
      .then(res => {
        return res
      })
  })

  return app.serve();
}