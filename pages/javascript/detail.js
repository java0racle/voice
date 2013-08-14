

define(['{lib}util/flash/flash.js'],
function(){
  var _  = NEJ.P,
      _e = _('nej.e'),
      _v = _('nej.v'),
      _id = 'flash-obj',
      _state = 0;
  var _flashobj = document.embeds[_id]||_e._$get(_id)||document[_id]||window[_id];
  var _onPlay = function(_event){
    _event = _event||window.event;
    var _target = _event.target||_event.srcElement;
    if(!_flashobj||!_flashobj.play) return;
    if(_state == 1){
      _flashobj.pause();
      _state = 0;
      _target.value = '继续';
    }else{
      _flashobj.play();
      _state = 1;
      _target.value = '暂停';
    }
  };

  var _onInit = function(){
    if(!_flashobj||!_flashobj.setSrc) return;
    _flashobj.setSrc('res/hmm.mp3');
    _flashobj.load();
    window.clearInterval(_t);
  };

  var _onStop = function(){
    if(!_flashobj||!_flashobj.stop) return;
    _flashobj.stop();
  };

  var _onMark = function(){
  };

  _v._$addEvent(_e._$get('play'),'click',_onPlay._$bind(this));
  // _v._$addEvent(_e._$get('pause'),'click',_onPause._$bind(this));
  _v._$addEvent(_e._$get('stop'),'click',_onStop._$bind(this));
  _v._$addEvent(_e._$get('mark'),'click',_onMark._$bind(this));
  var _t = window.setInterval(function(){
    _onInit();
  },1000);
})
