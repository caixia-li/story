function timeFormate(parmas) {
  let date = new Date(parmas);
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  let o = {
    'M+': date.getMonth() + 1,//月份
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  for (var x in o) {
    if (new RegExp(`(${x})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, o[x] > 9 ? o[x] : '0' + o[x])
    }
  }
  return fmt
}

module.exports = timeFormate;