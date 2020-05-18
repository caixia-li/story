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

  app.router('getBookComment', async (ctx, next) => {
    let { bookId } = event;
    ctx.body = await db.collection('bookComment')
      .where({
        bookId
      })
      .get()
      .then(res => {
        return res;
      })
  })

  app.router('addBookComment', async (ctx, next) => {
    let { nickName,avatarUrl,content,bookId } = event
    ctx.body = await db.collection('bookComment')
      .add({
        data: {
          createTime: db.serverDate(),
          nickName,
          avatarUrl,
          content,
          bookId
        }
      })
      .then(res => {
        return res;
      })
  })

  return app.serve();
}