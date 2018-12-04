/*
 * @Author: Cityfox(29151335@qq.com) 
 * @Date: 2018-02-05 14:45:14 
 * @Last Modified by: Cityfox(29151335@qq.com)
 * @Last Modified time: 2018-04-03 15:06:50
 */
//页面权限核实
menucheck();
//头部操作按钮
var Headcontent = '';
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
	a2  : {SID:"name",SZH:"姓名"},	
	a3  : {SID:"optype",SZH:"操作类型"},	
	a4  : {SID:"opstate",SZH:"操作结果"},
	a5  : {SID:"opinfo",SZH:"操作项目"},
	a6  : {SID:"opsql",SZH:"操作语句"},
	a7  : {SID:"creattime",SZH:"操作时间"},
	a8  : {SID:"mode",SZH:"所属项目"},
	
	//重写后
	a99  : {SID:"optype_str",SZH:"操作类型"},
	a98  : {SID:"opstate_str",SZH:"操作结果"},
	//a97  : {SID:"mode_str",SZH:"所属项目"},
	
};	


//查询初始化PERSON
var PERSONOPTYPESELECT=
[
	{STITLE:"全部",SVALUE:""},
	{STITLE:"新增",SVALUE:1},
	{STITLE:"删除",SVALUE:2},
	{STITLE:"更新",SVALUE:3},
	{STITLE:"查询",SVALUE:4},
	{STITLE:"逻辑删除",SVALUE:5},			
];

var PERSONOPSTATESELECT=
[
	{STITLE:"全部",SVALUE:""},
	{STITLE:"失败",SVALUE:0},
	{STITLE:"成功",SVALUE:1},		
];		

