Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    circular: true,
    vertical: false,
    imgs: [
      'http://bpic.588ku.com/back_pic/05/04/04/76595daf152ecb0.jpg!r650/fw/800',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],

    img: "http://bpic.588ku.com/back_pic/05/04/04/76595daf152ecb0.jpg!r650/fw/800",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onSlideChangeEnd: function (event) {
    // console.log(event.detail.current); // 获取轮播图当前index
  },

  getPhoneNumber: function(event) {
    // console.log(event);
    wx.request({
      url: 'http://127.0.0.1:8080/wechat/authorization/getPhoneNumber',
      data: {
        sessionKey: wx.getStorageSync('session_key'),
        ivData: event.detail.iv,
        encrypData: event.detail.encryptedData
      },
      success: function(res) {
        console.log(res);
      }
    })
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