/*
 * ------------------------------------------
 * REST风格交互接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var r = NEJ.R,
        o = NEJ.O,
        f = NEJ.F,
        g = NEJ.P('nej.g'),
        u = NEJ.P('nej.u'),
        j = NEJ.P('nej.j'),
        __cache = {},  // request cache - sn:{s:funciton(){},f:function(){}}
        __filter = []; // error filter list
    /*
     * 清理请求信息
     * @param  {String} _key 请求标识
     * @return {Void}
     */
    var _doClear = function(_key){
        var _request = __cache[_key];
        if (!_request) return;
        delete _request.s;
        delete _request.f;
        delete __cache[_key];
    };
    /*
     * 处理请求回调
     * @param  {String} _key  请求标识
     * @param  {String} _type 回调类型
     * @return {Void}
     */
    var _doCallback = function(_key,_type){
        var _request = __cache[_key];
        if (!_request) return;
        var _callback = _request[_type],
            _args = r.slice.call(arguments,2);
        try{
            (_callback||f).apply(null,_args)
        }catch(ex){
            // ignore
            console.error(ex.message);
            console.error(ex);
        }
        _doClear(_key);
    };
    /*
     * 请求成功回调
     * @param  {String}   _key  请求标识
     * @param  {Variable} _data 返回数据
     * @return {Void}
     */
    var _onLoad = function(_key,_data){
        _doCallback(_key,'s',_data);
    };
    /*
     * 请求出错回调
     * @param  {String} _key   请求标识
     * @param  {Object} _error 错误信息
     * @return {Void}
     */
    var _onError = function(_key,_error){
        _error = _error||{};
        // status 204 is ok
        if (_error.code==g.
            _$CODE_ERRSERV&&
            _error.data==204){
            _onLoad(_key,null);
            return;
        }
        // do error filter
        // set error attr stopped=!0 will stop request error callback
        for(var i=0,l=__filter.length;i<l;i++)
            try{
                __filter[i](_error);
            }catch(ex){
                // ignore
                console.error(ex.message);
                console.error(ex);
            }
        if (!!_error.stopped){
            _doClear(_key);
            return;
        }
        // do request fail callback
        _doCallback(_key,'f',_error);
    };
    /**
     * 使用REST风格进行数据交互接口<br/>
     * 脚本举例
     * [code]
     *   var url = "http://123.163.com/webmail/dwr/call/plaincall/DownloadBean.getDownloadUrlByBrandAndModel.dwr";
     *   var opt = {
     *        param:{brand:'nokia',model:'9'}
     *       ,data:'123'
     *       ,method:'post'
     *       ,onload:function(_data){
     *           // 请求正常回调
     *       }
     *       ,onerror:function(_error){
     *           // 异常回调
     *       }
     *   }
     *   j._$requestByREST(url,opt);
     * [/code]
     * @api    {nej.j._$requestByREST}
     * @param  {String} 请求地址
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {Boolean}  sync    是否同步请求
     * @config {Variable} data    要发送的数据
     * @config {Object}   param   请求参数,包括模板地址里使用的参数
     * @config {String}   method  请求方式,GET/POST/PUT/DELETE
     * @config {Number}   timeout 超时时间,0 禁止超时监测
     * @config {Object}   headers 头信息
     * @return {nej.j}
     * 
     * [hr]
     * 
     * @event  {onload} 载入完成回调函数
     * @param  {Object} 返回的数据
     * 
     * [hr]
     * 
     * @event  {onerror} 载入出错回调函数
     * @param  {Object}  错误信息
     * 
     * [hr]
     * 
     * @event  {onbeforerequest} 请求之前对数据处理回调
     * 
     */
    j._$requestByREST = (function(){
        var _reg0 = /\{(.*?)\}/gi,
            _reg1 = /^get|delete|head$/i,
            _jsn = /json/i,
            _xml = /xml/i;
        return function(_url,_options){
            _options = NEJ.X({},_options);
            var _exist = {},
                _param = _options.param||o;
            // parse uri template
            _url = _url.replace(_reg0,function($1,$2){
                       var _value = _param[$2];
                       if (_value!=null) 
                           _exist[$2] = !0;
                       return encodeURIComponent(_value||'')||$1;
                   });
            // parse remain param 
            var _data = _options.data||{};
            for(var x in _param)
                if (!_exist[x]) 
                    _data[x] = _param[x];
            // parse headers
            var _type = 'text',
                _headers = _options.headers||{},
                _accept  = _headers['Accept']||_headers['accept'],
                _content = _headers['Content-Type']||_headers['content-type'];
            // response data format
            if (!_accept){
                _accept = 'application/json';
                _headers['Accept'] = _accept;
            }
            if (_jsn.test(_accept)) 
                _type = 'json';
            else if(_xml.test(_accept)) 
                _type = 'xml';
            // send data format
            if (!_content){
                _content = 'application/json';
                _headers['Content-Type'] = _content;
            }
            // do request
            var _key = u._$randNumberString();
            __cache[_key] = {s:_options.onload||f
                            ,f:_options.onerror||f};
            // add params to url with GET/HEAD/DELETE method
            _options.method = _options.method||'GET';
            if (_reg1.test(_options.method.trim())){
                _options.query = _data;
                _data = null;
            }else if (_jsn.test(_content)){
                _data = JSON.stringify(_data);
            }
            _options.type    = _type;
            _options.data    = _data;
            _options.headers = _headers;
            _options.onload  = _onLoad._$bind(null,_key);
            _options.onerror = _onError._$bind(null,_key);
            j._$request(_url,_options);
            return this;
        };
    })();
    /**
     * 添加错误过滤接口<br/>
     * 脚本举例
     * [code]
     *   // 过滤掉404的异常情况
     *   var _filter = function(_error){
     *      if(_error.data == 404)
     *        _error.stopped = true;
     *   }
     *   // 加了过滤器，控制stopped，判断错误是否做异常回调
     *   j._$addRESTErrorFilter(_filter);
     *   var opt = {
     *        param:{brand:'nokia',model:'9'}
     *       ,data:'123'
     *       ,method:'post'
     *       ,onload:function(_data){
     *           // 请求正常回调
     *       }
     *       ,onerror:function(_error){
     *           // 异常回调
     *       }
     *   }
     *   // 请求url不正确，会抛出404异常
     *   j._$requestByREST('xxxx',opt);
     * [/code]
     * @api    {nej.j._$addRESTErrorFilter}
     * @param  {Function} 过滤接口
     * @return {nej.j}
     */
    j._$addRESTErrorFilter = function(_filter){
        if (!u._$isFunction(_filter)) return this;
        for(var i=0,l=__filter.length;i<l;i++)
            if (_filter==__filter[i]) return this;
        __filter.push(_filter);
        return this;
    };
    /**
     * 删除错误过滤接口<br/>
     * 脚本举例
     * [code]
     *   var url = "http://123.163.com/webmail/dwr/call/plaincall/DownloadBean.getDownloadUrlByBrandAndModel.dwr";
     *   var _filter = function(_error){
     *      _error.stopped = true;
     *   }
     *   // 加了过滤器，控制stopped，判断错误是否做error回调
     *   j._$addRESTErrorFilter(_filter);
     *   // 移除过滤器,过滤器列表此时长度为0
     *   j._$delRESTErrorFilter(_filter);
     *   var opt = {
     *        param:{brand:'nokia',model:'9'}
     *       ,data:'123'
     *       ,method:'post'
     *       ,onload:function(_data){
     *           // 请求正常回调
     *       }
     *       ,onerror:function(_error){
     *           // 异常回调
     *       }
     *   }
     *   j._$requestByREST(url,opt);
     * [/code]
     * @api    {nej.j._$delRESTErrorFilter}
     * @param  {Function} 过滤接口
     * @return {nej.j}
     */
    j._$delRESTErrorFilter = function(_filter){
        if (!u._$isFunction(_filter)) return this;
        for(var i=__filter.length-1;i>=0;i--)
            if (_filter==__filter[i]){
                __filter.splice(i,1);
                return this;
            }
    };
};
NEJ.define('{lib}util/ajax/rest.js',
      ['{lib}util/ajax/xdr.js'],f);