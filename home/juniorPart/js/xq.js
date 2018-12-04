layui.use(['element', 'carousel', 'laypage'], function() {
    var element = layui.element;
    var carousel = layui.carousel;

    // 根据地中中的key值 来判断标题和code
    var key = getQueryString("key");
    $(".myNav").find("li").eq(key - 0).addClass('layui-this');
    // $(".tils").find('h3').html(tilObj[key].title);
    // $(".tils").find('p').html(tilObj[key].english);
    var code = tilObj[key].code;
    if (key != 1) {
        var id = getQueryString('id');
        var code = getQueryString('code');
        // 获取详情
        getDataXp(code, id, function(data) {
            var result = data.data.list[0];
            //点击量
            ActiveSum(id);
            $(".tils").find('h3').html(result.title);
            $(".txt-content").html(result.content);
           // 作者
           $(".person").html("作者：" + result.author);
           // 时间
           $(".times").html("时间：" + result.creattime.substr(0, 10));
           // 点击量
           $('.clickSum').html('点击量：' + (result.accesstol + 1));
        })

    } else {
        $(".myNav").find("li").eq(key - 0).addClass('layui-this');
        $(".tils").find('h3').html(tilObj[key].title);
        $(".tils").find('p').html(tilObj[key].english);
        var code = tilObj[key].code;
        // 获取 列表以及详情
        getDataList(code, 1, 1, function(data) {
     
            var result = data.data.list[0];
            $(".txt-content").html(result.content);
            $('.dis-msg').hide();
        });
    }

});