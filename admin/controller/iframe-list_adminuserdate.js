/*
 * @Author: Cityfox(29151335@qq.com) 
 * @Date: 2018-02-05 14:42:52 
 * @Last Modified by: Cityfox(29151335@qq.com)
 * @Last Modified time: 2018-04-03 17:46:57
 */
//页面权限核实
menucheck();
//头部操作按钮
var Headcontent = '';
Headcontent += '<button class="layui-btn BIG" data-type="AddNewData"><i class="layui-icon">&#xe654;</i> 新增</button>';
Headcontent += '<button class="layui-btn" data-type="SelectData"><i class="layui-icon">&#xe615;</i> 查询</button>';
Headcontent += '<button class="layui-btn" data-type="PageReload"><i class="layui-icon">&#x1002;</i> 刷新</button>';
$('#HeadList').html(Headcontent);
//头部操作按钮
		
//字段名对应中文
var PERSON=
{
    //表格列表字段
    a0  : {SID:"id",SZH:"序号"},
    a1  : {SID:"yhm",SZH:"用户名"},	
    a2  : {SID:"starttime",SZH:"开始时间"},
    a3  : {SID:"endtime",SZH:"结束时间"},	
    a4  : {SID:"status",SZH:"状态"},
    a5  : {SID:"intro",SZH:"账户描述"},	
    a6  : {SID:"type",SZH:"所在组号"},
    a7  : {SID:"group_name",SZH:"所在组名称"},
    
    //重写后
    a99  : {SID:"status_str",SZH:"状态"},  
    a98  : {SID:"status_str_s",SZH:"状态"},  
    //a97  : {SID:"type_str",SZH:"所在组号"},
};	


//查询初始化PERSON
var PERSONSTATUSSELECT=
[
    {STITLE:"全部",SVALUE:""},
    {STITLE:"可用",SVALUE:1},
    {STITLE:"不可用",SVALUE:2},
];

//初始化用户组列表
var groupsimple = list_adminusergroupsimple();
var PERSONTYPESELECT= [];
for(var iii=0;iii<groupsimple.length;iii++)
{
    PERSONTYPESELECT.push({STITLE:groupsimple[iii].group_name,SVALUE:groupsimple[iii].type});
}


