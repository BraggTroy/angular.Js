/**
 * Created by Administrator on 2015/4/24.
 */
var widget = new Object();
widget.maximumSelectionSize = 0;
widget.broker = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/broker",
        dataType: 'json',
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option pinyin="' + data[i].pinyin + '" value="' + data[i].objid + '">' + data[i].name + "</option>";
            }
            $("#" + select2_id).append(html).select2();
        }
    });
    return true;
};
widget.user = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: widget.maximumSelectionSize,
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/user',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    autNumber: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var order = $(element).val().split(",");
            var id = order.join(";");
            if (id !== "") {
                $.ajax("/user/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.empname;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id);
            return obj.empname;
        }
    });
    return true;
};

widget.user2 = function (select2_id, flag) {
    $.ajax({
        method: "GET",
        url: "/widget/userlist",
        async: false,
        dataType: 'json',
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option alt="' + data[i].pinyin + '" value="' + data[i].id + '">' + data[i].name + '</option>';
            }
            if (select2_id.indexOf(".") != -1) {
                $(select2_id).append(html).select2({
                    matcher: function (term, text, opt) {
                        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0
                            || opt.attr("alt").toUpperCase().indexOf(term.toUpperCase()) >= 0;
                    },
                    allowClear: true//是否允许用户清除文本信息
                });
            } else {
                $("#" + select2_id).append(html).select2({
                    matcher: function (term, text, opt) {
                        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0
                            || opt.attr("alt").toUpperCase().indexOf(term.toUpperCase()) >= 0;
                    },
                    allowClear: true//是否允许用户清除文本信息
                });
            }
        }
    });
    return true;
};

//银行
widget.bank = function (select2_id, flag) {
    $.ajax({
        type: "GET",
        url: '/widget/findbank',	//地址
        async: false,
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option alt="' + data[i].bankcode + '" value="' + data[i].id + '">' + data[i].bankname + '</option>';
            }
            $(select2_id).append(html).select2({
                matcher: function (term, text, opt) {
                    return text.toUpperCase().indexOf(term.toUpperCase()) >= 0
                        || opt.attr("alt").toUpperCase().indexOf(term.toUpperCase()) >= 0;
                },
                placeholder: '请选择',
                allowClear: true//是否允许用户清除文本信息
            });
        }
    });
    return true;
};
//任务管理添加项目成员
widget.addmember = function (select2_id, flag, projectid) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: widget.maximumSelectionSize,
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/addmember',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term, 	//联动查询的字符
                    projectid: projectid//项目id
                }
            },
            results: function (data) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
        },
        formatResult: function (obj) {
            return obj.empname;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id + '|' + obj.empname);
            return obj.empname;
        }
    });
    return true;
};
//产品基金
widget.picturefund = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: widget.maximumSelectionSize,
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/findproducts',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term	//联动查询的字符
                }
            },
            results: function (data) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var order = $(element).val().split(",");
            var id = order.join(";");
            if (id !== "") {
                $.ajax("/product/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.proName + "-" + obj.proCode;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id);
            return obj.proName;
        }
    });
    return true;
};
//获取自己管理的产品基金
widget.myProducts = function (select2_id, flag) {
    $(select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: widget.maximumSelectionSize,
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/findmyproducts',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term	//联动查询的字符
                }
            },
            results: function (data) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var order = $(element).val().split(",");
            var id = order.join(";");
            if (id !== "") {
                $.ajax("/product/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.proName + "-" + obj.proCode;
        },
        formatSelection: function (obj) {
            $(select2_id).val(obj.id);
            return obj.proName;
        }
    });
    return true;
};
//参考指标
widget.productrefs = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: widget.maximumSelectionSize,
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/references/referenceslist',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term	//联动查询的字符
                }
            },
            results: function (data) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var order = $(element).val().split(",");
            var id = order.join(";");
            if (id !== "") {
                $.ajax("/references/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.sname + "-" + obj.scode;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id);
            return obj.sname;
        }
    });
    return true;
};

widget.role = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/role',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term) {		//在查询时向服务器端传输的数据
                if(term) {
                    term = $.trim(term);
                    return {
                        roleName: term, 	//联动查询的字符
                        status: 1 	//状态
                    }
                }
            },
            results: function (data) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var order = $(element).val().split(",");
            var id = order.join(";");
            if (id !== "") {
                $.ajax("/role/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.roleName;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id);
            return obj.roleName;
        }
    });
    return true;
};

