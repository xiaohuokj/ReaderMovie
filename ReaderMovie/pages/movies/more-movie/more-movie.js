var util = require('../../../utils/utils.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
    totalNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    // this.setData({
    //   navigateTitle: category
    // })
    // wx.setNavigationBarTitle({
    //   title: category
    // })
    var dataUrl = ""; // 定义外部一个空字符串，为了下面判断得到的数据进行赋值
    switch (category) { // 判断是哪个分类的更多列表
      case "正在上映的电影-北京":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映的电影":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣电影Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl; // 获取到的url请求赋值到全局data里
    util.http(dataUrl, this.processDoubanData); // 调用外部封装的wx.request请求
  },

  /**
   * 上拉加载更多数据 方法
   */
  /**onScrollLower: function (event) { // this.data.requestUrl 和 this.data.totalCount从 data里可以获得
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData); // 上面拼接好的新的url 进行请求
    wx.showNavigationBarLoading();
  }, */

  processDoubanData: function (moviesDouban) {
    var totalNumber = moviesDouban.total;
    this.setData({
      totalNumber: totalNumber
    })
    var movies = [];
    for (var subject in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[subject];
      var title = subject.title;
      if (title.length >= 6) { // 如果电影名字位数大于等于6位则截取用...省略
        title = title.substring(0, 6) + "...";
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
    var totalMovies = {};
    // 如果是第一次加载（初始化页面）就执行else里并且更改isEmpty的状态，如果上拉加载就执行 if 里
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies); // 新请求的数据和页面初始化数据合并在一起
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20; // 每次加20
    wx.hideNavigationBarLoading(); // 隐藏标题左边的loading图标
    wx.stopPullDownRefresh(); // 停止loading
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  /**
   * 点击每个电影封面跳转到电影详情页面
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData); // 上面拼接好的新的url 进行请求
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    if (this.data.totalCount >= this.data.totalNumber) {
      return;
    }
    util.http(nextUrl, this.processDoubanData); // 上面拼接好的新的url 进行请求
    wx.showNavigationBarLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})