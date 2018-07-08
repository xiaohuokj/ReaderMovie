function convertToStarsArray(stars) {
  var num = stars.toString().substring(0,1);
  var array = [];
  for (var i = 1; i<=5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

/**
   * 异步请求（3个请求）
*/
function http (url, callBack) { // 第二个参数传递，为了区分是哪个请求
  wx.request({
    url: url,
    header: {
      'content-type': 'json'
    },
    method: "GET",
    success: function (res) {
      callBack(res.data);
    },
    fail: function () {

    }
  })
}

// 将电影演员名称封装，并用/ 分割
function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + "/";
  }
  // console.log(castsjoin.substring(0, castsjoin.length-1));
  return castsjoin.substring(0, castsjoin.length - 1); // 删除字符串中最后一个 "/"
}

// 封装影片图片集
function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "", // 如果有avatars 就使用large，否则就为空
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}