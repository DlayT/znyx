/*
 * @Author: Cityfox(29151335@qq.com) 
 * @Date: 2018-02-05 14:42:52 
 * @Last Modified by: Cityfox(29151335@qq.com)
 * @Last Modified time: 2018-04-04 11:04:43
 */
//页面权限核实
menucheck();
//头部操作按钮
var Headcontent = '';
Headcontent += '<button class="layui-btn BIG" data-type="AddNewData"><i class="layui-icon">&#xe654;</i> 新增</button>';
Headcontent += '<button class="layui-btn" data-type="PageReload"><i class="layui-icon">&#x1002;</i> 刷新</button>';
$('#HeadList').html(Headcontent);
//头部操作按钮

//字段名对应中文
var PERSON = {
    //表格列表字段
    a0: { SID: "id", SZH: "序号" },
    a1: { SID: "type", SZH: "组号" },
    a2: { SID: "group_name", SZH: "组名称" },
    a3: { SID: "service_info", SZH: "服务列表" },
    a4: { SID: "module_info", SZH: "一级菜单列表" },
    a5: { SID: "function_info", SZH: "二级菜单列表" },
    a6: { SID: "status", SZH: "状态" },

    //重写后
    a99: { SID: "status_str", SZH: "状态" },
    a98: { SID: "status_str_s", SZH: "状态" },
    //a97  : {SID:"type_str",SZH:"所在组号"},
};


//查询初始化PERSON
var PERSONSTATUSSELECT = [
    { STITLE: "全部", SVALUE: "" },
    { STITLE: "可用", SVALUE: 1 },
    { STITLE: "不可用", SVALUE: 2 },
];

//加载数据表格
function onload_list(status, yhm, limit) {

    if (EmptySimple(limit)) { limit = 14; } //每页默认显示的数量

    layui.use('table', function() {
        var table = layui.table;
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功  
        //请求接口数据
        var total = list_adminusergroup();

        //数据重写////////////////////////////////
        if (NoEmptySimple(total)) {
            //接口数据重写
            total.forEach(function(Value, index) {
                Value.status_str = sstate_str(Value.status);
                Value.status_str_s = sstate_str_s(Value.status);

            });
        }
        //数据重写////////////////////////////////

        //方法级渲染------绑定表格数据////////////////////////////////
        window.demoTable = table.render({
            skin: 'row' //行边框风格 //表格风格row/line/nob
                ,
            even: true //开启隔行背景
                //,size: 'lg' //小尺寸的表格  	sm,lg
                ,
            page: true //是否显示分页
                ,
            limits: [14, 30, 50, 100, 500] //选择每页显示数
                ,
            limit: limit //每页默认显示的数量
                ,
            loading: true //请求数据时，是否显示loading,需URL请求时生效
                ,
            id: 'DataListId' //ID  
                ,
            elem: '#DataList',
            data: total,
            height: 670,
            cols: [
                [ //标题栏
                    { space: true, fixed: true } //设定空隙列space: true, 是否固定列fixed: false
                    , { checkbox: true, LAY_CHECKED: false, fixed: 'left' } //设定复选框列,复选框默认全部选中
                    , { field: PERSON.a0.SID, title: '<strong>' + PERSON.a0.SZH + '</strong>', width: 80, sort: true, type: 'asc', fixed: 'left' }, { field: PERSON.a1.SID, title: '<strong>' + PERSON.a1.SZH + '</strong>', width: 200, sort: true }, { field: PERSON.a2.SID, title: '<strong>' + PERSON.a2.SZH + '</strong>', width: 300, sort: true }, { field: PERSON.a3.SID, title: '<strong>' + PERSON.a3.SZH + '</strong>', width: 300, sort: true }, { field: PERSON.a4.SID, title: '<strong>' + PERSON.a4.SZH + '</strong>', width: 300, sort: true }, { field: PERSON.a5.SID, title: '<strong>' + PERSON.a5.SZH + '</strong>', width: 500, sort: true }, { field: PERSON.a99.SID, title: '<strong>' + PERSON.a99.SZH + '</strong>', width: 100, sort: true, fixed: 'right' }, { title: '<strong>操作</strong>', minWidth: 250, sort: true, fixed: 'right', toolbar: '#barDemo' }
                ]
            ],
            done: function(res, curr, count) {
                //加载成功后
                TableLoadInfo(res, curr, count);
            }
        });
        //方法级渲染------绑定表格数据////////////////////////////////

    });

}
//加载数据表格

