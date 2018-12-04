/**
 * author by ztong
 * time 2018.06.25
 */
// 扩展一个 公共的模块  publicModule

layui.define(['form','jquery','table'],function(exports){
    var form=layui.form;
    var $=layui.jquery;
    var table=layui.table;

    // 参数配置参数
    var config={
        title: '' // 弹窗标题
        ,code:'code'  // 页面对应的code 编码
        ,area: ['500px','500px'] // 弹窗大小
        ,tableLoadFunc:''
    };

    // 定义弹框 对象 
    var page={
        init:function(option){
            config=option;
            // 初始化加载数据
            page.dataLoad({},config.tableLoadFunc);
            //  表格的相关操作
            table.on('tool(demo)', function(obj){
                var data = obj.data;
                // console.log(data);
                //原始数据
                var id = data.id;
                var title = data.title;
                var description = data.description;
                var author = data.author;
                var creattime = data.creattime;
                var state = data.state;
                var sort = data.sort;
                var cover = data.cover;

                //重写后
                var content_STR = data.content_STR;
                var state_STR = data.state_STR;
                //调用 文章发布状态的函数   转换为中文
                var state_S = state_str_s(data.state);
                if(obj.event === 'setSign'){
                    // 事件判断  是否有封面
                    page.SetSign(data);
                }else if(obj.event==="detail"){
                    // 查看详情
                    page.Detail(data);
                }else if(obj.event==="del"){
                    // 删除操作
                    page.Del(data)
                }else if(obj.event==="edit"){
                    // 编辑操作 
                    page.Edit(data);
                }
            });
            
            var active = {
                AddNewData: page.AddNewData,     
                SelectData: page.SelectData,
                PageReload: page.PageReload        
            };
            // 监听工具栏的相关操作
            $('.layui-btn').on('click', function(obj) {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            // 监听操作
        },
        // 数据渲染
        dataLoad:function(parm, tableLoad=config.tableLoadFunc){
            
        },
        // 判断是否有封面
        SetSign:function(data){
                //监听单元格事件--封面预览图片
                var content = ImgWidthOutput(data.cover, "", "max-width:100%;");
                layer.open({
                    type: 1,
                    title: '查看内容',
                    area: ['500px', '500px'],
                    content: content //这里content是一个普通的String
                });
        },
        // 查看详情
        Detail:function(data){
             //查看当前数据

             var content = "";
             content += '<br><br>';
             content += '  	<form class="layui-form" action="" style="margin:10px;">';

             content += '    <div class="layui-form-item">';
             content += '	    <div class="layui-inline">';
             content += LabelText("id", "序号", data.id, "inline", "disabled");
             content += LabelText("creattime", "创建时间", data.creattime, "inline", "disabled");
             content += LabelText("author", "创建人", data.author, "inline", "disabled");
             content += '	    </div>';
             content += '    </div>';

             content += '    <div class="layui-form-item">';
             content += '	    <div class="layui-inline">';
             content += LabelText("state", "状态", data.state_S, "inline", "disabled");
             content += LabelText("sort", "排序", data.sort, "inline", "disabled");
             content += '	    </div>';
             content += '    </div>';

             content += '    <div class="layui-form-item">';
             content += LabelText("title", "标题", data.title, "block", "disabled");
             content += '    </div>';

             content += '    <div class="layui-form-item">';
             content += LabelTextArea("description", "描述", data.description, "block", "readonly");
             content += '    </div>';

             content += '    <div class="layui-form-item">';
             content += LabelChunText("封面图片", ImgWidthOutput(data.cover, "", "max-width:200px;"), "block");
             content += '    </div>';

             content += '    <div class="layui-form-item">';
             content += LabelChunText("文本内容", data.content_STR, "block");
             content += '    </div>';

             content += '  	</form>';

             //弹出查看框
             layer.open({
                 type: 1,
                 title: '查看内容',
                 area: ['1000px', '700px'],
                 //offset: ['50px', '200px'],
                 content: content //这里conte nt是一个普通的String
             });
        },
        // 删除当前数据
        Del:function(data){
             //删除当前数据	 
             var content = '<span style="color:#f00;">确定要删除？</span><br>序号：' + data.id + '<br>标题：' + data.title;
             layer.confirm(content, {
                 btn: ['确定删除', '暂不删除'] //可以无限个按钮		  	  
             }, function(index, layero) {
                 //按钮【按钮一】的回调
                 del_article(data.id, CFG_CODE);

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
        },
        // 编辑和修改当前的数据
        Edit:function(data){
            var content = "";
            content += '<br><br>';
            content += '  	<form class="layui-form" action="" style="margin:10px;">';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += LabelButton("立即更新", "layui-btn-warm", "button_update();");
            content += LabelButton("暂不更新", "layui-btn-primary", "button_close(1);");
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelText("id", "序号", data.id, "inline", "disabled");
            content += LabelText("creattime", "创建时间", data.creattime, "inline", "disabled");
            content += LabelText("author", "创建人", data.author, "inline", "disabled");
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelRadio("state", "状态", data.state, "inline", PERSONSTATE);
            content += LabelText("sort", "排序", data.sort, "inline", "");
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += LabelText("title", "标题", data.title, "block", "");
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += LabelTextArea("description", "描述", data.description, "block", "");
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += LabelChunText("封面图片", ImgWidthOutput(data.cover, "", "max-width:190px;"), "inline");
            content += LabelUploadImg("更换图片");
            content += '    </div>';

            content += '    <div class="layui-form-item layui-form-text">';
            // content += LabelTextEdit("文本编辑");
            content += ' <div id="editor" type="text/plain" style="width:900px;height:700px;"></div>'
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += LabelButton("立即更新", "layui-btn-warm", "button_update();");
            content += LabelButton("暂不更新", "layui-btn-primary", "button_close(1);");
            content += '	    </div>';
            content += '    </div>';

            content += '  	</form>';
            //弹出查看框
            layer.open({
                type: 1,
                title: '编辑内容',
                area: ['1000px', '700px'],
                content: content, //这里content是一个普通的String
                cancel: function(index, layero) {
                    UE.getEditor('editor').destroy();
                }
            });

            //绑定文本编辑器DIV的ID   初始化编辑器
            var editor = UE.getEditor('editor');
            editor.ready(function() { //编辑器初始化完成再赋值  
                editor.setContent(data.content_STR); //赋值给UEditor  
            });
           
            form.render(); // 数据表格重新渲染  
        },
        // 新增数据
        AddNewData:function(){
            var content = "";
            content += '<br><br>';
            content += '  	<form class="layui-form" action="" style="margin:10px;">';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += LabelButton("立即新增", "layui-btn-warm", "button_add();");
            content += LabelButton("关闭窗口", "layui-btn-primary", "button_close(1);");
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelRadio("state", "状态", 0, "inline", PERSONSTATE);
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelText("sort", "排序", "", "inline", "", "整数，数值越大越靠前", '');
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += LabelText("title", "标题", "", "block", "", "", "请输入标题，不超过三十字");
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += LabelTextArea("description", "描述", "", "block", "");
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += LabelChunText("默认封面", ImgWidthOutput("", "", "max-width:190px;"), "inline");
            content += LabelUploadImg("更换图片");
            content += '    </div>';

            content += '    <div class="layui-form-item layui-form-text">';
            content += '        <div id="editor" type="text/plain" style="width:900px;height:700px;"></div>'
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += LabelButton("立即新增", "layui-btn-warm", "button_add();");
            content += LabelButton("关闭窗口", "layui-btn-primary", "button_close(1);");
            content += '	    </div>';
            content += '    </div>';

            content += '  	</form>';
            //弹出查看框
            layer.open({
                type: 1,
                title: '新增内容',
                area: ['1000px', '700px'],
                content: content, //这里content是一个普通的String
                cancel: function(index, layero) {
                    UE.getEditor('editor').destroy();
                }
            });

            //绑定富文本编辑器DIV的ID
            var ue = UE.getEditor('editor');
            form.render();
        },
        // 查询数据
        SelectData:function(){
            var content = "";
            content += '<br><br>';
            content += '  	<form class="layui-form" action="" style="margin:10px;">';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelSelect("mystate", "状态", "", "inline", PERSONSTATESELECT);
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelText("title", "标题", "", "inline", "", "标题模糊查找");
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-inline">';
            content += LabelTextDate("FBSJ_a", "时间（起）");
            content += LabelTextDate("FBSJ_b", "时间（止）");
            content += '	    </div>';
            content += '    </div>';

            content += '    <div class="layui-form-item">';
            content += '	    <div class="layui-input-block">';
            content += LabelButton("立即查询", "layui-btn-warm", "button_select();");
            content += LabelButton("关闭窗口", "layui-btn-primary", "button_close();");
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
                    elem: '#FBSJ_a',
                    type: 'datetime'
                });
                laydate.render({
                    elem: '#FBSJ_b',
                    type: 'datetime'
                });
            });
        },
        // 刷新
        PageReload: function() {
            window.location.reload();
        }
    };

    exports('extra',page);
});