widget.customer = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/customer',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型

            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    custName: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var id = $(element).val().replace(",", ";");
            if (id !== "") {
                $.ajax("/customer/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            //if (obj.custType) {
            //    if (obj.custType == 1) {
            //        return obj.custName + "-机构";
            //    }
            //    if (obj.custType == 2) {
            //        return obj.custName + "-个人";
            //    }
            //} else {
            //    return obj.custName + "-联系人";
            //}
            return obj.custName;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id);
            return obj.custName;
        }
    });
    return true;
};

widget.project = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/findproject",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].id + '">' + data[i].projectName + "</option>";
            }
            $("#" + select2_id).append(html).select2({
                placeholder: ' ',
                allowClear: true//是否允许用户清除文本信息
            });
        }
    });
    return true;
};
widget.industry = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/industry",
        async: false,
        dataType: 'json',
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option alt="' + data[i].pinyin + '" value="' + data[i].industrycode + '">' + data[i].industryname + '</option>';
            }
            $("#" + select2_id).append(html).select2({
                matcher: function (term, text, opt) {
                    return text.toUpperCase().indexOf(term.toUpperCase()) >= 0
                        || opt.attr("alt").toUpperCase().indexOf(term.toUpperCase()) >= 0;
                },
                placeholder: '请选择行业 ',
                allowClear: true//是否允许用户清除文本信息
            });
        }
    });
    return true;
};
widget.industry2 = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 0,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: 1,
        allowClear: true,	//是否允许用户清除文本信息
        id: function (rs) {
            return rs.industrycode;
        },
        ajax: {
            url: '/widget/industry2',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var id = $(element).val();
            if (id !== "") {
                $.ajax("/widget/industry/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.industryname;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.industrycode);
            return obj.industryname;
        }
    });
    return true;
};
widget.stock = function (select2_id, flag) {
    if (!flag) flag = false;
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: widget.yy == 1 ? " " : "",
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/stock',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    stockinput: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var id = $(element).val();
            if (id !== "") {
                $.ajax("/widget/findsecuritybyid?querycode=" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.sname + "(" + obj.scode + ")";
        },
        formatSelection: function (obj) {
            $("#" + select2_id + "_hiddenname").remove();
            $("#" + select2_id).after("<input type='hidden' id='" + select2_id + "_hiddenname' value='" + obj.sname + "' />");
            return obj.sname + "(" + obj.scode + ")";
        }
    });
    return true;
};