//加载数据表格行内按钮操作
function Btn_defined() {
    //初始化操作按钮，并绑定对应事件	
    layui.use('table', function() {
        var table = layui.table;

        //绑定单列操作按钮//////////////////////////////////	
        table.on('tool(demo)', function(obj) {
            var data = obj.data;

            if (obj.event === 'detail') {
                //查看当前数据

                //查看当前数据

            } else if (obj.event === 'edit') {
                //编辑当前数据

                //编辑当前数据     

            } else if (obj.event === 'editmenu') {
                //编辑菜单当前数据

                var list = data.servicelist;

                var content = "";
                content += '<br><br>';
                content += '  	<form class="layui-form" action="" style="margin:10px;">';

                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-input-block">';
                content += LabelButton("立即更新", "layui-btn-warm", "button_updatemenu();");
                content += LabelButton("关闭窗口", "layui-btn-primary", "button_close();");
                content += '	    </div>';
                content += '    </div>';

                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-inline">';
                content += LabelText(PERSON.a0.SID, PERSON.a0.SZH, eval(StrData(PERSON.a0.SID)), "inline", "disabled");
                content += LabelText(PERSON.a1.SID, PERSON.a1.SZH, eval(StrData(PERSON.a1.SID)), "inline", "disabled");
                content += LabelText(PERSON.a2.SID, PERSON.a2.SZH, eval(StrData(PERSON.a2.SID)), "inline", "disabled");
                content += '	    </div>';
                content += '    </div>';

                for (var ii = 0; ii < list.length; ii++) {
                    content += '    <blockquote id="serviceBl' + list[ii].service_code + '" class="layui-elem-quote" style="background-color:#30343F;">';
                    content += '      <input type="checkbox" name="service" lay-filter="service" value="' + list[ii].service_code + '" lay-skin="primary" title="' + list[ii].service_name + '" ' + checked_str(list[ii].ablestatus) + '>';
                    content += '    </blockquote> ';

                    content += '    <ul id="serviceUl' + list[ii].service_code + '" class="layui-nav layui-nav-tree layui-inline" lay-filter="demo" style="margin-right: 10px; width:100%;">';
                    content += '        <li class="layui-nav-item layui-nav-itemed">';

                    var modulelist = list[ii].modulelist;
                    for (var mm = 0; mm < modulelist.length; mm++) {
                        content += '	        <div  id="moduleDi' + modulelist[mm].module_code + '">';
                        content += '	        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="module" lay-filter="module" value="' + modulelist[mm].module_code + '" lay-skin="primary" title="' + modulelist[mm].module_name + '" ' + checked_str(modulelist[mm].ablestatus) + '></a>';
                        content += '            <dl id="module' + modulelist[mm].module_code + '" class="layui-nav-child">';

                        var functionlist = modulelist[mm].functionlist;
                        for (var ff = 0; ff < functionlist.length; ff++) {
                            content += '	            <dd><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="function" lay-filter="function" value="' + functionlist[ff].function_code + '" lay-skin="primary" title="' + functionlist[ff].function_name + '" ' + checked_str(functionlist[ff].ablestatus) + '></a></dd>';
                        }

                        content += '	        </dl>';
                        content += '	        </div>';
                    }
                    content += '	    </li>';
                    content += '    </ul>';

                    content += '    <br><br><br>';
                }


                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-input-block">';
                content += LabelButton("立即更新", "layui-btn-warm", "button_updatemenu();");
                content += LabelButton("关闭窗口", "layui-btn-primary", "button_close();");
                content += '	    </div>';
                content += '    </div>';

                content += '  	</form>';

                //弹出查看框
                layer.open({
                    type: 1,
                    title: '编辑用户组权限',
                    area: ['1000px', '700px'],
                    //offset: ['50px', '200px'],
                    content: content //这里content是一个普通的String
                });

                //点击服务复选框
                form.on('checkbox(service)', function(data) {
   
                    if (data.elem.checked) {
                        //将后代全部选中
                        $("#serviceUl" + data.value).find("input[name='module']").prop('checked', true);
                        $("#serviceUl" + data.value).find("input[name='function']").prop('checked', true);
                    } else {
                        //将后代全部取消
                        $("#serviceUl" + data.value).find("input[name='module']").prop('checked', false);
                        $("#serviceUl" + data.value).find("input[name='function']").prop('checked', false);
                    }
                    form.render();

                });

                //点击主菜单复选框
                form.on('checkbox(module)', function(data) {


                    //上一级CODE
                    var serviceCode = data.value.substr(0, 1);
                   
                    if (data.elem.checked) {
                        //将后代全部选中
                        $("#module" + data.value).find("input[name='function']").prop('checked', true);
                        //将祖先全部选中
                        $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', true);
                    } else {
                        //将后代全部取消
                        $("#module" + data.value).find("input[name='function']").prop('checked', false);

                        //查找同级元素选中状态
                        var len = $("#serviceUl" + serviceCode).find("input[name='module']:checked").length;
                        if (len == 0) {
                            //将祖先全部取消
                            $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', false);
                        }

                    }
                    form.render();

                });

                //点击主菜单复选框
                form.on('checkbox(function)', function(data) {



                    //上一级CODE
                    var serviceCode = data.value.substr(0, 1);
                    var moduleCode = data.value.substr(0, 2);

                    if (data.elem.checked) {
                        //将祖先全部选中
                        $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', true);
                        $("#moduleDi" + moduleCode).find("input[name='module']").prop('checked', true);
                    } else {
                        //查找同级元素选中状态
                        var mlen = $("#module" + moduleCode).find("input[name='function']:checked").length;
                        if (mlen == 0) {
                            //将祖先全部取消
                            $("#moduleDi" + moduleCode).find("input[name='module']").prop('checked', false);

                            //查找上级元素选中状态
                            var slen = $("#serviceUl" + serviceCode).find("input[name='module']:checked").length;
                            if (slen == 0) {
                                //将祖先全部取消
                                $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', false);
                            }
                        }
                    }
                    form.render();

                });

                //编辑菜单当前数据     
                form.render();
            } else if (obj.event === 'del') {

                //删除当前数据	 

                //删除当前数据	

            } else if (obj.event === 'change') {
                //改变当前状态
                //按钮【按钮一】的回调
                change_sysusergroup(eval(StrData(PERSON.a0.SID))); //0假删，1真删

                //无刷新删除DOM结构暂未解决
                //checkStatus.del(); //删除对应行（tr）的DOM结构，并更新缓存
                setTimeout(function() {
                    layer.closeAll();
                    window.location.reload();
                }, 1000);
                //改变当前状态
            }


        });
        //绑定单列操作按钮//////////////////////////////////

        //绑定头部操作按钮//////////////////////////////////
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功  
        var $ = layui.jquery,
            active = {
                //新增数据
                AddNewData: function() {
                    var total = list_admintreemenu();
                    var list = total.servicelist;

                    var content = "";
                    content += '<br><br>';
                    content += '  	<form class="layui-form" action="" style="margin:10px;">';

                    content += '    <div class="layui-form-item">';
                    content += '	    <div class="layui-input-block">';
                    content += LabelButton("立即新增", "layui-btn-warm", "button_add();");
                    content += LabelButton("关闭窗口", "layui-btn-primary", "button_close();");
                    content += '	    </div>';
                    content += '    </div>';

                    content += '    <div id="inputvipday" class="layui-form-item">';
                    content += '	    <div class="layui-inline">';
                    content += LabelText(PERSON.a1.SID, PERSON.a1.SZH, "", "inline", "");
                    content += LabelText(PERSON.a2.SID, PERSON.a2.SZH, "", "inline", "");
                    content += '	    </div>';
                    content += '    </div>';

                    for (var ii = 0; ii < list.length; ii++) {

                        content += '    <blockquote id="serviceBl' + list[ii].service_code + '" class="layui-elem-quote" style="background-color:#30343F;">';
                        content += '      <input type="checkbox" name="service" lay-filter="service" value="' + list[ii].service_code + '" lay-skin="primary" title="' + list[ii].service_name + '">';
                        content += '    </blockquote> ';

                        content += '    <ul id="serviceUl' + list[ii].service_code + '" class="layui-nav layui-nav-tree layui-inline" lay-filter="demo" style="margin-right: 10px; width:100%;">';
                        content += '        <li class="layui-nav-item layui-nav-itemed">';

                        var modulelist = list[ii].modulelist;

                        if (modulelist != undefined) {

                            for (var mm = 0; mm < modulelist.length; mm++) {
                                content += '	        <div  id="moduleDi' + modulelist[mm].module_code + '">';
                                content += '	        <a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="module" lay-filter="module" value="' + modulelist[mm].module_code + '" lay-skin="primary" title="' + modulelist[mm].module_name + '"></a>';
                                content += '            <dl id="module' + modulelist[mm].module_code + '" class="layui-nav-child">';

                                var functionlist = modulelist[mm].functionlist;

                                if (functionlist != undefined) {

                                    for (var ff = 0; ff < functionlist.length; ff++) {
                                        content += '	            <dd><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="function" lay-filter="function" value="' + functionlist[ff].function_code + '" lay-skin="primary" title="' + functionlist[ff].function_name + '"></a></dd>';
                                    }

                                }

                                content += '	        </dl>';
                                content += '	        </div>';
                            }

                        }

                        content += '	    </li>';
                        content += '    </ul>';

                        content += '    <br><br><br>';
                    }

                    content += '    <div class="layui-form-item">';
                    content += '	    <div class="layui-input-block">';
                    content += LabelButton("立即新增", "layui-btn-warm", "button_add();");
                    content += LabelButton("关闭窗口", "layui-btn-primary", "button_close();");
                    content += '	    </div>';
                    content += '    </div>';

                    content += '  	</form>';
                    //弹出查看框
                    layer.open({
                        type: 1,
                        title: '新增内容',
                        area: ['1000px', '700px'],
                        //offset: ['10px', '100px'],
                        content: content //这里content是一个普通的String
                    });

                    //点击服务复选框
                    form.on('checkbox(service)', function(data) {
    
                        if (data.elem.checked) {
                            //将后代全部选中
                            $("#serviceUl" + data.value).find("input[name='module']").prop('checked', true);
                            $("#serviceUl" + data.value).find("input[name='function']").prop('checked', true);
                        } else {
                            //将后代全部取消
                            $("#serviceUl" + data.value).find("input[name='module']").prop('checked', false);
                            $("#serviceUl" + data.value).find("input[name='function']").prop('checked', false);
                        }
                        form.render();

                    });

                    //点击主菜单复选框
                    form.on('checkbox(module)', function(data) {


                        //上一级CODE
                        var serviceCode = data.value.substr(0, 1);
                        
                        if (data.elem.checked) {
                            //将后代全部选中
                            $("#module" + data.value).find("input[name='function']").prop('checked', true);
                            //将祖先全部选中
                            $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', true);
                        } else {
                            //将后代全部取消
                            $("#module" + data.value).find("input[name='function']").prop('checked', false);

                            //查找同级元素选中状态
                            var len = $("#serviceUl" + serviceCode).find("input[name='module']:checked").length;
                            if (len == 0) {
                                //将祖先全部取消
                                $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', false);
                            }

                        }
                        form.render();

                    });

                    //点击主菜单复选框
                    form.on('checkbox(function)', function(data) {



                        //上一级CODE
                        var serviceCode = data.value.substr(0, 1);
                        var moduleCode = data.value.substr(0, 2);

                        if (data.elem.checked) {
                            //将祖先全部选中
                            $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', true);
                            $("#moduleDi" + moduleCode).find("input[name='module']").prop('checked', true);
                        } else {
                            //查找同级元素选中状态
                            var mlen = $("#module" + moduleCode).find("input[name='function']:checked").length;
                            if (mlen == 0) {
                                //将祖先全部取消
                                $("#moduleDi" + moduleCode).find("input[name='module']").prop('checked', false);

                                //查找上级元素选中状态
                                var slen = $("#serviceUl" + serviceCode).find("input[name='module']:checked").length;
                                if (slen == 0) {
                                    //将祖先全部取消
                                    $("#serviceBl" + serviceCode).find("input[name='service']").prop('checked', false);
                                }
                            }
                        }
                        form.render();

                    });

                    form.render();
                },
                SelectData: function() {


                    }
                    //刷新
                    ,
                PageReload: function() {
                    window.location.reload()
                }
            };
        //绑定头部操作按钮//////////////////////////////////

        //监听工具栏对应操作
        $('.layui-btn').on('click', function(obj) {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });

    });
}
//加载数据表格行内按钮操作

