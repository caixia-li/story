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
  const openid = wxContext.OPENID;
  const app = new tcbRouter({
    event
  })

  app.router("addBlogLike", async (ctx, next) => {
    let { blogId } = event
    ctx.body = await db.collection('blogLike')
      .add({
        data: {
          openid,
          blogId
        }
      })
      .then(res => {
        return res
      })
  })

  app.router("getBlogLike", async (ctx, next) => {
    ctx.body = await db.collection('blogLike')
      .where({
        openid
      })
      .get()
      .then(res => {
        return res
      })
  })

  app.router('removeBlogLike', async (ctx, next) => {
    let { blogId } = event
    ctx.body = await db.collection('blogLike')
      .where({
        openid,
        blogId
      })
      .remove()
      .then(res => {
        return res;
      })
  })

  app.router('queryBlogLike',async (ctx,next)=>{
    let { blogId } = event;
    ctx.body = await db.collection('blogLike')
    .where({
      openid,
      blogId
    })
    .count()
    .then(res=>{
      return res.total
    })
  })

  return app.serve();
}