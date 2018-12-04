// 侧边栏部分的 出现的效果
$(".aside").on("mouseover", function() {
    $(".tips").hide();
    $(".u-part").show();
});
$(".aside").on("mouseout", function() {
    $(".tips").show();
    $(".u-part").hide();
});

// 给每个学部一个鼠标移入的事件
$(".u-part li").on("mouseover", function() {
    $(this).find("a").css({ backgroundColor: "#CA4241", color: "#fff" });
});
$(".u-part li").on("mouseout", function() {
    $(this).find("a").css({ backgroundColor: "#D2D3CE", color: "#000" });
});

//  轮播图部分  切换  初始化轮播图
// 初始化轮播图
var mySwiper = new Swiper('.swiper-containers', {
    pagination: '.pagination',
    autoplay: 5000,
    loop: true,
    grabCursor: true,
    paginationClickable: true
});

// tab 切换部分 颜色的变化
// 初始化swiper
var tabsSwiper = new Swiper('.swiper-container', {
    onlyExternal: true,
});
// tab 切换状态
$(".tabs a").on('touchstart mousedown', function(e) {
    e.preventDefault();
    $(".tabs .active").removeClass('active');
    $(this).addClass('active');
    // 当前的显示蓝色   兄弟元素显示红色
    $(this).find(".f").addClass("flag").removeClass("flags");
    $(this).siblings().find(".f").removeClass("flag").addClass("flags");
    tabsSwiper.swipeTo($(this).index());
});
// 阻止a 的默认事件
$(".tabs a").click(function(e) {
    e.preventDefault()
});



//利用JSONP  来获取到数据  兼容到IE 7/8/9  
// 通知公告   新闻通知
NewList_info(2, '', 1, 'NewList_info_callback');
// 学校新闻  教育新闻
NewList_info(1, '教育新闻', 1, 'NewList_info_callback2');

function NewList_info(zylb, zyfl, pages, callback) {
    var local_url = 'http://www.wufangedu.com/public_php_json/jiaoyuziyuan/JsonP_getJiaoYuZiYuan_Tsh.php';
    var data = {
        jsoncallback: callback,
        ZYLB: zylb, //资源类别
        ZYFL: zyfl, //资源分类
        FBFW: 2, // 发布范围
        FBID: "430111020007",
        SFFB: 1, // 是否发布
        pagesize: 3,
        page: pages
    };
    //提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
    var url = JsonToGet(local_url, data); //将接口与参数拼接成JsonP请求模式
    //创建JS引用文件
    appendChild_script(url);
}

//回调函数---返回数据处理
// 通知公告 数据
function NewList_info_callback(data) {

    //返回数据处理
    var datas = data.data.list;
    var str = ""
    for (var i = 0, max = datas.length; i < max; i++) {
        var item = datas[i];
        str += '<li> <img src="images/yuandian.png"> <a href="./xq.html?id=' + item.ID + '&fbid=' + item.FBID + '" target="_blank">' + item.ZYMC + ' <span>' + item.FBSJ.substr(0, 10) + '</span> </a></li>';
    }
    // 将结构放入容器
    $('.notice').html(str);
    // 学校通知  文字效果
    $(".notice li").hover(function() {
        $(this).find("a").css("color", "#178EB9");
    }, function() {
        $(this).find("a").css("color", "#000");
    });

}
// 学校新闻
function NewList_info_callback2(data) {
    //
    //返回数据处理
    var datas = data.data.list;
    var str = "";
    for (var i = 0, max = datas.length; i < max; i++) {
        var item = datas[i];
        str += '<li class="clearfix">';
        str += '<div class="times fl">';
        str += '<span class="days">' + item.FBSJ.substr(8, 2) + '</span>';
        str += '<span class="mouths">' + item.FBSJ.substr(0, 7) + '</span></div>';
        str += '<p class="fl"><a href="./xq.html?id=' + item.ID + '&fbid=' + item.FBID + '" target="_blank">' + item.ZYMC + '</a></p>';
        str += '</li>';
    }
    $('.schollNews').html(str);
    // 新闻公告部分  文字  鼠标进入的 效果
    $(".schollNews li").hover(function() {
        $(this).find("a").css("color", "#178EB9");
    }, function() {
        $(this).find("a").css("color", "#000");
    });
}

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