//加载数据表格
function onload_list(status,yhm,limit) {
    if(EmptySimple(status)){status="99";}
    
    if(EmptySimple(limit)){limit=14;}//每页默认显示的数量

    layui.use('table', function() {
        var table = layui.table;               
        var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功  
        //请求接口数据
        var total = list_adminuserdate(status,yhm);
        
        //数据重写////////////////////////////////
        if (NoEmptySimple(total)) {
            //接口数据重写
            total.forEach(function(Value, index) {
                Value.status_str = sstate_str(Value.status);
                Value.status_str_s = sstate_str_s(Value.status);
                //Value.type_str = type_str(Value.type);
            });
        }
        //数据重写////////////////////////////////

        //方法级渲染------绑定表格数据////////////////////////////////
        window.demoTable = table.render({
               skin: 'row' //行边框风格 //表格风格row/line/nob
              ,even: true //开启隔行背景
              //,size: 'lg' //小尺寸的表格  	sm,lg
            ,page: true //是否显示分页
            ,limits: [14, 30, 50, 100, 500]//选择每页显示数
            ,limit: limit //每页默认显示的数量
            ,loading: true //请求数据时，是否显示loading,需URL请求时生效
            ,id: 'DataListId' //ID  
              ,elem: '#DataList'
            ,data: total
            ,height: 670
            ,cols: [[ //标题栏
              {space: true, fixed: true}//设定空隙列space: true, 是否固定列fixed: false
              ,{checkbox: true, LAY_CHECKED: false, fixed:'left'}//设定复选框列,复选框默认全部选中
              ,{field: PERSON.a0.SID , title: '<strong>'+PERSON.a0.SZH+'</strong>' , width: 80, sort: true, type:'asc', fixed:'left'}
              ,{field: PERSON.a1.SID , title: '<strong>'+PERSON.a1.SZH+'</strong>' , width: 150, sort: true}
              ,{field: PERSON.a6.SID , title: '<strong>'+PERSON.a6.SZH+'</strong>' , width: 100, sort: true} 
              ,{field: PERSON.a7.SID , title: '<strong>'+PERSON.a7.SZH+'</strong>' , width: 200, sort: true} 
              ,{field: PERSON.a2.SID , title: '<strong>'+PERSON.a2.SZH+'</strong>' , width: 200, sort: true}
              ,{field: PERSON.a3.SID , title: '<strong>'+PERSON.a3.SZH+'</strong>' , width: 200, sort: true} 
              ,{field: PERSON.a5.SID , title: '<strong>'+PERSON.a5.SZH+'</strong>' , width: 500, sort: true} 	       				  
              ,{field: PERSON.a99.SID , title: '<strong>'+PERSON.a99.SZH+'</strong>' , width: 100, sort: true, fixed:'right'}					  
              ,{title: '<strong>操作</strong>' , minWidth: 250, sort: true,fixed: 'right',toolbar: '#barDemo'}              	  	
            ]]  
        ,done: function(res, curr, count){
            //加载成功后
            TableLoadInfo(res,curr,count);
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
    table.on('tool(demo)', function(obj){
        var data = obj.data;
        
        if(obj.event === 'detail'){
            //查看当前数据

            var content = "";
            content += '<br><br>';
            content += '  	<form class="layui-form" action="" style="margin:10px;">';
    
            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += 				LabelText(PERSON.a0.SID,PERSON.a0.SZH,eval(StrData(PERSON.a0.SID)),"inline","disabled");
            content += 				LabelText(PERSON.a1.SID,PERSON.a1.SZH,eval(StrData(PERSON.a1.SID)),"inline","disabled");	
            content += 				LabelText(PERSON.a98.SID,PERSON.a98.SZH,eval(StrData(PERSON.a98.SID)),"inline","disabled");
            content += '	    </div>';
            content += '    </div>';			        		

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += 				LabelText(PERSON.a2.SID,PERSON.a2.SZH,eval(StrData(PERSON.a2.SID)),"inline","disabled");
            content += 				LabelText(PERSON.a3.SID,PERSON.a3.SZH,eval(StrData(PERSON.a3.SID)),"inline","disabled");
            content += 				LabelText(PERSON.a5.SID,PERSON.a5.SZH,eval(StrData(PERSON.a5.SID)),"inline","disabled");	
            content += '	    </div>';
            content += '    </div>';					

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += 				LabelText(PERSON.a7.SID,PERSON.a7.SZH,eval(StrData(PERSON.a7.SID)),"inline","disabled");	
            content += '	    </div>';
            content += '    </div>';

            content += '  	</form>';
    
            //弹出查看框
            layer.open({
                type: 1,
                title: '查看内容',
                area: ['1000px', '700px'],
                //offset: ['50px', '200px'],
                content: content //这里content是一个普通的String
            });
            //查看当前数据
    
        } 
        else if(obj.event === 'edit')
        {
            //编辑当前数据

            var content = "";
            content += '<br><br>';
            content += '  	<form class="layui-form" action="" style="margin:10px;">';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += 			LabelButton("立即更新","layui-btn-warm","button_update();");
            content += 			LabelButton("关闭窗口","layui-btn-primary","button_close();");			       		
            content += '	    </div>';
            content += '    </div>';	            

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += 				LabelText(PERSON.a0.SID,PERSON.a0.SZH,eval(StrData(PERSON.a0.SID)),"inline","disabled");
            content += 				LabelText(PERSON.a1.SID,PERSON.a1.SZH,eval(StrData(PERSON.a1.SID)),"inline","disabled");	
            content += 				LabelText(PERSON.a98.SID,PERSON.a98.SZH,eval(StrData(PERSON.a98.SID)),"inline","disabled");
            content += '	    </div>';
            content += '    </div>';	

            content += '    <div id="" class="layui-form-item">';
            content += '	    <div class="layui-inline">';						
            content += 			LabelSelect(PERSON.a6.SID,PERSON.a6.SZH,eval(StrData(PERSON.a6.SID)),"inline",PERSONTYPESELECT);
            content += '	    </div>';       
            content += '    </div>';
                        
            
            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += 			LabelTextDate(PERSON.a2.SID,PERSON.a2.SZH); 				        
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += 			LabelTextDate(PERSON.a3.SID,PERSON.a3.SZH); 					        
            content += '	    </div>';
            content += '    </div>'; 

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-block">';
            content += 			LabelText(PERSON.a5.SID,PERSON.a5.SZH,eval(StrData(PERSON.a5.SID)),"block","");						        
            content += '	    </div>';
            content += '    </div>'; 

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += 			LabelButton("立即更新","layui-btn-warm","button_update();");
            content += 			LabelButton("关闭窗口","layui-btn-primary","button_close();");			       		
            content += '	    </div>';
            content += '    </div>';	
            
            content += '  	</form>';
    
            //弹出查看框
            layer.open({
                type: 1,
                title: '编辑内容',
                area: ['1000px', '700px'],
                //offset: ['50px', '200px'],
                content: content //这里content是一个普通的String
            });
            form.render();
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //时间选择器
                laydate.render({
                    elem: '#'+PERSON.a2.SID,
                    type: 'datetime',
                    value: eval(StrData(PERSON.a2.SID)) //必须遵循format参数设定的格式
                });
                laydate.render({
                    elem: '#'+PERSON.a3.SID,
                    type: 'datetime',
                    value: eval(StrData(PERSON.a3.SID)) //必须遵循format参数设定的格式
                });
            });            
            //编辑当前数据     

        }else if(obj.event === 'del'){
    
            //删除当前数据	 
            var content = '';	 
            content += '<span style="color:#f00;">确定要删除？</span>';
            content += ' <br>';
            content += PERSON.a0.SZH +'：' + eval(StrData(PERSON.a0.SID));
            content += '<br>';
            content += PERSON.a1.SZH +'：' + eval(StrData(PERSON.a1.SID));           
            layer.confirm(content, {
                btn: ['确定删除', '暂不删除'] //可以无限个按钮		  	  
            }, function(index, layero) {
                //按钮【按钮一】的回调
                del_sysuserdate(eval(StrData(PERSON.a0.SID)));//0假删，1真删
        
                //无刷新删除DOM结构暂未解决
                //checkStatus.del(); //删除对应行（tr）的DOM结构，并更新缓存
                setTimeout(function() {
                    layer.closeAll();
                    window.location.reload();
                }, 1000);
                
            }, function(index) {
                //按钮【按钮二】的回调	
                layer.msg('您已取消了相关操作');
            });
            //删除当前数据	

        }else if(obj.event === 'change'){
            //改变当前状态
            //按钮【按钮一】的回调
            change_sysuserdate(eval(StrData(PERSON.a0.SID)));//0假删，1真删
    
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
                var content = "";
                content += '<br><br>';
                content += '  	<form class="layui-form" action="" style="margin:10px;">';

                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-input-block">';
                content += 			LabelButton("立即新增","layui-btn-warm","button_add();");
                content += 			LabelButton("关闭窗口","layui-btn-primary","button_close();");			       		
                content += '	    </div>';
                content += '    </div>';	

                content += '    <div id="inputvipday" class="layui-form-item">';
                content += '	    <div class="layui-inline">';							
                content += 			LabelText(PERSON.a1.SID,PERSON.a1.SZH,"","inline","");	
                content += '	    </div>';       
                content += '    </div>';					        					        

                content += '    <div id="" class="layui-form-item">';
                content += '	    <div class="layui-inline">';						
                content += 			LabelSelect(PERSON.a6.SID,PERSON.a6.SZH,"","inline",PERSONTYPESELECT);
                content += '	    </div>';       
                content += '    </div>';	

                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-inline">';
                content += 			LabelTextDate(PERSON.a2.SID,PERSON.a2.SZH); 				        
                content += '	    </div>';
                content += '    </div>';

                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-inline">';
                content += 			LabelTextDate(PERSON.a3.SID,PERSON.a3.SZH); 					        
                content += '	    </div>';
                content += '    </div>';                

                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-block">';
                content += 			LabelText(PERSON.a5.SID,PERSON.a5.SZH,"","block","");						        
                content += '	    </div>';
                content += '    </div>'; 
                                
                content += '    <div class="layui-form-item">';
                content += '	    <div class="layui-input-block">';
                   content += 			LabelButton("立即新增","layui-btn-warm","button_add();");
                   content += 			LabelButton("关闭窗口","layui-btn-primary","button_close();");			       		
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

                form.render();
                layui.use('laydate', function() {
                    var laydate = layui.laydate;
                    //时间选择器
                    laydate.render({
                        elem: '#'+PERSON.a2.SID,
                        type: 'datetime'
                    });
                    laydate.render({
                        elem: '#'+PERSON.a3.SID,
                        type: 'datetime',
                        //value: new Date() //必须遵循format参数设定的格式
                    });
                });
                                
            }            
            ,
            SelectData: function() {
                    
                    var content = "";
                    content += '<br><br>';
                    content += '  	<form class="layui-form" action="" style="margin:10px;">';

                    content += '    <div class="layui-form-item">';
                    content += '	    <div class="layui-inline">';
                    content += 			LabelSelect(PERSON.a4.SID,PERSON.a4.SZH,"","inline",PERSONSTATUSSELECT);
                    content += '	    </div>';
                    content += '    </div>';

                    content += '    <div class="layui-form-item">';
                    content += '	    <div class="layui-inline">';					        
                    content += 			LabelText(PERSON.a1.SID,PERSON.a1.SZH,"","inline","","模糊查找");				        
                    content += '	    </div>';					        
                    content += '    </div>';

                    content += '    <div class="layui-form-item">';
                    content += '	    <div class="layui-input-block">';
                    content += 			LabelButton("立即查询","layui-btn-warm","button_select();");
                    content += 			LabelButton("关闭窗口","layui-btn-primary","button_close();");			       		
                    content += '	    </div>';
                    content += '    </div>';

                    content += '  	</form>';
                    //弹出查看框
                    layer.open({
                        type: 1,
                        title: '查询内容',
                        area: ['1000px', '700px'],
                        //offset: ['10px', '100px'],
                        content: content //这里content是一个普通的String
                    });

                    form.render();

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
    
	var yhm_sl = $("input[name='"+PERSON.a1.SID+"']").val();            	
	var starttime_sl = $("input[id='starttime']").val();
    var endtime_sl = $("input[id='endtime']").val();
    var intro_sl = $("input[name='"+PERSON.a5.SID+"']").val();
    var type_sl = s(PERSON.a6.SID).value;

    //表单验证模块
    try {
    
        if (type_sl == "") throw "管理级别不能为空";
        if (yhm_sl == "") throw "用户名不能为空";
        if (yhm_sl.length > 12) throw "用户名长度超长";
        if (yhm_sl.length < 11) throw "用户名长度过短";
        if (starttime_sl == "") throw "开始时间不能为空";
        if (endtime_sl == "") throw "结束时间不能为空";
        if (starttime_sl > endtime_sl) throw "开始时间不能晚于结束时间";							

    } catch (err) {
        layer.msg(err);
        return false;
    }


    //调用新增接口
    var res = add_sysuserdate(yhm_sl,type_sl,starttime_sl,endtime_sl,intro_sl);
    
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
    var status_sl = s(PERSON.a4.SID).value;
    var yhm_sl = $("input[name='"+PERSON.a1.SID+"']").val();

    onload_list(status_sl,yhm_sl,500);
    
        setTimeout(function() {
            layer.closeAll();
        }, 1000);            
}   
//表单提交查询函数

//表单提交更新函数
function button_update() {
    //初始化参数
    
    var id_sl = $("input[name='"+PERSON.a0.SID+"']").val();   
    var type_sl = s(PERSON.a6.SID).value;        	
	var starttime_sl = $("input[id='starttime']").val();
	var endtime_sl = $("input[id='endtime']").val();
    var intro_sl = $("input[name='"+PERSON.a5.SID+"']").val();
    
    //表单验证模块
    try {
    
        if (id_sl == "") throw "序号不能为空";
        if (type_sl == "") throw "序号不能为空";
        if (starttime_sl == "") throw "开始时间不能为空";
        if (endtime_sl == "") throw "结束时间不能为空";
        if (starttime_sl > endtime_sl) throw "开始时间不能晚于结束时间";							

    } catch (err) {
        layer.msg(err);
        return false;
    }


    //调用新增接口
    var res = edit_sysuserdate(id_sl,type_sl,starttime_sl,endtime_sl,intro_sl);
   
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
//表单提交更新函数

//关闭按钮
function button_close() {
    layer.closeAll();
}
//关闭按钮