//表单提交新增函数
function button_add() {
    //初始化参数
    var type_sl = $("input[name='" + PERSON.a1.SID + "']").val();
    var groupname_sl = $("input[name='" + PERSON.a2.SID + "']").val();
    //表单验证模块
    try {
        if (type_sl == "") throw "组号不能为空";
        if (groupname_sl == "") throw "组名称不能为空";
    } catch (err) {
        layer.msg(err);
        return false;
    }


    var service_sl = "";
    var iii = 0
    $('input[name="service"]:checked').each(function() {
        iii++;
        service_sl += $(this).val() + ",";
    });

    var len_s = service_sl.length;
    service_sl = service_sl.substr(0, len_s - 1);

    //表单验证模块
    try {
        if (len_s == 0) throw "请至少选择一个系统";
    } catch (err) {
        layer.msg(err);
        return false;
    }



    var module_sl = "";
    var iii = 0
    $('input[name="module"]:checked').each(function() {
        iii++;
        module_sl += $(this).val() + ",";
    });

    var lenm_s = module_sl.length;
    module_sl = module_sl.substr(0, lenm_s - 1);

    //表单验证模块
    try {
        if (lenm_s == 0) throw "请至少选择一个主菜单";
    } catch (err) {
        layer.msg(err);
        return false;
    }



    var function_sl = "";
    var iii = 0
    $('input[name="function"]:checked').each(function() {
        iii++;
        function_sl += $(this).val() + ",";
    });

    var lenf_s = function_sl.length;
    function_sl = function_sl.substr(0, lenf_s - 1);

    //表单验证模块
    try {
        if (lenf_s == 0) throw "请至少选择一个子菜单";
    } catch (err) {
        layer.msg(err);
        return false;
    }


    //调用更新菜单接口
    var res = add_groupmenu(type_sl, groupname_sl, service_sl, module_sl, function_sl);
    if (res == true) {
        layer.msg('操作成功');
        setTimeout(function() {
            layer.closeAll();
            window.location.reload();
        }, 1000);
    } else {
        layer.msg(res);
    }

}
//表单提交新增函数

