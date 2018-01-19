/**
 * Created by hengfeihu on 2016/3/10.
 */
var commonApp = angular.module("commonApp", []);
/*commonApp.config(["$httpProvider", function ($httpProvider) {
 $httpProvider.interceptors.push("httpInterceptor");
 }]);*/
commonApp.filter('zgjCurrency', ["$filter", function ($filter) {
    return function (amount, currencySymbol) {
        var currency = $filter('currency');
        if (amount < 0) {
            var str = currency(amount, currencySymbol).replace("(", "").replace(")", "");
            return str.substring(0, 1) + str.substring(1, str.length);
        }
        return currency(amount, currencySymbol);
    };
}]);
commonApp.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});
commonApp.filter('unsafe', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
});
commonApp.filter("datefilter", function () {
    return function (ele, format, p1) {
        if (ele != null) {
            if (p1 == "int") {
                return ameutils.convertIntToDate(ele, format);
            } else if (p1 == "time") {
                return ameutils.convertTime(ele, format);
            } else if (p1 == "getTime") {
                return new Date(Date.parse(ameutils.convertIntToDate(ele, format))).getTime();
            } else {
                return "";
            }
        } else {
            return "-/-/-";
        }
    }
});
commonApp.filter("status", function () {
    return function (s) {
        return s == 1 ? "是" : "否";
    }
});
commonApp.filter("empty", function () {
    return function (s) {
        return s == null || s == "" ? "-- " : s;
    }
});
commonApp.filter("percent", function () {
    return function (e) {
        if (e != null && !isNaN(e)) {
            return parseFloat(e * 100).toFixed(4) + " %";
        } else {
            return "- -";
        }
    }
});
commonApp.filter("numfilter", function () {
    return function (ele) {
        if (ele > 1) {
            return parseInt(ele) + "个月";
        } else if (ele > 0 && ele < 1) {
            return parseInt(ele * 30) + "天";
        } else {
            return "";
        }
    }
});
/*commonApp.factory("HttpService", function ($http) {
 var HttpService = {
 ajax: function (params) {
 var url = params.url;
 var data = params.data;
 var type = params.type;
 var _params = params.params;
 var success = params.success;
 var error = params.error;
 if (data != null) {
 data = angular.toJson(data);
 }
 var config = {
 method: type,
 url: url,
 data: data,
 params: _params
 };
 $http(config).success(function (data) {
 if (data.success == false) {
 // TODO:
 if (error) {
 error(data);
 }
 alert(data.msg);
 } else {
 if (success) {
 success(data);
 }
 }
 }).error(function () {
 // TODO:
 if (error) {
 error(data);
 }
 });
 }
 };
 return HttpService;
 });*/
commonApp.factory("DateService", function () {
    var DateService = {
        getData: function (day) {
            var zdate = new Date();
            var sdate = zdate.getTime() - (1 * 24 * 60 * 60 * 1000);
            var edate = new Date(sdate - (day * 24 * 60 * 60 * 1000)).format("yyyy-MM-dd");
            return edate;
        }
    };
    return DateService;
});
commonApp.factory("pagerService", function () {
    var pagerService = {
        getPageCount: function (total, pagesize) {
            var pages;
            if (total % pagesize == 0) {
                pages = total / pagesize;
                pages = pages == 0 ? 1 : pages;
            } else {
                pages = Math.ceil(total / pagesize);
            }
            return pages;
        }
    };
    return pagerService;
});

/**
 * form: 目标表单，btnSubmit:表单中的提交按钮，callback:验证通过后的回调
 */
commonApp.factory("validForm", function () {
    var showValidObj = {
        showValid: function (form, btnSubmit, callback) {
            var valid = {
                form: form || $('form')[0],
                btn: btnSubmit,
                callback: callback || function(){}
            };

            // 检测提示标签是否存在，不存在则生成标签，返回目标对象
            var _isTips = function (objInput) {
                var _tips = $(objInput).siblings('.animate-tips');
                if(_tips.length <= 0){
                    $(objInput).after($('<div class="animate-tips"><span></span></div>'));
                    return $(objInput).siblings('.animate-tips');
                }else{
                    return _tips;
                }
            };

            // 若没有添加btnsubmit参数，则找默认的submit按钮，否则报错
            if(typeof valid.btn == 'function'){
                valid.callback = valid.btn;
                valid.btn = $('button[type=submit]')[0] || $('input[type=submit]')[0];
                if(!valid.btn || valid.btn.length == 0){
                    alert("请设置提交按钮");
                    return;
                }
            }else if(valid.btn == ""){
                valid.btn = $('button[type=submit]')[0] || $('input[type=submit]')[0];
                if(!valid.btn || valid.btn.length == 0){
                    alert("请设置提交按钮");
                    return;
                }
            }

            $(valid.form).Validform({
                tiptype: function (msg,o,cssctl) {
                    //o.type 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态
                    var $tips = _isTips(o.obj);
                    if(o.type == 2){
                        if($tips.hasClass('ns-show')){
                            $tips.removeClass('animate-scale ns-show').addClass('animate-scale ns-hide');
                        }
                    }else if(o.type == 3){
                        $tips.text(msg).removeClass('animate-scale ns-hide').addClass('animate-scale ns-show');
                    }
                },
                btnSubmit: $(valid.btn),
                ignoreHidden: true,
                showAllError: true,
                datatype: {  // 自定义验证规则，也可以是自定义方法，规则根据实际需求在此添加
                    "zh2-4" : /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/,
                    "example": function (val,obj,curform,regxp) {  //自定义方法参数说明 val：输入值，obj：目标表单元素，curform：表单，regxp：全部验证表达式
                        if(!~val.indexOf('陈')){ // 没有输入“陈”
                            return false; // 自定义方法返回false则表示验证不通过
                        }
                    }
                },
                beforeSubmit: function () {
                    typeof valid.callback == 'function' && valid.callback();
                    return false;
                }
            });
        }
    };
    return showValidObj;
});


