

define(['{lib}util/flash/flash.js'],
function(){
  var _  = NEJ.P,
      _e = _('nej.e'),
      _v = _('nej.v'),
      _id = 'flash-obj';
  var _flashobj = document.embeds[_id]||_e._$get(_id)||document[_id]||window[_id];
  var _onPlay = function(){
    if(!_flashobj) return;
    _flashobj.setSrc('res/hmm.mp3');
    _flashobj.load();
    _flashobj.play();
  };

  var _onPause = function(){
    if(!_flashobj) return;
    _flashobj.pause();
  };

  var _onStop = function(){
    if(!_flashobj) return;
  };

  var _onMark = function(){
  };

  _v._$addEvent(_e._$get('play'),'click',_onPlay._$bind(this));
  _v._$addEvent(_e._$get('pause'),'click',_onPause._$bind(this));
  _v._$addEvent(_e._$get('stop'),'click',_onStop._$bind(this));
  _v._$addEvent(_e._$get('mark'),'click',_onMark._$bind(this));
})
