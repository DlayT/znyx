/*
 * @Author: ZhouChao(Cityfox) 
 * @Date: 2018-02-05 09:35:41 
 * @Last Modified by: Cityfox(29151335@qq.com)
 * @Last Modified time: 2018-04-04 10:56:53
 */
//本JS只定义纯代码，不接受与任何业务、项目相关的定义

// js获取id
function s(a) {
    return document.getElementById(a);
}

// 获取当前年份
function DateYear() {
    var myDate = new Date();
    return myDate.getFullYear();
}

//生成n位随机数
function random(n) {
    //初始化参数
    var rnd = "";
    for (var i = 0; i < n; i++) {
        rnd += Math.floor(Math.random() * 10);
    }
    return rnd;
}

//判断是否为空
function EmptySimple(mixed_var) {
    if (mixed_var === "" || mixed_var === null || typeof mixed_var === 'undefined') {
        return true;
    } else {
        return false;
    }

}

//判断是否不为空
function NoEmptySimple(mixed_var) {
    if (mixed_var != "" && mixed_var != null && typeof mixed_var != 'undefined') {
        return true;
    } else {
        return false;
    }

}

//判断是否为空(全)
function emptyObject(mixed_var) {
    var keyval;
    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
        return true;
    }
    if (typeof mixed_var == 'object') {
        for (keyval in mixed_var) {
            return false;
        }
        return true;
    }
    return false;
}

// 获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// jsID显示隐藏
function IdDisplay(id, style) {
    document.getElementById(id).style.display = style;
}

// jsID绑定超链接
function IdUrl(id, url) {
    document.getElementById(id).href = url;
}

//根据数据是否为JSON对象，做出相应转换
function isobject(data) {
    if (typeof(data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object object]" && !data.length) {
        return data;
    } else {
        return JSON.parse(data);
    }

}


// 页面权限核实
function menucheck() {
    var test = window.location.pathname;
    strs = test.split("/"); //字符分割 
    var LocPage = strs[strs.length - 1];
    return LocPage;
    // var code = MenuChk(LocPage)
    // //
    // if (code != "success") {
    //     top.location.href = "error.html";
    // }
}


//拼接字符串
function StrData(obj) { 
    return 'data.' + obj;
}