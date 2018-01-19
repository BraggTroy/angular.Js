/**
 * 插件 控件 组件等封装测试
 * 2018/01/09 BraggTroy
 */
/*
 1.交互弹窗，可确定取消，实现数据控制
 2.简单提示
 3.加载过渡
 */
;
var plugins = (function (win,doc,undefined) {
    "use strict";
    var pluginName = "弹窗插件";

    // 默认参数
    var defaults = {
        'title': '提示',  // 弹窗标题
        'msg': '',  // 单条提示
        'html': '',     // 提示内容支持html，msg将无效
        'type': 'success',  // 设置msg提示的类别
        'time': 1500,       // msg默认显示1500ms
        'showCancel': true,   // 显示取消按钮
        'showMask': true,     // 显示背景遮罩层
        'canMove': true,    // 能够移动
        'loading': '1',      // 加载动画的选择，默认为1
        'confirm': function () { console.log("你点了确定！"); },  // 点击确定
        'cancel': function () { console.log("你点了取消！"); }    // 点击取消

    };

    var start = {}, // 鼠标按下时的坐标
        box = {}; // 弹窗坐标

    var size = {
        'width': doc.documentElement.clientWidth,
        'height': doc.documentElement.clientHeight
    };

    // 辅助工具
    // $.extend
    var _merger = function () {
        var inner_merger = function (obj1, obj2) {
            for (var key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    obj1[key] = obj2[key];
                }
            }
            return obj1;
        };
        var ret = {};
        for (var i = 0, l = arguments.length; i < l; i++) {
            inner_merger(ret, arguments[i])
        }
        return ret;
    };

    // 只获取id或class元素
    var _get = function (node) {
        var n = document.getElementById(node);
        if(!n){
            n = document.getElementsByClassName(node)
        }
        return n;
    };

    var _remove = function () {
        _get('plugins-modal')[0].remove();
    };

    // 弹窗定位
    var _position = function (mouse) {
        var that = _get("plugins-position")[0] || null;
        if(!that){ return;}
        if(mouse && mouse.x){
            var _top = box.y - (start.y - mouse.y),
                _left = box.x - (start.x - mouse.x);

            // 可移动区域限制
            if(_top <= 0){ _top = 0;}
            if(_left <= 0){ _left = 0;}
            if(_left >= size.width - box.width){ _left = size.width - box.width; }
            if(_top >= size.height - box.height){ _top = size.height - box.height; }

            // 最终定位
            that.style.top = _top + 'px';
            that.style.left = _left + 'px';
        }else{
            // 存放尺寸数据
            size = {
                'width': doc.documentElement.clientWidth,
                'height': doc.documentElement.clientHeight
            };
            // 初始化，无参 定位
            var top = (size.height - that.offsetHeight)/2,
                left = (size.width - that.offsetWidth)/2;
            that.style.top = top + 'px';
            that.style.left = left + 'px';
        }

    };

    // 移动的实现
    var _pluginsMove = function () {
        var e = win.event;
        e.preventDefault();
        var mouse = {
            x: e.pageX,
            y: e.pageY
        };
        _position(mouse);

    };

    // 弹窗拖动事件监听
    var _canMove = function () {

        _get('plugins-title')[0].addEventListener('mousedown',function (e) {
            start = {
                x: e.pageX,
                y: e.pageY
            };
            var that = _get("plugins-box")[0];
            box = {
                x: that.offsetLeft,
                y: that.offsetTop,
                width: that.offsetWidth,
                height: that.offsetHeight
            };

            this.classList.add('plugins-move');
            document.getElementsByTagName('html')[0].addEventListener('mousemove',_pluginsMove,false);

        },false);


        _get('plugins-title')[0].addEventListener('mouseup',function () {
            document.getElementsByTagName('html')[0].removeEventListener('mousemove',_pluginsMove,false);

            _get('plugins-move')[0].removeEventListener('mousemove',_pluginsMove,false);
            this.classList.remove('plugins-move');
        },false);

    };

    var _dom = function (nodeName,classList,html) {
        nodeName = nodeName || 'div';
        classList = classList || [];
        // 类名转数组
        if(!~Object.prototype.toString.call(classList).indexOf('Array')){
            classList = classList.split(' ').join(',').split(',');
        }
        var node = document.createElement(nodeName);
        for(var i=0; i<classList.length; i++){
            node.classList.add(classList[i]);
        }
        if(html){
            node.innerHTML = html;
        }
        return node;
    };

    // 创建弹窗元素
    var _createPluginsEle = function (options, $P) {
        var $body = document.getElementsByTagName('body')[0];

        var $out = _dom('div','plugins-modal');
        // $out.addEventListener('transitionend',_remove);
        $out.addEventListener('webkitAnimationEnd',_remove);

        // 是否显示背景层
        if(options.showMask){
            var $mask = _dom('div','plugins-mask');
            $out.appendChild($mask);
        }
        var $box = _dom('div','plugins-position plugins-box');
        var $inner = _dom('div','plugins-inner');

        //
        var $title = _dom('div','plugins-title','<span>'+ options.title +'</span>');
        if(options.canMove){
            $title.classList.add('plugins-cursor');
        }
        var $aclose = _dom('div','close','&times');

        $aclose.addEventListener('click', function () {
            $P.hide();
        });
        $title.appendChild($aclose);

        //
        var for_content = '';
        var isHtml = false;
        if(options.html.length > 0){
            for_content = options.html;
            isHtml = true;
        }else if(options.msg.length > 0){
            for_content = '<div class="text-cont">' + options.msg + '</div>';
        }else{
            for_content = '<div class="text-cont">' + pluginName + '</div>';
        }
        var $cont = _dom('div','plugins-cont',for_content);

        if(isHtml){
            $cont.style.maxHeight = size.height - 300 + 'px';
            $cont.style.overflow = 'auto';
            $cont.style.display = 'block';
        }


        var $btnConfirm = _dom('button','button button-confirm','确定');
        var $btnCancel = _dom('button','button button-cancel','取消');
        var $btns = _dom('div','plugins-buttons');

        $btnConfirm.addEventListener('click', function () {
            var con = options.confirm();
            if(con){
                $P.hide();
            }
        });
        $btns.appendChild($btnConfirm);
        if(options.showCancel){
            $btnCancel.addEventListener('click', function () {
                options.cancel();
                $P.hide();
            });
            $btns.appendChild($btnCancel);
        }

        //
        $inner.appendChild($title);
        $inner.appendChild($cont);
        $inner.appendChild($btns);
        $box.appendChild($inner);
        $out.appendChild($box);
        // 添加元素
        $body.appendChild($out);

        // 定位
        _position();
        // 移动
        if(options.canMove){
            _canMove();
        }
    };

    // 创建msg元素
    var _createPluginsMsg = function (options, $P) {
        var $body = document.getElementsByTagName('body')[0];

        var $out = _dom('div','plugins-modal');

        if(options.showMask){
            var $mask = _dom('div','plugins-mask plugins-msg-mask');
            $out.appendChild($mask);
        }

        var $msg = _dom('div','plugins-position plugins-msg');

        var $iconwrap = _dom('div','picon-wrap');
        var $picon = _dom('i','picon');
            var $picon_1 = _dom('i','');
            var $picon_2 = _dom('i','');
            $picon.appendChild($picon_1);
            $picon.appendChild($picon_2);
        $iconwrap.appendChild($picon);

        var $msgwrap = _dom('div','pmsg-wrap');
        var $pmsgin = _dom('div','pmsg-in',options.msg);
        $msgwrap.appendChild($pmsgin);

        if(options.type == 'success'){
            $msg.classList.add('plugins-success');
            $picon_1.className = 'picon-suc-1';
            $picon_2.className = 'picon-suc-2';
        }else if(options.type == 'warning'){
            $msg.classList.add('plugins-warning');
            $picon_1.className = 'picon-warning-1';
            $picon_2.className = 'picon-warning-2';
        }else if(options.type == 'error'){
            $msg.classList.add('plugins-error');
            $picon_1.className = 'picon-error-1';
            $picon_2.className = 'picon-error-2';
        }else{
            $msg.classList.add('plugins-success');
            $picon_1.className = 'picon-suc-1';
            $picon_2.className = 'picon-suc-2';
        }

        $msg.appendChild($iconwrap);
        $msg.appendChild($msgwrap);
        $out.appendChild($msg);
        $body.appendChild($out);

        // 定位
        _position();

        setTimeout(function () {
            $out.addEventListener('webkitAnimationEnd',_remove);
            $P.hide();
        },options.time);
    };

    // 创建loading元素
    var _createLoading = function (options, $P) {
        var $body = document.getElementsByTagName('body')[0];

        var $out = _dom('div','plugins-modal');

        if(options.showMask){
            var $mask = _dom('div','plugins-mask plugins-msg-mask');
            $out.appendChild($mask);
        }

        var $loading = _dom('div','plugins-position plugins-msg plugins-loading');
        var $iconwrap = _dom('div','picon-wrap');


        // 默认加载样式 返回节点HTML元素
        function default_loading() {
            var $spinner = _dom('div','spinner');
            var $con1 = _dom('div','spinner-container container1'),
                $con2 = _dom('div','spinner-container container2'),
                $con3 = _dom('div','spinner-container container3'),
                $circle1 = _dom('div','circle1'),
                $circle2 = _dom('div','circle2'),
                $circle3 = _dom('div','circle3'),
                $circle4 = _dom('div','circle4');
            var con_ = [$con1,$con2,$con3],
                circle_ = [$circle1,$circle2,$circle3,$circle4];

            var outHtml = '';
            for(var i=0; i<3;i++){
                var inHtml = '';
                for(var j=0; j<4; j++){
                    inHtml += circle_[j].outerHTML;
                }
                con_[i].innerHTML = inHtml;
                outHtml += con_[i].outerHTML;
            }
            $spinner.innerHTML = outHtml;
            return $spinner;
        }

        var $icon;
        if(options.loading && options.loading == 1){
            $icon = default_loading();
        }else if(options.loading && options.loading == 2){

        }else{
            $icon = default_loading();
        }

        $iconwrap.appendChild($icon);

        var $msgwrap = _dom('div','pmsg-wrap');
        var $pmsgin = _dom('div','pmsg-in',options.msg || '加载中，请稍后 &hellip;&hellip;');
        $msgwrap.appendChild($pmsgin);

        $loading.appendChild($iconwrap);
        $loading.appendChild($msgwrap);
        $out.appendChild($loading);
        $body.appendChild($out);

        // 定位
        _position();

        setTimeout(function () {
            $out.addEventListener('webkitAnimationEnd',_remove);
        },1000);  // 默认800ms后进入动画结束，延迟200ms绑定该事件
    };



    // init初始化入口
    function Plugins() {}

    Plugins.prototype = {
        hasPlugin: function () {
            if(_get('plugins-modal').length>0){
                return true;
            }else{
                return false;
            }
        },
        init: function (options,type) {
            var $body = document.getElementsByTagName('body')[0];

            this.options = _merger({},defaults,options);
            if(this.hasPlugin()){ this.remove(); }

            _get('plugins-modal')[0] && _get('plugins-modal')[0].classList.remove('plugins-hide');
            $body.classList.add('plugins-body');

            if(type == 'box'){
                _createPluginsEle(this.options, this);
            }else if(type == 'msg'){
                _createPluginsMsg(this.options, this);
            }else if(type == 'loading'){
                _createLoading(this.options, this);
            }else{
                this.box({msg: '未知提示方式', showCancel: false, confirm: function () {return true;}});
            }
        },
        box: function (options) {
            this.init(options,'box');
        },
        msg: function (options) {
            this.init(options,'msg');
        },
        loading: function (options) {
            this.init(options,'loading');
        },
        hide: function () {
            if(!this.hasPlugin()){ return;}
            var $body = document.getElementsByTagName('body')[0];
            _get('plugins-modal')[0].classList.add('plugins-hide');
            $body.classList.remove('plugins-body');
        },
        remove: function () {
            _get('plugins-modal')[0].remove();
            var $body = document.getElementsByTagName('body')[0];
            $body.classList.remove('plugins-body');
        },
    };

    win.addEventListener('resize', _position);
    win.addEventListener('orientationchange', _position);

    return Plugins;

})(window, document);