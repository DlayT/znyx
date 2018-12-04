/*
 * @Author: ZhouChao(Cityfox) 
 * @Date: 2018-02-05 09:35:41 
 * @Last Modified by: ztong
 * @Last Modified time: 2018-06-05 09:43:47
 */
// 当前版本
function NowVer() {
    return "1.0.0";
}

// 学校单位ID
function tshid() {
    // 此为格塘小学单位ID测试用
    //return "430101030009";
    // 此为同升湖学校单位ID
    return "430111020007";
}
// 用户token
function usertoken() {
    return sessionStorage.getItem("session_access_token");
}

//获取session值中对应键值
function get_session(key) {
    //获取session（JSON格式）
    var result = JSON.parse(sessionStorage.getItem("session_json_str"));
    if (!emptyObject(result)) {
        var key_str = result[key];
    } else {
        var key_str = "";
    }
    return key_str;
}

//layer弹框信息提示
/**
 * 
 * @param {*} title   标题
 * @param {*} content 主题内容
 */
function layer_open(title, content) {
    layer.open({
        title: title,
        content: content
    });
}

//组装打开框架字符串拼接
function iframe_str(url) {
    var iframe_str = '<iframe width="100%" frameborder="0" src="' + url + '" style="min-height:750px;"></iframe>';
    return iframe_str;
}

//组装表单字符串---多列文本框
/**
 * 
 * @param {*} id 
 * @param {*} name 
 * @param {*} value 
 * @param {*} type 
 * @param {*} dis 
 * @param {*} word 
 */
function LabelText(id, name, value, type, dis, word ,place) {
    var dis_bg = "";
    var content = "";
    if (dis != "") { dis_bg = "layui-bg-gray"; }
    content += '<label class="layui-form-label">' + name + '</label>';
    content += '<div class="layui-input-' + type + '">';
    content += '	<input type="text" name="' + id + '" placeholder="'+place+'" lay-verify="' + id + '" class="layui-input ' + dis_bg + '" value="' + value + '"' + dis + '>';
    content += '</div>';
    if (NoEmptySimple(word)) {
        content += '<div class="layui-form-mid layui-word-aux">' + word + '</div>';
    }
    return content;
}

//组装表单字符串---多行文本框
/**
 * 
 * @param {*} id 
 * @param {*} name 
 * @param {*} value 
 * @param {*} type 
 * @param {*} dis 
 */
function LabelTextArea(id, name, value, type, dis) {
    var dis_bg = "";
    var content = "";
    if (dis != "") { dis_bg = "layui-bg-gray"; }
    content += '<label class="layui-form-label">' + name + '</label>';
    content += '<div class="layui-input-' + type + '">';
    content += '    <textarea name="' + id + '" placeholder="请输入描述内容，不超过100字" class="layui-textarea ' + dis_bg + '" ' + dis + '>' + value + '</textarea>';
    content += '</div>';
    return content;
}

//组装表单字符串---多行文本框
function LabelChunText(name, value, type) {
    var content = "";
    content += '<label class="layui-form-label">' + name + '</label>';
    content += '<div class="layui-input-' + type + '">';
    content += value;
    content += '</div>';
    return content;
}

//组装表单字符串---按钮
function LabelButton(name, layuiclass, jsStr) {
    var content = "";
    content += '<input type="button" class="layui-btn ' + layuiclass + '" value="' + name + '" onclick="' + jsStr + '">';
    return content;
}

//组装表单字符串---时间选择
function LabelTextDate(id, name) {
    var content = "";
    content += '	    	<label class="layui-form-label">' + name + '</label>';
    content += '	    	<div id="layui-input-inline" class="layui-input-inline">';
    content += '    			<input type="text" class="layui-input" id="' + id + '" placeholder="yyyy-MM-dd HH:mm:ss">';
    content += '	    	</div>';
    return content;
}

//组装下拉字符串---单选
function LabelSelect(id, name, value, type, PERSON) {
    var content = "";
    var stateselect = "";
    content += '<label class="layui-form-label">' + name + '</label>';
    content += '<div class="layui-input-' + type + '">';
    content += '	<select id="' + id + '">';
    for (var iii = 0; iii < PERSON.length; iii++) {
        if (PERSON[iii].SVALUE === value) {
            stateselect = "selected";
        } else {
            stateselect = "";
        }
        content += '<option value="' + PERSON[iii].SVALUE + '" ' + stateselect + '>' + PERSON[iii].STITLE + '</option>';
    }
    content += '	</select>';
    content += '</div>';
    return content;
}

