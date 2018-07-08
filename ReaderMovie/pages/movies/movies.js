var util = require('../../utils/utils.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250Url: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 正在上映
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    // 即将上映
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    // top250Url
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    // 第二个参数传递，为了区分是哪个请求
    this.getMovieListData(inTheatersUrl, "inTheaters");
    this.getMovieListData(comingSoonUrl, "comingSoon");
    this.getMovieListData(top250Url, "top250Url");
  },
  /**
   * 点击更多的事件
   */
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category,
    })
  },

  /**
   * 点击每个电影封面跳转到电影详情页面
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  /**
   * 搜索框获取焦点，点击X隐藏搜索页面，回到电影页面
   */
  onCancelImgTap: function() {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  /**
   * 搜索框获取焦点后隐藏电影页面，显示搜索页面
   */
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  /**
   * 搜索框获取焦点后隐藏电影页面，显示搜索页面
   */
  onBindChange: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    // searchResult: {};
    this.getMovieListData(searchUrl, "searchResult");
    // util.http(searchUrl, this.callbacksucess);
  },

  // 调用封装好的request
  // callbacksucess: function(data) {
  //   this.processDoubanData(data, "searchResult", "");
  // },

  /**
   * 异步请求（3个请求）
   */
  getMovieListData: function (url, settedKey) { // 第二个参数传递，为了区分是哪个请求
    var that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'json'
      },
      method: "GET",
      success: function (res) {
        that.processDoubanData(res.data, settedKey, res.data.title); // 第三个参数传递，获取请求中的真实数据title
      },
      fail: function () {

      }
    })
  },

  processDoubanData: function (moviesDouban, settedKey, titles) {
    var movies = [];
    for (var subject in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[subject];
      var title = subject.title;
      if (title.length >= 6) { // 如果电影名字位数大于等于6位则截取用...省略
        title = title.substring(0,6) + "...";
      }
      // 请求中的数据较多，封装成需要的数据
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title, // 电影名字
        average: subject.rating.average, // 电影评分
        coverageUrl: subject.images.large, // 电影图片
        movieId: subject.id // 电影id，传递到详情使用
      }
      // 将封装好的数据合并到数组里
      movies.push(temp);
    }
    // 定义一个空对象
    var readyData = {};
    //根据 settedKey 来区分向对象内添加数据
    readyData[settedKey] = {
      titles: titles, // 正在上映标题
      movies: movies
    };
    // 将封装好的数据set，wxml里进行使用readyData
    // readyData[settedKey] = movies; // 这种方法需要在wxml里循环2次
    this.setData(readyData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})