//表单提交查询函数
function button_select() {

}
//表单提交查询函数

//表单提交更新函数
function button_update() {
    //初始化参数

}
//表单提交更新函数

//关闭按钮
function button_close() {
    layer.closeAll();
}
//关闭按钮

//菜单提交更新函数
function button_updatemenu() {
    var id_sl = $("input[name='" + PERSON.a0.SID + "']").val();


    var service_sl = "";
    var iii = 0
    $('input[name="service"]:checked').each(function() {
        iii++;
        service_sl += $(this).val() + ",";
    });

    var len_s = service_sl.length;
    service_sl = service_sl.substr(0, len_s - 1);

    //表单验证模块
    try {
        if (len_s == 0) throw "请至少选择一个系统";
    } catch (err) {
        layer.msg(err);
        return false;
    }



    var module_sl = "";
    var iii = 0
    $('input[name="module"]:checked').each(function() {
        iii++;
        module_sl += $(this).val() + ",";
    });

    var lenm_s = module_sl.length;
    module_sl = module_sl.substr(0, lenm_s - 1);

    //表单验证模块
    try {
        if (lenm_s == 0) throw "请至少选择一个主菜单";
    } catch (err) {
        layer.msg(err);
        return false;
    }



    var function_sl = "";
    var iii = 0
    $('input[name="function"]:checked').each(function() {
        iii++;
        function_sl += $(this).val() + ",";
    });

    var lenf_s = function_sl.length;
    function_sl = function_sl.substr(0, lenf_s - 1);

    //表单验证模块
    try {
        if (lenf_s == 0) throw "请至少选择一个子菜单";
    } catch (err) {
        layer.msg(err);
        return false;
    }


    //调用更新菜单接口
    var res = edit_groupmenu(id_sl, service_sl, module_sl, function_sl);
    if (res == true) {
        layer.msg('操作成功');
        setTimeout(function() {
            layer.closeAll();
            window.location.reload();
        }, 1000);
    } else {
        layer.msg(res);
    }

}
//菜单提交更新函数