//组装单选按钮字符串---单选
function LabelRadio(id, name, value, type, PERSON) {
    var content = "";
    var statecheck = "";
    content += '<label class="layui-form-label">' + name + '</label>';
    content += '<div class="layui-input-' + type + '">';
    for (var iii = 0; iii < PERSON.length; iii++) {
        if (PERSON[iii].SVALUE == value) {
            statecheck = "checked";
        } else {
            statecheck = "";
        }
        content += '<input type="radio" name="' + id + '" value="' + PERSON[iii].SVALUE + '" title="' + PERSON[iii].STITLE + '" ' + statecheck + '>';
    }
    content += '</div>';
    return content;
}

//组装图片上传字符串---单图片上传
function LabelUploadImg(name) {
    var content = "";
    content += '    	<label class="layui-form-label">' + name + '</label>';
    content += '    	<div class="layui-input-inline">';
    content += '    		<div id="img_list">';
    content += '    			<div id="upload_aa">';
    content += '    				<a class="a-upload">';
    content += '    					<input type="file" name="medias" id="medias" onchange="imagePreviewLoc(this,1);">';
    content += '    				</a>';
    content += '    			</div>';
    content += '    			</div>';
    content += '    	</div>';
    //<!--待上传图片字符串与图片计数-->
    content += '<div id="img_class" style="display: none;"></div>';
    content += '<input type="text" name="num" id="num" value="0" style="display: none;">';
    //<!--待上传图片字符串与图片计数-->    
    return content;
}

//组装文本编辑器字符串---富文本编辑
function LabelTextEdit(name) {
    var content = "";
    content += '    	<label class="layui-form-label">' + name + '</label>';
    content += '    	<div class="layui-input-inline">';
    content += '			<div id="editor" style="line-height:1.5;"></div>';
    content += '			<span><img id="btn"  src="wufangeditor/01.png" style="height:30px;" title="预览效果"></span>';
    //<!--预览框-->
    content += '			<div id="content" style="border:1px solid #ccc; border-radius:3px; box-shadow: 0px 5px 10px #E8E8E8; min-height:300px; margin-top: 30px; padding:10px; display:none; width: 900px;"></div>';
    //<!--预览框-->
    content += '    	</div>';
    return content;
}




//输出图片标签
function ImgWidthOutput(src, width, style) {
    var content = "";
    if (EmptySimple(src)) {
        src = "image/dafault.jpg";
        content = '<img src="' + src + '" width="100px"/>';
    } else {
        src = picLoc(src);
        content = '<img src="' + src + '" width="' + width + '" style="' + style + '"/>';
    }

    return content;
}





//图片上传按钮改变事件
function imagePreview(input, max_num) {
    var file = input.files[0];
    //判断类型是不是图片
    var imageType = /^image\//;
    if (!imageType.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        var file = input.files[0];
        var file_name = file.name;
        var fileExtension = file_name.split('.').pop().toLowerCase();
        var img_base64 = this.result;
        //var max_num = 9;//最多三张
        UPloadAPI(img_base64, fileExtension, max_num);
    }
}

//图片上传按钮改变事件(五方文本编辑器使用)
function imagePreviewNew(input, max_num) {
    var imgurl;
    var file = input.files[0];
    var file_name = file.name;
    var fileExtension = file_name.split('.').pop().toLowerCase();
    //判断类型是不是图片
    var imageType = /^image\//;
    if (!imageType.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        var img_base64 = this.result;
        //var max_num = 9;//最多三张
        imgurl = UPloadAPI_New(img_base64, fileExtension, max_num);
        add_img(imgurl);
    }
}


//图片上传按钮改变事件（本地服务器）
function imagePreviewLoc(input, max_num) {
    var file = input.files[0];
    //判断类型是不是图片
    var imageType = /^image\//;
    if (!imageType.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        var file = input.files[0];
        var file_name = file.name;
        var fileExtension = file_name.split('.').pop().toLowerCase();
        var img_base64 = this.result;
        //var max_num = 9;//最多三张
        UPloadAPILoc(img_base64, fileExtension, max_num);
    }
}

//账户对应的学部管理级别
function YHM_str(YHM) {
    switch (YHM) {
        case "13711110000": //格塘测试学校校长
            return "99"; //99:全校学部管理
            break;
        case "18073166777": //校长
            return "99"; //99:全校学部管理
            break;
        case "18073166822": //周主任
            return "99"; //99:全校学部管理
            break;
        case "18073166749": //徐科老师
            return "2"; //2:初中部
            break;
        default:
            return "";
    }
}

