define(['{lib}util/flash/flash.js',
        '{lib}util/event.js'],
function(){
  var _  = NEJ.P,
      _e = _('nej.e'),
      _v = _('nej.v'),
      _p = _('vc.p'),
      _ut= _('nej.ut'),
      _id = 'flash-obj',
      _state = 0,
      _pro,
      _sup;
  _p._$$Voice = NEJ.C();
  _pro = _p._$$Voice._$extend(_ut._$$Event);

  _pro.__init = function(){
    this.__supInit();
    this.__flashobj = document.embeds[_id]||_e._$get(_id)||document[_id]||window[_id];
    _v._$addEvent(_e._$get('play'),'click',this.__onPlay._$bind(this));
    _v._$addEvent(_e._$get('stop'),'click',this.__onStop._$bind(this));
    _v._$addEvent(_e._$get('mark'),'click',this.__onMark._$bind(this));
    this.__doInit();
  };

  _pro.__doInit = function(){
    this.__flashobj.setSrc('res/hmm.mp3');
    this.__flashobj.load();
  };

  _pro.__onPlay = function(_event){
    _event = _event||window.event;
    var _target = _event.target||_event.srcElement;
    if(!this.__flashobj||!this.__flashobj.play) return;
    if(_state == 1){
      this.__flashobj.pause();
      _state = 0;
      _target.value = '继续';
    }else{
      this.__flashobj.play();
      _state = 1;
      _target.value = '暂停';
    }
  };

  _pro.__onStop = function(){
    if(!this.__flashobj||!this.__flashobj.stop) return;
    this.__flashobj.stop();
  };

  _pro.__onMark = function(){
  };

})
