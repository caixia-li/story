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

  app.router("addBlog",async (ctx,next)=>{
    let { imgList,content,avatarUrl,nickName } = event
    ctx.body = await db.collection('blog')
    .add({
      data:{
        openid,
        imgList,
        content,
        avatarUrl,
        nickName,
        createTime:db.serverDate()
      }
    })
    .then(res=>{
      return res
    })
  })

  app.router("getBlogList",async (ctx,next)=>{
    let { start,count } = event;
    ctx.body = await db.collection('blog')
    .skip(start)
    .limit(count)
    .orderBy("createTime","desc")
    .get()
    .then(res=>{
      return res
    })
  })

  app.router('getBlogDetail',async (ctx,next)=>{
    let { blogId } = event;
    ctx.body = await db.collection('blog')
    .where({
      _id:blogId
    })
    .get()
    .then(res=>{
      return res
    })
  })

  app.router('getBlogListBySearch',async (ctx,next)=>{
    let { value } = event;
    ctx.body = await db.collection('blog')
    .where({
      content: db.RegExp({
        regexp: value,
        options: 'i',
      })
    })
    .get()
    .then(res=>{
      return res;
    })
  })

  app.router('getMyBlog',async (ctx,next)=>{
    ctx.body = await db.collection('blog')
      .where({
        openid
      })
      .get()
      .then(res => {
        return res;
      })
  })

  return app.serve();
}