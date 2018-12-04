/*
 * @Author: Cityfox(29151335@qq.com) 
 * @Date: 2018-02-05 14:05:19 
 * @Last Modified by: Cityfox(29151335@qq.com)
 * @Last Modified time: 2018-04-04 10:40:25
 */
//初始化对应模块信息
var PERSON = [
    //项目默认模块
    { SCLASS: "XGMM", SNAME: "修改密码", SURL: "iframe-list_xgmm.html" },
    //项目业务模块   
];
//初始化对应模块信息		

var urls = menucheck();

//根据级别，显示对应大系统模块
var modulemenulist = modulemenulist(urls);

var content = "";
content += '<ul class="layui-nav layui-nav-tree">';
var functionmenulist = "";
for (var ii = 0; ii < modulemenulist.length; ii++) {
    if (ii == 0) { var fold = " layui-nav-itemed"; } else { var fold = ""; }
    content += '<li class="layui-nav-item ' + fold + '">';
    content += '<a href="###">' + modulemenulist[ii].module_name + '</a>';
    //子菜单
    functionmenulist = modulemenulist[ii].data
    if (functionmenulist.length != 0) {
        content += '<dl class="layui-nav-child">';
        for (var yy = 0; yy < functionmenulist.length; yy++) {
            //将子菜单加入初始化--绑定事件
            PERSON.push({ SCLASS: functionmenulist[yy].class, SNAME: functionmenulist[yy].function_name, SURL: functionmenulist[yy].function_url });

            if (functionmenulist[yy].status == 1) {
                content += '<dd><a class="' + functionmenulist[yy].class + '" data-type="tabAdd"  href="javascript:;"><i class="layui-icon">' + functionmenulist[yy].icon + '</i> ' + functionmenulist[yy].function_name + '</a></dd>';
            } else {
                content += '<dd><a class="" data-type="tabAdd"  href="javascript:;"><i class="layui-icon">' + functionmenulist[yy].icon + '</i><span style="color:#6F7991;">' + functionmenulist[yy].function_name + sysmod_str(functionmenulist[yy].status) + '</span></a></dd>';
            }

        }
        content += '</dl> ';
    }
    content += '</li>';
}
content += '</ul>';
$("#module_mune").html(content);

layui.use('element', function() {
    var $ = layui.jquery,
        element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

    //绑定相关点击事件
    $('.site-demo-active').on('click', function() {
        var othis = $(this),
            type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });
    //系统首页TAB，隐藏X功能
    $("#HOME_NAV").find("i").eq(1).css("display", "none");
    //显示当前年份
    $("#DateYear").html(DateYear());
    //显示版本
    $("#NowVer").html(NowVer());

    //删除sessionstorage
    $("#login_exit").on("click", function() {
        deleteItem("session_access_token");
        deleteItem("session_json_str");
    });
    //绑定返回首页事件
    $("#back_home").on("click", function() { window.location.href = "home.html"; });
    //赋值登录用户名称
    $("#username").html(get_session("JSXM") + "（" + get_session("YHM") + "）");
    //赋值登录用户头像
    $("#usernametx").html(yhtx_str(get_session("YHTX")));
    //触发事件
    var active = {
        tabAdd: function(id, title, content) {

            //遍历Tab中是否已经打开子Tab
            var li_len = $('.layui-tab-title').children('li').length;
            var y = 0; //接收包含个数
            for (var i = 0; i < li_len; i++) {
                var layid = $(".layui-tab-title li").eq(i).attr("lay-id");
                if (layid == id) {
                    y++;
                }
            }
            //遍历Tab中是否已经打开子Tab

            if (y > 0) {
                //切换到指定Tab项
                element.tabChange('docDemoTabBrief', id); //切换到：用户管理							
            } else {
                //新增一个Tab项
                element.tabAdd('docDemoTabBrief', {
                        title: '<i class="layui-icon">&#xe62a;</i> ' + title //
                            ,
                        content: content,
                        id: id //实际使用一般是规定好的id，这里以时间戳模拟下
                    })
                    //切换到指定Tab项
                element.tabChange('docDemoTabBrief', id); //切换到：用户管理					
            }

        }
    };

    //循环绑定点击事件
    for (var iii = 0; iii < PERSON.length; iii++) {
        (function(iii) { //为阻止iii过早释放，采用闭包函数封存iii，等到点击时释放
            //创建对应的模块
            $('.' + PERSON[iii].SCLASS).on('click', function() {
                active.tabAdd(PERSON[iii].SCLASS, PERSON[iii].SNAME, iframe_str(PERSON[iii].SURL));
            });

        })(iii)
    }
    //循环绑定点击事件

});