//加载数据表格
function onload_list(yhm,name,optype,opstate,opinfo,opsql,creattimes,creattimee,limit) {

	////初始化参数
	if(EmptySimple(limit)){limit=14;}//每页默认显示的数量
	
	layui.use('table', function() {
		var table = layui.table;               
		var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功  
		//请求接口数据
		var total = list_adminczrz(yhm,name,optype,opstate,opinfo,opsql,creattimes,creattimee);

		//数据重写////////////////////////////////
		if (NoEmptySimple(total)) {
			//接口数据重写
			total.forEach(function(Value, index) {
					Value.optype_str = optype_str(Value.optype);
					Value.opstate_str = opstate_str(Value.opstate);
					//Value.mode_str = mode_str(Value.mode); 
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
				//,{field: PERSON.a97.SID , title: '<strong>'+PERSON.a97.SZH+'</strong>' , width: 180, sort: true}
				,{field: PERSON.a1.SID , title: '<strong>'+PERSON.a1.SZH+'</strong>' , width: 180, sort: true}
				,{field: PERSON.a2.SID , title: '<strong>'+PERSON.a2.SZH+'</strong>' , width: 80, sort: true}
				,{field: PERSON.a5.SID , title: '<strong>'+PERSON.a5.SZH+'</strong>' , width: 120, sort: true}
				,{field: PERSON.a99.SID , title: '<strong>'+PERSON.a99.SZH+'</strong>' , width: 100, sort: true} 	       				  
				,{field: PERSON.a98.SID , title: '<strong>'+PERSON.a98.SZH+'</strong>' , width: 100, sort: true}	   
				,{field: PERSON.a6.SID , title: '<strong>'+PERSON.a6.SZH+'</strong>' , width: 700, sort: true}					  
				,{field: PERSON.a7.SID , title: '<strong>'+PERSON.a7.SZH+'</strong>' , width: 200, sort: true}	  	
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

	}); 
	//绑定单列操作按钮//////////////////////////////////

	//绑定头部操作按钮//////////////////////////////////
	var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功  
	var $ = layui.jquery,
		active = {
			SelectData: function() {
					
					var content = "";
					content += '<br><br>';
					content += '  	<form class="layui-form" action="" style="margin:10px;">';

					content += '    <div class="layui-form-item">';
					content += '	    <div class="layui-inline">';
					content += 			LabelSelect(PERSON.a3.SID,PERSON.a3.SZH,"","inline",PERSONOPTYPESELECT);
					content += 			LabelSelect(PERSON.a4.SID,PERSON.a4.SZH,"","inline",PERSONOPSTATESELECT);					        
					content += '	    </div>';
					content += '    </div>';

					content += '    <div class="layui-form-item">';
					content += '	    <div class="layui-inline">';					        
					content += 			LabelText(PERSON.a1.SID,PERSON.a1.SZH,"","inline","","模糊查找");				        
					content += '	    </div>';					        
					content += '    </div>';
					
					content += '    <div class="layui-form-item">';
					content += '	    <div class="layui-inline">';					        
					content += 			LabelText(PERSON.a2.SID,PERSON.a2.SZH,"","inline","","模糊查找");					        
					content += '	    </div>';					        
					content += '    </div>';
					
					
					content += '    <div class="layui-form-item">';
					content += '	    <div class="layui-inline">';					        
					content += 			LabelText(PERSON.a5.SID,PERSON.a5.SZH,"","inline","","模糊查找");				        
					content += '	    </div>';					        
					content += '    </div>';
					
					
					content += '    <div class="layui-form-item">';
					content += '	    <div class="layui-inline">';					        
					content += 			LabelText(PERSON.a6.SID,PERSON.a6.SZH,"","inline","","模糊查找");				        
					content += '	    </div>';					        
					content += '    </div>';					        
					
					content += '    <div class="layui-form-item">';
					content += '	    <div class="layui-inline">';
					content += 			LabelTextDate("creattimes","操作时间（起）"); 
					content += 			LabelTextDate("creattimee","操作时间（止）"); 					        
					content += '	    </div>';
					content += '    </div>';

					// content += '    <div class="layui-form-item">';
					// content += '	    <label class="layui-form-label">快捷选择</label>';
					// content += '	    <div class="layui-input-block">';     
					// content += '			<a class="layui-btn layui-btn-primary layui-btn-xs" onclick="button_datetime(1);">今天</a>';
					// content += '			<a class="layui-btn layui-btn-primary layui-btn-xs" onclick="button_datetime(6);">昨天</a>';
					// content += '			<a class="layui-btn layui-btn-primary layui-btn-xs" onclick="button_datetime(2);">本月</a>';
					// content += '			<a class="layui-btn layui-btn-primary layui-btn-xs" onclick="button_datetime(5);">上月</a>';
					// content += '			<a class="layui-btn layui-btn-primary layui-btn-xs" onclick="button_datetime(3);">今年</a>';
					// content += '			<a class="layui-btn layui-btn-primary layui-btn-xs" onclick="button_datetime(4);">去年</a>';			       		
					// content += '	    </div>';
					// content += '    </div>';

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

					layui.use('laydate', function() {
						var laydate = layui.laydate;
						//时间选择器
						laydate.render({
							elem: '#creattimes',
							type: 'datetime'
						});
						laydate.render({
							elem: '#creattimee',
							type: 'datetime'
						});
					});

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

//表单提交查询函数
function button_select() {
	var optype_sl = s(PERSON.a3.SID).value;
	var opstate_sl = s(PERSON.a4.SID).value;
	var yhm_sl = $("input[name='"+PERSON.a1.SID+"']").val();
	var name_sl = $("input[name='"+PERSON.a2.SID+"']").val();
	var opinfo_sl = $("input[name='"+PERSON.a5.SID+"']").val();
	var opsql_sl = $("input[name='"+PERSON.a6.SID+"']").val();            	
	var creattimes_sl = $("input[id='creattimes']").val();
	var creattimee_sl = $("input[id='creattimee']").val();
	onload_list(yhm_sl,name_sl,optype_sl,opstate_sl,opinfo_sl,opsql_sl,creattimes_sl,creattimee_sl,500);
	
		setTimeout(function() {
			layer.closeAll();
		}, 1000);            
}   
//表单提交查询函数

//关闭按钮
function button_close() {
	layer.closeAll();
}
//关闭按钮

//时间快捷选择
function button_datetime(code) {
	
	//初始化时间
	var mydate = new Date();
	
	var now_FullYear = mydate.getFullYear(); //获取完整的年份(4位,1970-????)
	var now_Month = mydate.getMonth()+1; //获取当前月份(0-11,0代表1月)
	var now_Date = mydate.getDate(); //获取当前日(1-31)
	var now_Hours = mydate.getHours(); //获取当前小时数(0-23)
	var now_Minutes = mydate.getMinutes(); //获取当前分钟数(0-59)
	var now_Seconds = mydate.getSeconds(); //获取当前秒数(0-59)
	//var now_Day =mydate.getDay(); //获取当前星期X(0-6,0代表星期天) 
	
	//去年
	var Ago_FullYear = now_FullYear-1;

	//上月
	var Ago_Month = now_Month-1;
	if(Ago_Month<=0){
		var s_Month=12;
		var s_Year=Ago_FullYear;
	}
	else{
		var s_Month=Ago_Month;
		var s_Year=now_FullYear;        		
	}
	
	//上一天
	var Ago_Date = now_Date-1;
	if(Ago_Date<=0){
		var st_Date=31;
		var Ago_Month = now_Month-1;
		if(Ago_Month<=0){
			var st_Month=12;
			var st_Year=Ago_FullYear;
		}
		else{
			var st_Month=Ago_Month;
			var st_Year=now_FullYear;        		
		}
	}
	else{
		var st_Date=Ago_Date;
		var st_Month=now_Month;
		var st_Year=now_FullYear;        		
	} 
	
	//上七天
//      	now_Month = 1;
//      	now_Date = 4;
//      	var Ago_Date = now_Date-7;
//      	if(Ago_Date<=0){
//      		var s7t_Date=31;
//	        	var Ago_Month = now_Month-1;
//	        	if(Ago_Month<=0){
//	        		var s7t_Month=12;
//	        		var s7t_Year=Ago_FullYear;
//	        	}
//	        	else{
//	        		var s7t_Month=Ago_Month;
//	        		var s7t_Year=now_FullYear;        		
//	        	}
//      	}
//      	else{
//      		var s7t_Date=Ago_Date;
//      		var s7t_Month=now_Month;
//      		var s7t_Year=now_FullYear;        		
//      	}         	
	
	//格式化后时间
	//当前日期时间
//      	var ago7date_AgoDay = dateformat(s7t_Year,s7t_Month,s7t_Date,"0","0","0");//前7天起始

	var agodate_AgoDay = dateformat(st_Year,st_Month,st_Date,"0","0","0");//昨天起始
	var agomonth_AgoDay = dateformat(s_Year,s_Month,"1","0","0","0");//上月起始
	var agoyear_AgoDay = dateformat(Ago_FullYear,"1","1","0","0","0");//去年起始
	var year_AgoDay = dateformat(now_FullYear,"1","1","0","0","0");//今年起始
	var month_AgoDay = dateformat(now_FullYear,now_Month,"0","0","0","0");//当月起始
	var today_AgoDay = dateformat(now_FullYear,now_Month,now_Date,"0","0","0");//今天起始
	var today_FullDay = dateformat(now_FullYear,now_Month,now_Date,now_Hours,now_Minutes,now_Seconds);//当前日期时间
	
	
	
	if(code==1)//今天
	{
	$("#creattimes").val(today_AgoDay);
	$("#creattimee").val(today_FullDay);
	}
	else if(code==2)//本月
	{
	$("#creattimes").val(month_AgoDay);
	$("#creattimee").val(today_FullDay);        		
	}
	else if(code==3)//今年
	{
	$("#creattimes").val(year_AgoDay);
	$("#creattimee").val(today_FullDay);        		
	}
	else if(code==4)//去年
	{
	$("#creattimes").val(agoyear_AgoDay);
	$("#creattimee").val(year_AgoDay);        		
	}
	else if(code==5)//上月
	{
	$("#creattimes").val(agomonth_AgoDay);
	$("#creattimee").val(month_AgoDay);        		
	}
	else if(code==6)//昨天
	{
	$("#creattimes").val(agodate_AgoDay);
	$("#creattimee").val(today_AgoDay);        		
	}  
//      	else if(code==7)//上7天
//      	{
//      	$("#updatetimes").val(ago7date_AgoDay);
//      	$("#updatetimee").val(today_AgoDay);        		
//      	}           	
}
//时间快捷选择