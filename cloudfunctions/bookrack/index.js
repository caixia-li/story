// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router');

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

  app.router('getBookrack', async (ctx, next) => {
    ctx.body =  await db.collection('bookrack')
      .where({
        openid
      })
      .orderBy('createTime',"desc")
      .get()
      .then(res => {
        return res;
      })
  })

  app.router('queryBookrack', async (ctx, next) => {
    let { bookId } = event;
    ctx.body = await db.collection('bookrack')
      .where({
        openid:openid,
        bookId:bookId
      })
      .count()
      .then(res => {
        return res;
      })
  })
  
  app.router('addBookrack',async (ctx,next)=>{
    let { bookId, chapter } = event;
    ctx.body =  await db.collection('bookrack')
      .add({
        data: {
          openid,
          bookId,
          chapter,
          createTime: db.serverDate()
        }
      })
      .then(res=>{
        return res;
      })
  })

  app.router('updateBookrack',async (ctx,next)=>{
    let { bookId, chapter } = event;
    ctx.body = await db.collection('bookrack')
    .where({
      bookId,
      openid
    })
    .update({
      data:{
        chapter,
        createTime: db.serverDate()
      }
    })
    .then(res=>{
      return res
    })
  })

  app.router('removeBookrack', async (ctx, next) => {
    let { bookId } = event;
    ctx.body = await db.collection('bookrack')
      .where({
        bookId,
        openid
      })
      .remove()
      .then(res => {
        return res
      })
  })

  return app.serve();
}