widget.stockSelect = function (select2_id) {
    $("#" + select2_id).select2({
        multiple: false,
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: false,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/stock',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    stockinput: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var id = $(element).val();
            if (id !== "") {
                $.ajax("/widget/findsecuritybyid?querycode=" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.sname + "(" + obj.scode + ")";
        },
        formatSelection: function (obj) {
            $("#" + select2_id + "_hiddenname").remove();
            $("#" + select2_id).after("<input type='hidden' id='" + select2_id + "_hiddenname' value='" + obj.sname + "' />");
            return obj.sname + "(" + obj.scode + ")";
        }
    });
    return true;
};

widget.stockrank = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/stockrank",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].propertyValue + '">' + data[i].propertyDesc + "</option>";
            }
            $("#" + select2_id).append(html).select2({});
        }
    });
    return true;
};
//专户类型
widget.relatype = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/enumrelatype",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            html += '<option value="0">请选择</option>';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].propertyValue + '">' + data[i].propertyDesc + "</option>";
            }
            $("#" + select2_id).append(html).select2({});
        }
    });
    return true;
};
//估值频率
widget.calperiod = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/enumcalperiod",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            html += '<option value="0">请选择</option>';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].propertyValue + '">' + data[i].propertyDesc + "</option>";
            }
            $("#" + select2_id).append(html).select2({});
        }
    });
    return true;
};
//募集币种
widget.currency = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/enumcurrency",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            html += '<option value="0">请选择</option>';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].propertyValue + '">' + data[i].propertyDesc + "</option>";
            }
            $("#" + select2_id).append(html).select2({});
        }
    });
    return true;
};
//产品类型
widget.investtype = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/enuminvesttype",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].propertyValue + '">' + data[i].propertyDesc + "</option>";
            }
            $("#" + select2_id).append(html).select2({
                placeholder: "请选择",
                allowClear: true
            });
        }
    });
    return true;
};
//管理类型
widget.managetype = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/enummanagetype",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            html += '<option value="0">请选择</option>';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].propertyValue + '">' + data[i].propertyDesc + "</option>";
            }
            $("#" + select2_id).append(html).select2({});
        }
    });
    return true;
};
//有查看权限的
widget.investpool = function (select2_id) {
    $("#" + select2_id).select2({
        close: true,
        placeholder: ' ',
        multiple: false,
        minimumInputLength: 1,
        allowClear: true,
        ajax: {
            url: '/poolinfo/findbyname',
            delay: 250,
            dataType: 'json',
            data: function (term, pageNo) {
                term = $.trim(term);
                return {
                    pname: term,
                    pageSize: 1,
                    pageNo: pageNo,
                    time: new Date()
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var id = $(element).val();
            if (id !== "") {
                $.ajax("/poolinfo/pooldata?poolid=" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.name;
        },
        formatSelection: function (obj) {
            return obj.name;
        }
    });
    return true;
};
//所有的池
widget.investpool2 = function (select2_id) {
    $("#" + select2_id).select2({
        close: true,
        multiple: false,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/poolinfo/findbyname2',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    pname: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
        },
        formatResult: function (obj) {
            return obj.name;
        },
        formatSelection: function (obj) {
            return obj.name;
        }
    });
    return true;
};

widget.stockOruser = function (select2_id) {
    $("#" + select2_id).select2({
        multiple: false,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/stockoruser',	//地址
            delay: 250,
            async: false,
            dataType: 'json',	//接收的数据类型

            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    querycode: term 	//联动查询的字符
                }
            },
            results: function (data) {
                var results = [];
                $.each(data, function (index, item) {
                    var grouptext = "";
                    if (index == 0) {
                        grouptext = "股票";
                    }
                    if (index == 1) {
                        grouptext = "建议人";
                    }
                    results.push({
                        text: grouptext,
                        children: item
                    });
                });
                return {
                    results: results
                };
            }
        },
        initSelection: function (element, callback) {
            var querytype = $("#querytype").val();
            var querycode = $(element).val();
            if (querycode !== "") {
                if (querytype == "user") {
                    $.ajax("/user/" + querycode, {
                        dataType: "json"
                    }).done(function (data) {
                        callback({
                            text: data.empname,
                            id: data.id,
                            pinyin: data.pinyin
                        });
                    });
                }
                else {
                    $.ajax("/widget/findsecuritybyid?querycode=" + querycode, {
                        dataType: "json"
                    }).done(function (data) {
                        callback({
                            text: data.sname,
                            id: data.scode + "-" + data.mktcode + "-" + data.stype,
                            pinyin: data.pinyin
                        });
                    });
                }
            }
        }
    });
    return true;
};

widget.stockOrpool = function (select2_id) {
    $("#" + select2_id).select2({
        multiple: true,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/poolinfo/stockorpool',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型

            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    querycode: term 	//联动查询的字符
                }
            },
            results: function (data) {
                var results = [];
                $.each(data, function (index, item) {
                    var grouptext = "";
                    if (index == 0) {
                        grouptext = "投资池";
                    }
                    if (index == 1) {
                        grouptext = "证券";
                    }
                    results.push({
                        text: grouptext,
                        children: item
                    });
                });
                return {
                    results: results
                };
            }
        },
        initSelection: function (element, callback) {
        }
    });
    return true;
};
//验证剩余可输入字符个数
widget.checkInputContent = function (selector, maxLength) {
    var el = $(selector);
    var dl = el.next();
    var currentCount = dl.find('small');
    if (dl.attr("class") == undefined) {
        el.bind('validate', function (e) {
            var text = el.val();
            // 46 - delete ascii码 8 - backspace ascii码
            if (e.which != 8 && e.which != 46) {
                if (text.length > maxLength) {
                    el.val(text.substring(0, maxLength));
                    return false;
                }
            }
            currentCount.text("余" + (maxLength - text.length) + "字");
        });
        el.keyup(function (e) {
            el.trigger('validate');
        });
    }
    el.trigger('validate');
};

widget.pflreferences = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/pfl/pflrefer",
        dataType: 'json',
        success: function (data) {
            var html = "";
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                html += '<option alt="' + list[i].stkname + '(' + list[i].stkcode + ')' + '" value="' + list[i].stkcode + '">' + list[i].stkname + '</option>';
            }
            $("#" + select2_id).append(html).select2({
                allowClear: true,
                matcher: function (term, text, opt) {
                    return text.toUpperCase().indexOf(term.toUpperCase()) >= 0
                        || opt.attr("alt").toUpperCase().indexOf(term.toUpperCase()) >= 0;
                }
            });
        }
    });
    return true;
};