commonApp.factory("bannerService", function () {
    var bannerService = {
        getBannerData: function (id) {
            var bannerdata=[];
            $.ajax({
                type: "get",
                async:false,
                url: "/elementdetail/findelementdetail?menuid="+parseInt(id),
                contentType: "application/json",
                success: function (data) {
                    if(data != undefined){
                        for(var i=0;i<data.length;i++){
                            if(data[i].pic){
                                bannerdata.push(data[i]);
                            }
                        }
                    }
                }
            });
            return bannerdata;
        }
    };
    return bannerService;
});

commonApp.factory("addcustmarkService", function () {
    var addcustmarkService = {
        addcustmark: function (mwuserid,type,selectid) {
            $.ajax({
                type:'post',
                url:"/mwuser/addcustmark",
                data: JSON.stringify({
                    mwuserid:mwuserid,
                    doctype:type,
                    actionresult:selectid
                }),
                success:function(){
                }
            });
        }
    };
    return addcustmarkService;
});

/*commonApp.factory("httpInterceptor", ["$q", "$rootScope", function ($q, $rootScope) {
 return {
 request: function (config) {
 console.info("正在发送请求...");
 ameutils.showShadow(true);
 // do something on request success
 return config || $q.when(config);
 },
 requestError: function (rejection) {
 console.info("请求失败...");
 // do something on request error
 return $q.reject(rejection)
 },
 response: function (response) {
 console.info("成功发送请求！！！");
 ameutils.showShadow(false);
 // do something on response success
 return response || $q.when(response);
 },
 responseError: function (rejection) {
 console.info("请求失败！！！");
 // do something on response error
 return $q.reject(rejection);
 }
 };
 }]);*/
commonApp.filter("dayfilter", function () {
    return function (data) {
        if (data == 0) {
            return "星期天";
        } else if (data == 1) {
            return "星期一";
        } else if (data == 2) {
            return "星期二";
        } else if (data == 3) {
            return "星期三";
        } else if (data == 4) {
            return "星期四";
        } else if (data == 5) {
            return "星期五";
        } else if (data == 6) {
            return "星期六";
        }
    }
});


commonApp.filter("idtypes", function ($sce) {
    return function (str) {
        if (str==1) {
            str = "身份证";
        }else if(str==2){
            str = "港澳通行证";
        }else if(str==3){
            str = "护照";
        }else if(str==4){
            str = "军官证";
        }
        return str;
    };
});
commonApp.filter("monthfilter", function () {
    return function (data) {
        if (data == 0) {
            return "一月";
        } else if (data == 1) {
            return "二月";
        } else if (data == 2) {
            return "三月";
        } else if (data == 3) {
            return "四月";
        } else if (data == 4) {
            return "五月";
        } else if (data == 5) {
            return "六月";
        } else if (data == 6) {
            return "七月";
        } else if (data == 7) {
            return "八月";
        } else if (data == 8) {
            return "九月";
        } else if (data == 9) {
            return "十月";
        } else if (data == 10) {
            return "十一月";
        } else if (data == 11) {
            return "十二月";
        }
    }
});
commonApp.factory("dealsDate", function () {
    var dealsDate = {
        getData: function (date, day) {
            if (date == null) {
                date = new Date();
            }
            var edate = new Date(date - (day * 24 * 60 * 60 * 1000));
            return edate;
        }
    };
    return dealsDate;
});

commonApp.filter("del_html_tags", function () {
    return function (str) {
        var words = '';
        var re = new RegExp("<img(.*?)>|<a[^>]*>(.*?)<\/a>", "g");
        if (str) {
            var word = str.replace(re, "");
            words = word.replace(/<[^>]+>/g, "");
        }
        return words;
    }
});
commonApp.filter("approvestatus", function () {
    return function (data) {
        if (data == 0) {
            return "无需审批";
        } else if (data == 10) {
            return "待审批";
        } else if (data == 100) {
            return "审批通过";
        } else if (data == 50) {
            return "驳回";
        } else if (data == 150) {
            return "终止";
        }
    }
});

commonApp.filter("dayNum", function () {
    return function (data) {
        if (data) {
            return "共" + (parseInt(data) + 1) + "天";
        } else {
            return "共1天";
        }
        return "";
    }
});

commonApp.filter("moneyToChinese", function () {
    return function (money) {
        if(money){
            return ameutils.moneyToChinese(money);
        }else{
            return "零元";
        }
    }
});
//文字换行
commonApp.filter("contentstyle", function ($sce) {
    return function (content) {
        if (content) {
            var text = content.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
            return $sce.trustAsHtml(text);
        }
        return "";
    };
});
