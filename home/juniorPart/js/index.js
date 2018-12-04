layui.use(['element', 'carousel', 'laypage'], function() {
    var element = layui.element;
    var carousel = layui.carousel;
    var laypage = layui.laypage;
    // 导航
    var key = getQueryString("key");
    $(".myNav").find("li").eq(key - 0).addClass('layui-this');

    // });
    //建造实例
    carousel.render({
        elem: '#test1',
        width: '100%', //设置容器宽度
        height: '420px',
        arrow: 'none', //始终显示箭头
        autoplay: false,
        indicator: 'none'
    });

    // 学校动态 和 通知公告
    // 学校动态
    getDataList(100, 1, 8, function(data) {
        var result = data.data.list;
        // // 先清空父容器
        CreateElement(result, $('.part-new').find('ul')[0], 1);
    });
    // 通知公告
    getDataList(101, 1, 8, function(data) {
        var result = data.data.list;
        // // 先清空父容器
        CreateElement(result, $('.grade-new').find('ul')[0], 1);

    });

    // 首页学校风采
    getDataList(98, 1, 3, function(data) {
        var result = data.data.list;
        var one = result[0];
        var str = "";
        var a = document.createElement('a');
        a.setAttribute('href', 'xq.html?key=6&code=' + one.code + '&id=' + one.id);
        str += '<h2 class="hs">' + one.title + '</h2>';
        str += '<p class="dis">' + one.description.substr(0, 150) + '...</p>';
        a.innerHTML = str;
        $(".new-box").append(a);
        // 追加封面
        $('.img-box').find('img').attr('src',img()+one.cover);

        // 第二条 和第三条信息
        $(".first").attr('href', 'xq.html?key=6&code=' + result[1].code + '&id=' + result[1].id).find('p').html(result[1].title);
        $(".secend").attr('href', 'xq.html?key=6&code=' + result[2].code + '&id=' + result[2].id).find('p').html(result[2].title);


    });

    // 首页的教师风采   95，96，120
    getDataList('95,96,120', 1, 4, function(data) {
        var result = data.data.list;
        createPic(result, $('.teacher-list').find('ul')[0]);
        $(".teacher-list").find('li').eq(3).css("margin-right", 0);
    });



    // 学生风采 124
    getDataList(124, 1, 3, function(data) {
        var result = data.data.list;
        createLi(result, $('.student-table').find('ul')[0]);
    });

    // 学子风貌    创建列表
    function createLi(data, parent) {
        $(parent).html("");
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var li = document.createElement('li');
            var str = "";
            if (i % 2 == 0) {
                str += '<a href="xq.html?key=7&code=' + item.code + '&id=' + item.id + '"><i></i>';
                str += '<div class="line-box clearfix">';
                str += '<div class="img-box">';
                str += '<img src="' + img() + item.cover + '" alt="">';
                str += '</div>';
                str += '<div class="txt-box">';
                str += '<h3>' + item.title + '</h3>';
                str += '<p>' + item.description + '</p>';
                str += '</div>';
                str += '</div></a>';
            } else {
                str += '<a href="xq.html?key=7&code=' + item.code + '&id=' + item.id + '"><i></i>';
                str += '<div class="line-box clearfix">';
                str += '<div class="img-box-r">';
                str += '<img src="' + img() + item.cover + '" alt="">';
                str += '</div>';
                str += '<div class="txt-box-l">';
                str += '<h3>' + item.title + '</h3>';
                str += '<p style="text-align:right;"> ' + item.description + '</p>';
                str += '</div>';
                str += '</div></a>';
            }
            li.innerHTML = str;
            $(parent).append(li);
        }
    }
});