widget.industryOruser = function (select2_id) {
    $("#" + select2_id).select2({
        multiple: false,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/industryoruser',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    querycode: term 	//联动查询的字符
                }
            },
            results: function (data) {
                var results = [];
                $.each(data, function (index, item) {
                    var grouptext = "";
                    if (index == 0) {
                        grouptext = "行业";
                    }
                    if (index == 1) {
                        grouptext = "建议人";
                    }
                    results.push({
                        text: grouptext,
                        children: item
                    });
                });
                return {
                    results: results
                };
            }
        },
        initSelection: function (element, callback) {
            var querytype = $("#querytype").val();
            var querycode = $(element).val();
            if (querycode !== "") {
                if (querytype == "user") {
                    $.ajax("/user/" + querycode, {
                        dataType: "json"
                    }).done(function (data) {
                        callback({
                            text: data.empname,
                            id: data.id,
                            pinyin: data.pinyin
                        });
                    });
                } else {
                    $.ajax("/widget/findindustrypartition?querycode=" + querycode, {
                        dataType: "json"
                    }).done(function (data) {
                        callback({
                            text: data.industryname,
                            id: data.industrycode,
                            pinyin: data.pinyin
                        });
                    });

                }
            }
        }
    });
    return true;
};

widget.orgSeletor = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/orgObject/orgSelector",
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].objId + '">';
                for (var j = 0; j < data[i].level; j++) {
                    html += "&nbsp;";
                }
                html += data[i].objName + "</option>";
            }
            $("#" + select2_id).append(html).select2({});
        }
    });
    return true;
};
//查找产品
widget.products = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/findproduct",
        dataType: 'json',
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].id + '">' + data[i].proName + '</option>';
            }
            $("#" + select2_id).append(html).select2({
                placeholder: '请选择产品 ',
                allowClear: true//是否允许用户清除文本信息
            });
        }
    });
    return true;
};

// 包含 A股 和 基金
widget.securitys = function (select2_id, flag) {
    if (!flag) flag = false;
    $(select2_id).select2({
        multiple: flag,
        placeholder: widget.yy == 1 ? " " : "",
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/securitys',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    stockinput: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var id = $(element).val();
            if (id !== "") {
                $.ajax("/widget/findsecuritybyid?querycode=" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.sname + "(" + obj.scode + ")";
        },
        formatSelection: function (obj) {
            $(select2_id + "_hiddenname").remove();
            $(select2_id).after("<input type='hidden' id='" + select2_id.substr(1, select2_id.length) + "_hiddenname' value='" + obj.sname + "' />");
            return obj.sname + "(" + obj.scode + ")";
        }
    });
    return true;
};
widget.subjects = function (select2_id) {
    $.ajax({
        method: "GET",
        url: "/widget/findsubjects",
        dataType: 'json',
        success: function (data) {
            var html = "";
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].subjectcode + '">' + data[i].subjectname + '</option>';
            }
            $("#" + select2_id).append(html).select2({
                placeholder: '请选择',
                allowClear: true,
                'width': '210px',
                minimumResultsForSearch: -1
            });
        }
    });
    return true;
};

//查找
widget.outgoing = function (select2_id, empid) {
    console.info(empid);
    if (empid) {
        $.ajax({
            method: "GET",
            url: "/widget/getoutgoing?empid=" + empid,
            dataType: 'json',
            success: function (data) {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].id + '">' + data[i].title + '</option>';
                }
                $("#" + select2_id).append(html).select2({
                    placeholder: ' ',
                    allowClear: true//是否允许用户清除文本信息
                });
            }
        });
    }
    return true;
};
//人才库搜索人员
widget.talent = function (select2_id, flag) {
    $("#" + select2_id).select2({
        multiple: flag,
        placeholder: ' ',
        minimumInputLength: 1,	//至少输入n个字符，才去加载数据
        maximumSelectionSize: widget.maximumSelectionSize,
        allowClear: true,	//是否允许用户清除文本信息
        ajax: {
            url: '/widget/findtalent',	//地址
            delay: 250,
            dataType: 'json',	//接收的数据类型
            data: function (term, pageNo) {		//在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term, 	//联动查询的字符
                    pageSize: 1,	//一次性加载的数据条数
                    pageNo: pageNo,	//页码
                    time: new Date()//测试
                }
            },
            results: function (data, pageNo) {
                return {results: data};
            }
        },
        initSelection: function (element, callback) {
            var order = $(element).val().split(",");
            var id = order.join(";");
            if (id !== "") {
                $.ajax("/talentinfo/" + id, {
                    dataType: "json"
                }).done(function (data) {
                    callback(data);
                });
            }
        },
        formatResult: function (obj) {
            return obj.name;
        },
        formatSelection: function (obj) {
            $("#" + select2_id).val(obj.id);
            return obj.name;
        }
    });
    return true;
};
