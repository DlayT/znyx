//获取模板内容，赋值
function GET_HTML_Templet(html, id) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // 兼容 IE7+, Firefox, Chrome, Opera, Safari 
        xmlhttp = new XMLHttpRequest();
    } else if (window.XDomainRequest) {
        var xmlhttp = new XDomainRequest();
    } else { // 兼容IE6, IE5 
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById(id).innerHTML = xmlhttp.responseText;
            // layui  绑定导航事件
            layui.use('element', function() {
                var element = layui.element;
            });
        }
    }
    xmlhttp.open("GET", html, false);
    xmlhttp.send();
}
// 获取URL 参数 
//获取链接中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

// 定义对象  存储 标题 以及其英文和code
var tilObj = {
        1: { title: "学校简介", english: "I N T R O D U C E", code: 94 },
        2: { title: "领导班子", english: "A D M I N I S T R A T I O N", code: 97 },
        3: { title: "校园风采", english: "C U R R I C U L U M  F E A T U R E S", code: 98 },
        4: { title: "荣誉之窗", english: "T E A C H E R", code: 99 },
        5: { title: "学校地图", english: "R E S E A R C H", code: 104 },
        6: { title: "语文组", english: "S P E C I A L C O L U M N", code: 95 },
        7: { title: "数学组", english: "S T U D E N T S", code: 96 },
        8: { title: "综合组", english: "E G R E T Y U S I", code: 120 },
        9: { title: "学校动态", english: "L I S E", code: 100 },
        10: { title: "通知公告", english: "L I S E", code: 101 },
        11: { title: "一周工作", english: "P A R T Y M E M B E R", code: 102 },
        12: { title: "招生招聘", english: "P A R T Y M E M B E R", code: 103 },
        13: { title: "德育之家", english: "P A R T Y M E M B E R", code: 121 },
        14: { title: "教研天地", english: "P A R T Y M E M B E R", code: 122 },
        15: { title: "教务中心", english: "P A R T Y M E M B E R", code: 123 },
        16: { title: "课题研究", english: "P A R T Y M E M B E R", code: 129 },
        17: { title: "学生风采", english: "P A R T Y M E M B E R", code: 124 },
        18: { title: "社团活动", english: "P A R T Y M E M B E R", code: 125 },
        19: { title: "精彩习作", english: "P A R T Y M E M B E R", code: 126 },
        20: { title: "班级展示", english: "P A R T Y M E M B E R", code: 130 },
        21: { title: "班级博客", english: "P A R T Y M E M B E R", code: 127 },
        22: { title: "党建之窗", english: "P A R T Y M E M B E R", code: 128 },

    }

// 获取数据的函数
/**获取数据列表
 *  
 * @param {*} codes   数据类型对应的编码
 * @param {*} page    页码
 * @param {*} pageSize   每页数据的条数
 */
function getDataList(codes, page, pageSize, callback) {
    jQuery.support.cors = true;
    $.ajax({
        url: url() + '/article/articlelist.html',
        contentType: 'text/plain',
        data: {
            code: codes,
            page: page,
            pageSize: pageSize,
            issort: 1
        },
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (typeof data == "string") {
                var data = JSON.parse(data);
            }
            console.log(data);
            // 判断code
            if (data.code == "1") {
                callback(data);
            } else {
                // 数据为空的时候 弹出信息
                alert(data.msg);
            }
        },
        error: function(data) {
            //
        }
    });
}

/**获取到对应的ID   并获取到详情信息
 * 
 * code : 类型对应的编码
 * id :   信息对应的ID 
 */
function getDataXp(codes, ID, callback) {
    jQuery.support.cors = true;
    $.ajax({
        url: url() + '/article/articleInfo.html',
        contentType: 'text/plain',
        data: {
            code: codes,
            id: ID
        },
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (typeof data == "string") {
                var data = JSON.parse(data);
            }
            // //
            callback(data);
        },
        error: function(data) {
            //
        }
    });
}


// 创建新闻部分的li列表
function CreateElement(data, parent) {
    $(parent).html("");
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        var str = "";
        var li = document.createElement('li');
        str += '<a href="./xq.html?key=2&code=' + item.code + '&id=' + item.id + '">';
        str += '<p>' + item.title + '</p>';
        str += '<span>' + item.creattime.substr(0, 10) + '</span></a>';
        li.innerHTML = str;
        $(parent).append(li);
    }
}
// 首页教师风采部分的图文列表
function createPic(data, parent) {
    $(parent).html("");
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        var str = "";
        var li = document.createElement('li');
        // 判断奇偶
        if (i % 2 == 0) {
            str += '<a href="xq.html?key=4&code=' + item.code + '&id=' + item.id + '"><img src="' + img() + item.cover + '" alt="">';
            str += '<p>' + item.title + '</p></a>';
        } else {
            str += '<a href="xq.html?key=4&code=' + item.code + '&id=' + item.id + '"><p>' + item.title + '</p>';
            str += '<img src="' + img() + item.cover + '" alt=""></a>';
        }
        li.innerHTML = str;
        $(parent).append(li);
    }
}