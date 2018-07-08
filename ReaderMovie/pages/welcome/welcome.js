Page({
  /**
   * 引导页跳转到主页面
   */
  onTap: function(event) {
    // wx.navigateTo从父页面一直往下面跳转最多5级，每个子页面左      上方可以返回一层层上一级
    // wx.navigateTo({
    //   url: "../posts/post"
    // });
    // wx.redirectTo关闭当前页面跳转到下一个页面，左上角不能返回    上级页面
    wx.switchTab({
      url: "../posts/post"
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    text: 'Hello World'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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