//接口URL地址
function api(url) {
    //返回接口域名地址
    return "http://jk.wufangedu.com/" + url;
}

function apiphp(url) {
    //返回接口域名地址
    return "http://www.wufangedu.com/public_php_json/" + url;
}

function apiphp_tp(url) {
    //返回接口域名地址
    return "http://www.wufangedu.com/tp_api/index.php/" + url;
}

function apiphp_loctp(url) {
    //返回接口域名地址
    // return "http://192.168.0.153:9096/TSH/tol_api/index.php/" + url;
    //返回接口域名地址  本地的测试环境 http://192.168.0.108:8000
    // zt 本机的地址
    return "http://192.168.0.130/znyx/api_tol/index.php" + url;
    //正式环境
    // return "http://jx.tsheducation.net:8080/api_tol_zn/index.php/" + url;
}
//图片URL地址
function WebLoc(url) {
    //返回图片域名地址
    // return "http://192.168.0.153/TSH/admin/" + url;
    // zt 本机的地址 本地图片
    // return "http://192.168.0.108/admin(tsh)/" + url;
    // 正式环境的地址
    return "http://jx.tsheducation.net:8080/uploads/" + url;
}

//图片URL地址
function picLoc(url) {
    //返回图片域名地址
    // return "http://192.168.0.153/TSH/uploads/" + url;
    // zt 本机的地址
    return "http://192.168.0.130/znyx/api_tol/" + url;
    // 正式环境的地址
    // return "http://jx.tsheducation.net:8080/uploads/" + url;

}

//图片URL地址
function pic(url) {
    //返回图片域名地址
    return "http://image.wufangedu.com/" + url;
}



//学部名称
function gread_name(id) {
    switch (id) {
        case "1":
            return "小学";
            break;
        case "2":
            return "初中";
            break;
        case "3":
            return "高中";
            break;
        case "4":
            return "同升幼儿园";
            break;
        case "5":
            return "水韵幼儿园";
            break;
        default:
            return "未知";
    }
}


// 发布状态
function SFFB_str(state) {
    switch (state) {
        case "0":
            //正式环境
            CODE = "<span style=\"color:#E22133;font-weight: bold;\">未发布</span>";
            break;
        case "1":
            //调试环境
            CODE = "<span style=\"color:#009688;font-weight: bold;\">已发布</span>";
            break;
        default:
            CODE = "未知";
    }
    return CODE;
}

// 发布状态
function SFFB_str_s(state) {
    switch (state) {
        case "0":
            //正式环境
            CODE = "未发布";
            break;
        case "1":
            //调试环境
            CODE = "已发布";
            break;
        default:
            CODE = "未知";
    }
    return CODE;
}

// 审核状态
function status_str(state) {
    switch (state) {
        case "0":
            //正式环境
            CODE = "<span style=\"color:#E22133;font-weight: bold;\">未审核</span>";
            break;
        case "1":
            //调试环境
            CODE = "<span style=\"color:#009688;font-weight: bold;\">已审核</span>";
            break;
        default:
            CODE = "未知";
    }
    return CODE;
}

//根据KEY值，获取系统内对应中文名称
function GetKeyName_sys(key) {
    switch (key) {
        case "1":
            return "";
            break;
        case "2":
            return "教育新闻";
            break;
        case "3":
            return "家长百科";
            break;
        case "4":
            return "美育教育";
            break;
        default:
            return "";
    }
}

//根据KEY值，获取资源类别
function GetKeyZYLB(key) {
    switch (key) {
        case "1":
            return "2";
            break;
        case "2":
            return "1";
            break;
        case "3":
            return "1";
            break;
        case "4":
            return "1";
            break;
        default:
            return "";
    }
}

//管理级别
function GLJB_str(id) {
    switch (id) {
        case "0":
            return "超级管理员";
            break;
        case "1":
            return "市级管理";
            break;
        case "2":
            return "区级管理";
            break;
        case "3":
            return "校级管理";
            break;
        case "4":
            return "年级管理";
            break;
        case "5":
            return "班级管理";
            break;
        case "-1":
            return "无管理权限";
            break;
        default:
            return "未知";
    }
}

