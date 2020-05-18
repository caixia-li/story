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

  app.router('getBookCollect', async (ctx, next) => {
    ctx.body = await db.collection('bookCollect')
      .where({
        openid
      })
      .get()
      .then(res => {
        return res;
      })
  })

  app.router('queryBookCollect', async (ctx, next) => {
    let { bookId } = event;
    ctx.body = await db.collection('bookCollect')
      .where({
        openid: openid,
        bookId: bookId
      })
      .count()
      .then(res => {
        return res;
      })
  })

  app.router('addBookCollect', async (ctx, next) => {
    let { bookId } = event;
    ctx.body = await db.collection('bookCollect')
      .add({
        data: {
          openid,
          bookId
        }
      })
      .then(res => {
        return res;
      })
  })

  app.router('removeBookCollect', async (ctx, next) => {
    let { bookId } = event;
    ctx.body = await db.collection('bookCollect')
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