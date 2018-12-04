layui.use(['element', 'carousel', 'laypage'], function() {
    var element = layui.element;
    var carousel = layui.carousel;
    var laypage = layui.laypage;
    // var laytpl=layui.laytpl;

    // 根据地中中的key 值  来判断标题和code
    var key = getQueryString("key");
    $(".myNav").find("li").eq(key - 0).addClass('layui-this');
    $(".tils").find('h3').html(tilObj[key].title);
    $(".tils").find('p').html(tilObj[key].english);
    var code = tilObj[key].code;
    //
    // 数据请求
    getDataList(code, 1, 12, function(data) {
        var result = data.data;
        console.log(result);
        //
        CreateElements(result, $('.new-list').find('ul')[0], key);
        // 首先定义变量接受模板中的结构
        // var getTpl = newList.innerHTML
        // ,view = $('#new-list').find('ul');
        // laytpl(getTpl).render(result, function(html){
        //   view.html(html);
        // });
        // 鼠标悬浮的样式
        Css();
        // 分页
        page(data);
    });

    // 分页
    function page(data) {
        var data = data.data;
        //
        laypage.render({
            elem: 'page1',
            count: data.recordCount,
            limit: 12,
            layout: ['page'],
            jump: function(obj, first) {
                // if(!first){
                    // 数据请求
                    getDataList(code, obj.curr, obj.limit, function(data) {
                        var result = data.data.list;
                        // //
                        CreateElements(result, $('.new-list').find('ul')[0], key);
                        // 鼠标悬浮的样式
                        Css();
                    });
                // }
               
            }
        });

    }

    // 鼠标悬浮样式
    // 追加样式 
    function Css() {
        // 数据的鼠标悬浮效果
        $('.new-list li').hover(function() {
            $(this).find("a").css('color', 'red');
            $(this).find('.lines').css('borderColor', 'red');
            $(this).find('i').css('borderLeftColor', 'red');
        }, function() {
            $(this).find("a").css('color', '#000');
            $(this).find('.lines').css('borderColor', '#000');
            $(this).find('i').css('borderLeftColor', '#000');
        });
    }

    function CreateElements(data, parent, key) {
        $(parent).html("");
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var str = "";
            var li = document.createElement('li');
            str += '<i></i>';
            str += '<div class="lines"></div>';
            str += '<a href="./xq.html?key=' + key + '&code=' + item.code + '&id=' + item.id + '" target="_blank">';
            str += '<p>' + item.title + '</p>';
            str += '<span>' + item.creattime.substr(0, 10) + '</span></a>';
            li.innerHTML = str;
            $(parent).append(li);
        }
    }
});