//根据ZYLB，ZYFL值，获取资源类别
function GetZYLBName(ZYLB, ZYFL) {
    switch (ZYLB) {
        case "2":
            return "班级通知";
            break;
        case "1":
            switch (ZYFL) {
                case "教育新闻":
                    return "班级新闻";
                    break;
                case "家长百科":
                    return "班级荣誉";
                    break;
                case "美育教育":
                    return "家长留言";
                    break;
                default:
                    return ZYFL;
            }
        default:
            return "";
    }
}


//表格数据加载提示
function TableLoadInfo(res, curr, count) {
    if (curr == 1) {

        if (count == 0) {
            layer.msg("暂无数据");
        } else {
            layer.msg("共加载" + count + "条");
        }

    } else {
        layer.msg("第" + curr + "页加载完成");
    }
}

// 文章发布状态
function state_str(state) {
    switch (state) {
        case 0:
            //正式环境
            CODE = "<span style=\"color:#E22133;font-weight: bold;\">未发布</span>";
            break;
        case 1:
            //调试环境
            CODE = "<span style=\"color:#009688;font-weight: bold;\">已发布</span>";
            break;
        default:
            CODE = "未知";
    }
    return CODE;
}

// 文章发布状态
function state_str_s(state) {
    switch (state) {
        case 0:
            //正式环境
            CODE = "未发布";
            break;
        case 1:
            //调试环境
            CODE = "已发布";
            break;
        default:
            CODE = "未知";
    }
    return CODE;
}

// 系统模块菜单状态字符
function sysmod_str(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 0:
            CODE = "(不可见)";
            break;
        case 1:
            CODE = "";
            break;
        case 2:
            CODE = "(维护中)";
            break;
        case 3:
            CODE = "(更新中)";
            break;
        case 4:
            CODE = "(开发中)";
            break;
        case 5:
            CODE = "(未激活)";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}

// 是否选中
function checked_str(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 0:
            CODE = "";
            break;
        default:
            CODE = "checked";
    }
    return CODE;
}

// 用户身份
function yhlb_str(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 3:
            //
            CODE = "老师";
            break;
        case 2:
            //
            CODE = "家长";
            break;
        case 1:
            //
            CODE = "学生";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}


// 用户头像
function yhtx_str(iii) {
    if (EmptySimple(iii)) {
        src = "image/dafaulthead.jpg";
        CODE = '<img src="' + src + '" width="30px" style="border-radius:40px;"/>';
    } else {
        src = pic(iii);
        CODE = '<img src="' + src + '" width="30px" style="border-radius:40px;"/>';
    }
    return CODE;
}

// 系统模块菜单状态字符
function sysmod_str_s(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 0:
            CODE = "禁用";
            break;
        case 1:
            CODE = "可用";
            break;
        case 2:
            CODE = "维护中";
            break;
        case 3:
            CODE = "更新中";
            break;
        case 4:
            CODE = "开发中";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}

// 操作类型
function opstate_str(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 0:
            //
            CODE = "失败";
            break;
        case 1:
            //
            CODE = "成功";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}

// 操作类型
function optype_str(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 1:
            //
            CODE = "新增";
            break;
        case 2:
            //
            CODE = "删除";
            break;
        case 3:
            //
            CODE = "更新";
            break;
        case 4:
            //
            CODE = "查询";
            break;
        case 5:
            //
            CODE = "逻辑删除";
            break;
        case 6:
            //
            CODE = "上传";
            break;
        case 7:
            //
            CODE = "下载";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}

// 项目模块
// function mode_str(iii) {
// 	switch (iii) 
// 	{
// 		case "admin":
// 			//
// 			CODE = "后台管理系统";
// 			break; 				
// 		case "certificate":
// 			//
// 			CODE = "证书系统";
// 			break; 
// 		case "defrayal":
// 			//
// 			CODE = "支付系统";
// 			break;		        
// 		default:
// 			CODE = iii;       
// 	}
// 	return CODE;
// }

// 状态
function sstate_str(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 0:
            //
            CODE = "<span style=\"color:#808080;font-weight: bold;\">已删除</span>";
            break;
        case 1:
            //
            CODE = "<span style=\"color:#009688;font-weight: bold;\">可用</span>";
            break;
        case 2:
            //
            CODE = "<span style=\"color:#E22133;font-weight: bold;\">不可用</span>";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}

// 状态
function sstate_str_s(iii) {
    iii = parseInt(iii);
    switch (iii) {
        case 0:
            //
            CODE = "已删除";
            break;
        case 1:
            //
            CODE = "可用";
            break;
        case 2:
            //
            CODE = "不可用";
            break;
        default:
            CODE = iii;
    }
    return CODE;
}