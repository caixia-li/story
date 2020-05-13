// 云函数入口文件
const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');
const cheerio = require('cheerio');
const rp = require('request-promise');

cloud.init({
  env: 'shopping-gpdk9'
})

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new tcbRouter({
    event
  })

  app.router('bookDetail', async(ctx, next) => {
    let {
      bookId
    } = event
    ctx.body = await db.collection('bookList')
      .where({
        bookId
      })
      .get()
      .then(res => {
        return res
      })
  })

  app.router('getArticle', async(ctx, next) => {
    let {
      articleUrl
    } = event;
    ctx.body = await rp(articleUrl).then(body => {
      var $ = cheerio.load(body);
      let head = $('.main-text-wrap  .text-head .content-wrap').text();
      let content = []
      $('.main-text-wrap .read-content p').each((index, item) => {
        content.push($(item).text().replace(/\s+/g, ""))
      })

      return {
        head,
        content
      }
    })
  })

  app.router('getBookList', async(ctx, body) => {
    let {
      tag,
      start,
      count
    } = event;
    ctx.body = await db.collection('bookList')
      .where({
        tags: db.RegExp({
          regexp: tag,
          options: 'i',
        })
      })
      .skip(parseInt(start))
      .limit(parseInt(count))
      .get()
      .then(res => {
        return res
      })
  })

  app.router('getClassifyList', async(ctx, next) => {
    let {
      tag
    } = event;
    let classifyItem = {}
    classifyItem.total = await db.collection('bookList')
      .where({
        tags: db.RegExp({
          regexp: tag,
          options: 'i',
        })
      })
      .count()
      .then(res => {
        return res.total
      })

    classifyItem.imgUrl = await db.collection('bookList')
      .where({
        tags: db.RegExp({
          regexp: tag,
          options: 'i',
        })
      })
      .limit(1)
      .get()
      .then(res => {
        return res.data[0].imgSrc
      })

    ctx.body = { ...classifyItem
    }

  })

  app.router("getBookListByTitle",async (ctx,next)=>{
    let { content } =  event 
    ctx.body = await db.collection('bookList')
      .where({
        title: db.RegExp({
          regexp: content,
          options: 'i',
        })
      })
      .get()
      .then(res => {
        return res
      })

  })

  return app.serve();
}