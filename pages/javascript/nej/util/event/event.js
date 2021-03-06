/*
 * ------------------------------------------
 * 自定义事件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proCustomEvent;
    if (!!_p._$$CustomEvent) return;
    /**
     * 自定义事件封装对象，封装的事件支持通过事件相关接口进行添加、删除等操作
     * 
     * 脚本举例
     * [code]
     *   // 添加自定义事件 
     *   nej._v._$addEvent(window,'ok',function(){alert(0);});
     *   nej._v._$addEvent(window,'ok',function(){alert(1);});
     *   // 删除自定义事件
     *   nej._v._$delEvent(window,'ok',function(){alert(0);});
     *   nej._v._$clearEvent(window,'ok');
     *   // 触发自定义事件
     *   window.onok({a:'aaaaa'});
     *   nej._v._$dispatchEvent(window,'ok',{a:'aaaaa'});
     * [/code]
     * 
     * @class   {nej.ut._$$CustomEvent} 自定义事件封装对象
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node}  element 事件关联节点ID或者对象，默认为window对象
     * @config  {String|Array} event   事件名称或者名称列表
     * 
     * [hr]
     * 
     * 初始化时触发事件
     * @event  {oninit}
     * @param  {Object} 事件信息
     * 
     * [hr]
     * 
     * 事件调度前触发事件
     * @event  {ondispatch}
     * @param  {Object} 事件信息
     * 
     * [hr]
     * 
     * 添加事件时触发事件
     * @event  {oneventadd}
     * @param  {Object} 事件信息
     */
    _p._$$CustomEvent = NEJ.C();
    _proCustomEvent = _p._$$CustomEvent._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proCustomEvent.__init = function(){
        // onxxx - event entry handler
        //   xxx - event callback handler list
        this.__cache = {};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proCustomEvent.__reset = function(_options){
        this.__supReset(_options);
        this.__element = _e._$get(_options.element)||window;
        // init event
        this.__doEventInit(_options.event);
        this.__doEventAPIEnhance();
        this._$dispatchEvent('oninit');
    };
    /**
     * 销毁控件
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proCustomEvent.__destroy = function(){
        this.__supDestroy();
        // clear cache
        for(var x in this.__cache){
            if (!_u._$isArray(this.__cache[x]))
                _u._$safeDelete(this.__element,x);
            delete this.__cache[x];
        }
        delete this.__element;
    };
    /**
     * 判断是否需要代理事件
     * @protected
     * @method {__isDelegate}
     * @param  {String|Node} 节点
     * @param  {String}      事件
     * @return {Boolean}     是否需要代理事件
     */
    _proCustomEvent.__isDelegate = function(_element,_type){
        _element = _e._$get(_element);
        return _element===this.__element&&
             (!_type||!!this.__cache['on'+_type]);
    };
    /**
     * 初始化事件
     * @protected
     * @method {__doEventInit}
     * @param  {String} 事件名称
     * @return {Void}
     */
    _proCustomEvent.__doEventInit = function(_event){
        if (_u._$isString(_event)){
            var _name = 'on'+_event;
            if (!this.__cache[_name]){
                this.__cache[_name] = this
                    .__doEventDispatch._$bind(this,_event);
            }
            this.__doEventBind(_event); return;
        }
        if (_u._$isArray(_event))
            for(var i=0,l=_event.length;i<l;i++)
                this.__doEventInit(_event[i]);
    };
    /**
     * 绑定事件
     * @protected
     * @method {__doEventBind}
     * @param  {String} 事件名称
     * @return {Void}
     */
    _proCustomEvent.__doEventBind = function(_type){
        var _event = 'on'+_type,
            _handler = this.__element[_event],
            _handler1 = this.__cache[_event];
        if (_handler!=_handler1){
            this.__doEventDelete(_type);
            if (!!_handler&&_handler!=_f)
                this.__doEventAdd(_type,_handler);
            this.__element[_event] = _handler1;
        }
    };
    /**
     * 添加事件
     * protected
     * @method {__doEventAdd}
     * @param  {String}   事件名称
     * @param  {Function} 事件回调
     * @return {Void}
     */
    _proCustomEvent.__doEventAdd = function(_type,_handler,_front){
        var _list = this.__cache[_type];
        if (!_list){
            _list = [];
            this.__cache[_type] = _list;
        }
        if (_u._$isFunction(_handler)){
            !_front ? _list.push(_handler)
                    : _list.unshift(_handler);
        } 
    };
    /**
     * 删除事件
     * protected
     * @method {__doEventDelete}
     * @param  {String}   事件名称
     * @param  {Function} 事件回调
     * @return {Void}
     */
    _proCustomEvent.__doEventDelete = function(_type,_handler){
        var _list = this.__cache[_type];
        if (!_list||!_list.length) return;
        // clear all event handler
        if (!_handler){
            delete this.__cache[_type];
            return;
        }
        // delete one event handler
        for(var i=_list.length-1;i>=0;i--)
            if (_handler===_list[i]){
                _list.splice(i,1);
                break;
            }
    };
    /**
     * 事件调度
     * protected
     * @method {__doEventDispatch}
     * @param  {String} 事件名称
     * @param  {Object} 事件对象
     * @return {Void}
     */
    _proCustomEvent.__doEventDispatch = function(_type,_event){
        _event = _event||{noargs:!0};
        _event.type = _type;
        this._$dispatchEvent('ondispatch',_event);
        if (!!_event.stopped) return;
        var _list = this.__cache[_type];
        if (!_list||!_list.length) return;
        for(var i=0,l=_list.length;i<l;i++)
            try{
                _list[i](_event);
            }catch(ex){
                // ignore
                console.error(ex.message);
                console.error(ex.stack);
            }
    };
    /**
     * 增强事件操作API
     * protected
     * @method {__doEventAPIEnhance}
     * @return {Void}
     */
    _proCustomEvent.__doEventAPIEnhance = function(){
        // void multi-enhance
        if (!!this.__enhanced)
            return;
        this.__enhanced = true;
        _v._$addEvent = 
        _v._$addEvent._$aop(function(_event){
            var _args = _event.args,
                _type = _args[1].toLowerCase();
            if (this.__isDelegate(_args[0],_type)){
                _event.stopped = !0;
                this.__doEventBind(_type);
                this.__doEventAdd(_type,_args[2],_args[3]);
                this._$dispatchEvent('oneventadd',{
                    type:_type,
                    listener:_args[2]
                });
            }
        }._$bind(this));
        _v._$delEvent = 
        _v._$delEvent._$aop(function(_event){
            var _args = _event.args,
                _type = _args[1].toLowerCase();
            if (this.__isDelegate(_args[0],_type)){
                _event.stopped = !0;
                this.__doEventDelete(_type,_args[2]);
            }
        }._$bind(this));
        _v._$clearEvent = 
        _v._$clearEvent._$aop(function(_event){
            var _args = _event.args,
                _type = (_args[1]||'').toLowerCase();
            if (this.__isDelegate(_args[0])){
                if (!!_type){
                    this.__doEventDelete(_type);
                    return;
                }
                for(var x in this.__cache){
                    if (_u._$isArray(this.__cache[x]))
                        this.__doEventDelete(x);
                }
            }
        }._$bind(this));
        _v._$dispatchEvent = 
        _v._$dispatchEvent._$aop(function(_event){
            var _args = _event.args,
                _type = _args[1].toLowerCase();
            if (this.__isDelegate(_args[0],_type)){
                _event.stopped = !0;
                _args[0]['on'+_type].apply(_args[0],_args.slice(2));
            }
        }._$bind(this));
    };
};
NEJ.define('{lib}util/event/event.js',
          ['{lib}base/util.js'
          ,'{lib}base/event.js'
          ,'{lib}base/element.js'
          ,'{lib}util/event.js'],f);