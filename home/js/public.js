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
                //选中当前的菜单
                $('.myNavs>li').eq(0).addClass('layui-this').siblings('li').removeClass('layui-this');
            });

            // 导航的鼠标悬浮效果

            $('#header').find('a').hover(function() {
                $(this).css('marginTop', '-5px');
            }, function() {
                $(this).css('marginTop', '0px');
            });
        }
    }
    xmlhttp.open("GET", html, false);
    xmlhttp.send();

}


// 公共数据获取
//将JSON对象与接口地址 拼接转换为 GET参数模式与JSONP全地址
function JsonToGet(local_url, data) {
    var params = [];
    for (var key in data) {
        params.push(key + '=' + data[key]);
    }

    var postData = params.join('&');
    var url = local_url + '?' + postData;
    return url;
}

//将JSON对象与接口地址 拼接转换为 GET参数模式与JSONP全地址
function appendChild_script(url) {
    // 创建script标签，设置其属性
    var script = document.createElement('script');
    script.setAttribute('src', url);
    // 把script标签加入head，此时调用开始
    document.getElementsByTagName('head')[0].appendChild(script);
}
// 获取URL 参数 
//获取链接中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//本地业务URL
function HOST_url() {
    //返回接口域名地址
    return "http://www.wufangedu.com/";
}