var ADMINISTRATORS = ['瓶瓶大仙儿'];
var REG_ADMINISTRATORS = new RegExp('^(' + ADMINISTRATORS.join('|') + ')：')

PLATFORM.DouyuCom = function() {
  this.lastMessage = null;
  this.init();
};
PLATFORM.DouyuCom.prototype = {
  init: function() {
    if (window.location.href.indexOf('//www.douyu.com/clantu') < 0) return;
    this.inject();
    setInterval(this.read.bind(this), 300);
    console.log('douyu.com: init');
  },
  inject: function() {
    var styleNode = document.createElement('style');
    styleNode.innerHTML = 'body *{visibility:hidden!important;pointer-events:none}.chat-cont-wrap,.chat-cont-wrap *,#js-send-msg,#js-send-msg *{visibility:visible!important;pointer-events:auto}.chat-cont-wrap{position:fixed!important;width:auto!important;height:auto!important;top:0!important;left:0!important;right:0!important;bottom:60px!important}#js-send-msg{position:fixed!important;left:0!important;right:0!important;bottom:0!important}';
    document.head.appendChild(styleNode);
  },
  read: function() {
    var messageNodes = document.querySelectorAll('.jschartli');
    if (!messageNodes.length) return;
    var currentMessage = messageNodes[messageNodes.length - 1].innerText;
    if (!currentMessage || currentMessage === this.lastMessage) return;
    this.lastMessage = currentMessage;
    this.parse(currentMessage);
    console.log(currentMessage)
  },
  parse: function(message) {
    message = message || this.lastMessage || '';
    this.parseMusic(message);
    this.parseSwitch(message);
  },
  parseMusic: function(message) {
    message = message || this.lastMessage || '';
    // #点歌 歌曲名-歌手#
    // #点歌 春风十里#
    // #点歌 理想三旬#
    var match = message.match(/#点歌([^/#]+)(-([^#]+))?#/);
    if (!match) return;
    var song = (match[1] || '').trim();
    var singer = (match[3] || '').trim();
    var img = new Image();
    img.src = 'http://127.0.0.1:6688/music/play?_t=' + Date.now() + '&song=' + encodeURIComponent(song || '') + '&singer=' + encodeURIComponent(singer || '');
  },
  parseSwitch: function(message) {
    message = message || this.lastMessage || '';
    var match = message.match(/#切歌#/);
    if (!match) return;
    // if (!REG_ADMINISTRATORS.test(message)) return;
    var img = new Image();
    img.src = 'http://127.0.0.1:6688/music/switch?_t=' + Date.now();
  }
};

// 获取歌单
// var list = document.querySelectorAll('#auto-id-hnHP1W1H5TmJaf9v td .f-cb .tt .ttc .txt b')
// var songs = [];
// list.forEach(function(el) {
//   var tr = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
//   var singerNode = tr.querySelector('div.text span a');
//   var song = [el.innerText];
//   if (singerNode) {
//     song.push(singerNode.innerText);
//   }
//   songs.push(song.join('-'))
// });