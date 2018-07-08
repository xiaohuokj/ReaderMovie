var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    // this.data.postData = postData
    // 获取模拟的数据并返回到视图
    this.setData({
      postData: postData
    })

    // 通过微信存储Storage模拟收藏文章与取消收藏功能
    var postsCollected = wx.getStorageSync('posts_collected'); // 第一次从上级页面进本页面获取缓存中是否有值
    if (postsCollected) {
      var postCollected = postsCollected[postId] // 获取缓存中与当前页面的postid的存储状态2种状态，false和true
      if (postCollected) { // 如果缓存中没有与本页面postid对应的值，则此时是undefined，需要加入此判断，如果不判断，控制台会报个错，但不影响正常逻辑
        this.setData({ // 如果缓存中有值则对collected视图进行绑定
          collected: postCollected
        })
      }
    }
    else { // 如果从来没进入过阅读页面列表，就执行以下代码，必须是一次没进入过阅读列表；默认创建个对象并对点击进来的编号进行缓存赋值false
      var postsCollected = {};
      postsCollected[postId] = false; // 编号进行缓存赋值为 false
      wx.setStorageSync('posts_collected', postsCollected); // 对缓存中进行设置当前页面状态
    }
    // 判断当前音乐播放状态与是哪首音乐
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor();
  },
  //点击播放图标和总控开关都会触发这个函数
  setMusicMonitor: function () {
    // 监听主控音乐开关状态与页面图标同步
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true; // 改变全局变量，避免下次进入页面音乐播放的图标不正常显示
      app.globalData.g_currentMusicPostId = that.data.currentPostId; // 获取当前哪个音乐在播放
    });
    // 监听主控音乐开关暂停与页面图标同步
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false; // 改变全局变量，避免下次进入页面音乐播放的图标不正常显示
      app.globalData.g_currentMusicPostId = null; // 清除当前哪个音乐在播放的数据值，恢复到页面初始化状态值
    });
    // 监听音乐播放完成后将音乐数据与页面渲染进行初始化
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false; // 改变全局变量，避免下次进入页面音乐播放的图标不正常显示
      app.globalData.g_currentMusicPostId = null; // 清除当前哪个音乐在播放的数据值，恢复到页面初始化状态值
    });
  },
  /**
   * 点击收藏图标/取消收藏
   */
  onColletionTap: function (event) {
    this.getPostsCollectedSyc();
    // this.getPostsCollectedAsy();
  },
  /**
   * 异步方法
   */
  getPostsCollectedAsy: function() {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);  // 自定义方法调用微信提示框
      },
    })
  },
  /**
   * 同步方法
   */
  getPostsCollectedSyc: function() {
    var postsCollected = wx.getStorageSync('posts_collected'); // 获取缓存中的数据值
    var postCollected = postsCollected[this.data.currentPostId]; // 根据postid匹配当前页面的postid值
    // 更新收藏状态
    postCollected = !postCollected; // 反向对比
    postsCollected[this.data.currentPostId] = postCollected; // 跟新状态到缓存里

    this.showToast(postsCollected, postCollected);  // 自定义方法调用微信提示框
  },



  /**
   * 点击收藏与取消收藏弹出提示(模态框)需要手动点击操作
   */
  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected?"收藏该文章？" : "取消收藏该文章？",
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected); // 跟新状态到缓存里
          that.setData({ // 赋值到视图层
            collected: postCollected
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  /**
   * 点击收藏与取消收藏弹出提示
   */
  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected); // 跟新状态到缓存里
    this.setData({ // 赋值到视图层
      collected: postCollected
    })

    wx.showToast({ // 微信提示框
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
  /**
   * 点击分享图标
   */
  onShareTap: function() {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '无法实现分享功能',
        })
      },
    })
  },
  /**
   * 点击顶图上面的音乐图标
   */
  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId]; // 获取当前页面的postid
    var isPlayingMusic = this.data.isPlayingMusic; // 获取 isPlayingMusic 当前是否true 还是 false
    if (isPlayingMusic)  { // 判断音乐当前状态
      wx.pauseBackgroundAudio();
      this.setData({ // 改变音乐 isPlayingMusic 的状态
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false; // 改变全局变量，避免下次进入页面音乐播放的图标不正常显示
    } else {
      wx.playBackgroundAudio({ // 获取音乐各个参数
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({ // 改变音乐 isPlayingMusic 的状态
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true; // 改变全局变量，避免下次进入页面音乐播放的图标不正常显示
    }
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