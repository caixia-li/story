// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'shopping-gpdk9'
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
 return await db.collection('bookSwiper')
  .get()
  .then(res=>{
    return res
  })
}