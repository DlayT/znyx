// 用户登录
function login(username, password) {

    var registerId = "WEB20170619163500" + random(6);
    $.ajax({
            url: api('api/tokenext'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                registerId: registerId,
                username: username,
                password: password,
                deviceType: 5
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;

            if (responseCode == 0) {
                ////
                //获取验证成功返回值
                //同升湖与格塘小学有权限
                var DWID = data.data.UserDetail.schoolInfo.DWID;
                var YHLB = data.data.UserDetail.userinfo.YHLB;

                //权限验证模块
                try {
                    //if (DWID != "430111020007" && DWID != "430101030009") throw "对不起，您没有该学校管理权限！";
                    if (DWID != "430111020007") throw "对不起，您没有该学校管理权限！";
                    if (YHLB == 3) {
                        var SRZW = data.data.UserDetail.teacherInfo.SRZW;
                        var RJBJ = data.data.UserDetail.teacherInfo.hasOwnProperty("RJBJ") == false ? "" : data.data.UserDetail.teacherInfo.RJBJ;
                        //if (SRZW != "班主任" && SRZW != "校长" && SRZW != "学校领导") throw "对不起，您没有管理权限！<br>目前只针对校级管理员和班主任";
                        if (RJBJ == "") throw "对不起，您的账户未关联班级，请联系管理员！";
                    } else {

                    }

                } catch (err) {
                    //打印验证提示
                    var responseInfo = err;
                    layer_open('信息提示', responseInfo);
                    return false;
                }

                //权限验证通过
                //创建一个空对象，用来存储待注册Session的相关信息
                var obj = {};

                //TokenInfo
                var access_token = data.data.TokenInfo.access_token;

                //UserDetail--userinfo
                obj.M_ID = data.data.UserDetail.userinfo.ID;
                obj.YHM = data.data.UserDetail.userinfo.YHM;
                obj.YHLB = data.data.UserDetail.userinfo.YHLB;
                obj.GLJB = data.data.UserDetail.userinfo.GLJB;
                obj.GLQY = data.data.UserDetail.userinfo.GLQY;
                obj.YHTX = data.data.UserDetail.userinfo.YHTX;
                obj.IsVip = data.data.UserDetail.userinfo.IsVip;
                //UserDetail--schoolInfo
                obj.QYMC = data.data.UserDetail.schoolInfo.QYMC;
                obj.QYID = data.data.UserDetail.schoolInfo.QYID;
                obj.DWID = data.data.UserDetail.schoolInfo.DWID;
                obj.DWMC = data.data.UserDetail.schoolInfo.DWMC;
                obj.DWDZ = data.data.UserDetail.schoolInfo.DWDZ;
                obj.DWWZ = data.data.UserDetail.schoolInfo.DWWZ;
                obj.SFFB = data.data.UserDetail.schoolInfo.SFFB;
                if (YHLB == 3) {
                    //UserDetail--teacherInfo
                    obj.SEND_ID = data.data.UserDetail.teacherInfo.ID;
                    obj.JSXM = data.data.UserDetail.teacherInfo.JSXM;
                    obj.JSXB = data.data.UserDetail.teacherInfo.JSXB;
                    obj.RJXK = data.data.UserDetail.teacherInfo.RJXK;
                    obj.RJBJ = data.data.UserDetail.teacherInfo.RJBJ;
                    obj.SRZW = data.data.UserDetail.teacherInfo.SRZW;
                    obj.DHHM = data.data.UserDetail.teacherInfo.DHHM;
                    var XM = obj.JSXM;
                }

                if (YHLB == 2) {
                    //UserDetail--studentInfo
                    obj.SEND_ID = data.data.UserDetail.studentInfo.ID;
                    obj.CARDNO = data.data.UserDetail.studentInfo.CardNo; //一卡通卡号
                    obj.BALANCE = data.data.UserDetail.studentInfo.Balance; //一卡通余额
                    obj.NJMC = data.data.UserDetail.studentInfo.NJMC;
                    obj.XSID = data.data.UserDetail.studentInfo.XSID;
                    obj.XJID = data.data.UserDetail.studentInfo.XJID;
                    obj.XSXM = data.data.UserDetail.studentInfo.XSXM;
                    obj.FQXM = data.data.UserDetail.studentInfo.FQXM;
                    obj.FQDH = data.data.UserDetail.studentInfo.FQDH;
                    obj.MQXM = data.data.UserDetail.studentInfo.MQXM;
                    obj.MQDH = data.data.UserDetail.studentInfo.MQDH;
                    obj.XSXB = data.data.UserDetail.studentInfo.XSXB;
                    var XM = obj.XSXM;
                }

                //将登陆信息记录在本地数据库
                var accesstoken = access_token;
                var yonghuid = obj.M_ID;
                var yhm = obj.YHM;
                var yhlb = YHLB;
                var name = XM;
                var yhtx = obj.YHTX;

                TokenAddLoc(accesstoken, yonghuid, yhm, yhlb, name, yhtx);

                //账户有效性核查
                var total = UserdateChk(username, access_token);
                if (total != "success") {
                    layer_open('信息提示', total + "<br>Tel:18073166822");
                    //window.location.href="index.html";
                    return;
                } else {
                    //access_token单独注册session
                    sessionStorage.setItem("session_access_token", access_token);
                    //其他相关信息以JSON的形式打包注册session
                    var toStr = JSON.stringify(obj);
                    sessionStorage.setItem("session_json_str", toStr);
                    if (YHLB == 3) {
                        window.location.href = "content.html";
                        return false;
                    } else {
                        window.location.href = "../jxgt/index.html";
                        return false;
                    }
                }
                //账户有效性核查



            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer_open('信息提示', responseInfo);
                return false;
            }
        })
        .fail(function() {
            //打印验证提示
            var responseInfo = '数据获取异常，请稍后再试';
            layer_open('信息提示', responseInfo);
            return false;
        });
}

// 本地数据库Token登录记录
function TokenAddLoc(accesstoken, yonghuid, yhm, yhlb, name, yhtx) {
    $.ajax({
            url: apiphp_loctp('/api/token/TokenAdd.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                yonghuid: yonghuid,
                yhm: yhm,
                yhlb: yhlb,
                name: name,
                yhtx: yhtx,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {

            } else {
                //打印验证提示
                var responseInfo = responseMessage;

            }
        })
        .fail(function() {

        });
}

// 本地数据库Token核查
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级

//###函数级
//##########accesstoken			用户Token
//##########effective			有效期，单位分钟

//#####返回参数
//###接口级
//##########responseCode：		返回状态码（1：成功）
//##########responseMessage：	返回信息
//##########data：				返回数据（包含多个字段）
function TokenCheck(accesstoken,effective) {
    var total = new Array();
    $.ajax({
            url: apiphp_loctp('/api/token/TokenCheck.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                effective: effective,
            },
        })
         .done(function(data) {
        	data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
               total = "success";
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                total = responseInfo;
            }
        })
        .fail(function() {
            total = "error";
        });
    return total;    
}

// 用户名有效性核实
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken			用户Token
//###函数级
//##########yhm			        用户名

//#####返回参数
//###接口级
//##########responseCode：		返回状态码（1：成功）
//##########responseMessage：	返回信息
//##########data：				返回数据（包含多个字段）
function UserdateChk(yhm, accesstoken) {
    var total = "";
    //var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateChk.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                yhm: yhm,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = "success";
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                total = responseInfo;
            }
        })
        .fail(function() {
            total = "error";
        });
    return total;
}

//删除本地的storage
//localStorage删除指定键对应的值
function deleteItem(info) {
    sessionStorage.removeItem(info);

}

// 密码修改
function ModifyPassword(password_old, password_new) {
    var res;
    var token = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: api('api/Password/'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                access_token: token,
                Password1: password_old,
                Password2: password_new,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            //
            if (responseCode == 0) {
                res = true;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {

            res = false;
        });
    return res;
}

// 班级公告、班级新闻、班级日志、家长日志展示列表
function list_bjgg(FBID, SFFB, ZYMC, TJRY, FBSJ_a, FBSJ_b) {
    var ZYLB_CFG = GetKeyZYLB(getQueryString("CODE"));
    var ZYFL_CFG = GetKeyName_sys(getQueryString("CODE"));
    var FBFW_CFG = 4;
    var total = new Array();
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                ZYLB: ZYLB_CFG,
                ZYFL: ZYFL_CFG,
                FBFW: FBFW_CFG,
                FBID: FBID,
                SFFB: SFFB,
                ZYMC: ZYMC,
                TJRY: TJRY,
                FBSJ_a: FBSJ_a,
                FBSJ_b: FBSJ_b,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            ////
            if (responseCode == 0) {

                if (data.data.totalCount == 0) {
                    total = [];
                } else {
                    total = data.data.list;
                }

            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });

    return total;
}

// 学校新闻
function list_xxgg(FBID, SFFB, ZYMC, TJRY, FBSJ_a, FBSJ_b) {
    var ZYLB_CFG = GetKeyZYLB(getQueryString("CODE"));
    var ZYFL_CFG = GetKeyName_sys(getQueryString("CODE"));
    var FBFW_CFG = 2;
    var total = new Array();
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                ZYLB: ZYLB_CFG,
                ZYFL: ZYFL_CFG,
                FBFW: FBFW_CFG,
                FBID: FBID,
                SFFB: SFFB,
                ZYMC: ZYMC,
                TJRY: TJRY,
                FBSJ_a: FBSJ_a,
                FBSJ_b: FBSJ_b,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
    return total;
}

// 学校文章栏目
function list_article(code, title, state, creattimes, creattimee) {

    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/article/articlelist.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                code: code,
                title: title,
                state: state,
                creattimes,
                creattimes,
                creattimee,
                creattimee,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

// 学校文章栏目数据删除
function del_article(id, code) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/article/articleDel.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
                code: code,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
}

// 学校文章栏目数据更新
function edit_article(id, code, title, description, cover, content, state, sort) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/article/articleUpdate.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
                code: code,
                title: title,
                description: description,
                cover: cover,
                content: content,
                state: state,
                sort: sort,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                res = true;
                $("input[value='立即更新']").attr("disabled", true); //成功后设置提交按钮为不可用，防止重复提交
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {
            res = "请求失败，请重新登录";
        });
    return res;
}

// 学校文章栏目数据更新
function add_article(code, title, description, cover, content, state, sort) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/article/articleAdd.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                code: code,
                title: title,
                description: description,
                cover: cover,
                content: content,
                author: get_session("JSXM"),
                state: state,
                sort: sort,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            // console.log(data);
            if (responseCode == 1) {
                res = true;
                $("input[value='立即新增']").attr("disabled", true); //成功后设置提交按钮为不可用，防止重复提交
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {
            res = "请求失败，请重新登录";
        });
    return res;
}


// 大数据展示列表测试接口
function list_big() {
    var total = new Array();
    $.ajax({
            url: apiphp('jiaoyuziyuan/getBigDate.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {

            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
    return total;
}


// 班级公告、班级新闻、班级日志、家长日志数据删除
function del_bjgg(id, fbid, sffb) {
    var res;
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_Del.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                ID: id,
                FBID: fbid,
                SFFB: sffb
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
}
//文件上传接口
function UPloadAPI(img_base64, fileExtension, max_num) {
    //初始化参数
    var media_s = img_base64;
    var extension_s = fileExtension;
    var API_ALL_URL = api('uploadapi/phpupload.aspx');
    $.ajax(API_ALL_URL, {
        data: {
            access_token: usertoken(),
            extension: extension_s,
            media: media_s,
        },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        async: false,
        //指定HTTP请求的Header格式(教育家接口非JSON请求模式，注释)
        //headers:{'Content-Type':'application/json'},
        success: function(data) {
            data = isobject(data);
            //服务器返回响应，根据响应结果，分析是否登录成功；
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            ////
            if (responseCode == 0) {
                //显示上传后图片预览
                var img_src = pic(data.data);
                var img_list_str = s("img_list").innerHTML;
                var img_list_str_add = "<div><img id=\"imgsrc\" src=\"" + img_src + "\" style=\"width: 100px;height: 100px;\"/></div>";
                s("img_list").innerHTML = img_list_str_add + img_list_str;

                //上传后图片名称--容器
                if (s("img_class").innerHTML == "") {
                    s("img_class").innerHTML = data.data;
                } else {
                    s("img_class").innerHTML = s("img_class").innerHTML + "," + data.data;
                }


                //计数
                s("num").value = parseInt(s("num").value) + 1;
                if (parseInt(s("num").value) >= max_num) {
                    s("upload_aa").style.display = "none";
                }
            } else {

            }

        },
        error: function(xhr, type, errorThrown) {
            //异常处理；

        }

    });
}

//文件上传接口   图片上传
function UPloadAPILoc(img_base64, fileExtension, max_num) {
    //初始化参数
    var accesstoken = sessionStorage.getItem("session_access_token");
    var media_s = img_base64;
    var extension_s = fileExtension;
    var API_ALL_URL = apiphp_loctp('/api/sys/UploadImg.html');
    $.ajax(API_ALL_URL, {
        data: {
            accesstoken: accesstoken,
            extension: extension_s,
            media: media_s,
        },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        async: false,
        //指定HTTP请求的Header格式(教育家接口非JSON请求模式，注释)
        //headers:{'Content-Type':'application/json'},
        success: function(data) {
            data = isobject(data);
            //服务器返回响应，根据响应结果，分析是否登录成功；
            var responseCode = data.code;
            var responseMessage = data.msg;
            //
            if (responseCode == 1) {
                //显示上传后图片预览  
                var img_src = picLoc(data.data);
                // var img_list_str = s("img_list").innerHTML;
                // var img_list_str_add = "<div><img id=\"imgsrc\" src=\"" + img_src + "\" style=\"width: 100px;height: 100px;\"/></div>";
                // s("img_list").innerHTML = img_list_str_add + img_list_str;
                // 重复上传思路  更换 A 的背景图 
                $('.a-upload').attr('src',data.data);
                $('.a-upload').css('backgroundImage','url('+ img_src+')');

                //上传后图片名称--容器
                // if (s("img_class").innerHTML == "") {
                //     s("img_class").innerHTML = data.data;
                // } else {
                //     s("img_class").innerHTML = s("img_class").innerHTML + "," + data.data;
                // }
                //计数
                // s("num").value = parseInt(s("num").value) + 1;
                // if (parseInt(s("num").value) >= max_num) {
                //     s("upload_aa").style.display = "none";
                // }
            } else {

            }

        },
        error: function(xhr, type, errorThrown) {
            //异常处理；

        }

    });
}


//文件上传接口(五方文本编辑器使用)
function UPloadAPI_New(img_base64, fileExtension, max_num) {
    var res;
    //初始化参数
    var media_s = img_base64;
    var extension_s = fileExtension;
    var API_ALL_URL = api('uploadapi/phpupload.aspx');
    $.ajax(API_ALL_URL, {
        data: {
            access_token: usertoken(),
            extension: extension_s,
            media: media_s,
        },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        async: false,
        //指定HTTP请求的Header格式(教育家接口非JSON请求模式，注释)
        //headers:{'Content-Type':'application/json'},
        success: function(data) {
            data = isobject(data);
            //服务器返回响应，根据响应结果，分析是否登录成功；
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                //显示上传后图片预览
                res = pic(data.data);
            } else {

            }

        },
        error: function(xhr, type, errorThrown) {
            //异常处理；

        }
    });
    return res;
}

//文件上传接口(本地)(五方文本编辑器使用)
function UPloadAPI_NewLoc(img_base64, fileExtension, max_num) {
    var accesstoken = sessionStorage.getItem("session_access_token");
    var res;
    //初始化参数
    var media_s = img_base64;
    var extension_s = fileExtension;
    // http://192.168.0.108:8000/home/tol_api/index.php/api/sys/UploadImg.html
    var API_ALL_URL = apiphp_loctp('/api/sys/UploadImg.html');
    $.ajax(API_ALL_URL, {
        data: {
            accesstoken: accesstoken,
            extension: extension_s,
            media: media_s,
        },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        async: false,
        //指定HTTP请求的Header格式(教育家接口非JSON请求模式，注释)
        //headers:{'Content-Type':'application/json'},
        success: function(data) {
            data = isobject(data);
            //服务器返回响应，根据响应结果，分析是否登录成功；
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                //显示上传后图片预览

                res = picLoc(data.data);
                //
            } else {

            }

        },
        error: function(xhr, type, errorThrown) {
            //异常处理；

        }
    });
    return res;
}

//
// 班级公告、班级新闻、班级日志、家长日志数据新增
function add_bjgg(ZYMC, ZYLB, ZYNR, FBFW, FBID, ZYTP, ZYFL, SFFB) {
    var res;

    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_Add.php'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                ZYMC: ZYMC, //资源名称
                ZYLB: ZYLB, //1、教育资讯；2、通知公告
                ZYNR: ZYNR,
                FBFW: FBFW, //0、全市;1、全区;2、全校;3、全年级;4、全班级;-1、全体
                FBID: FBID,
                TJRY: get_session("M_ID"),
                SFFB: SFFB, //1、发布;0、不发布
                ZYTP: ZYTP, //封面图片
                ZYPX: 0, //0-999，默认0
                FJDZ: '',
                ZYFL: ZYFL //默认为空；ZYLB=1时，有中文类别名：家长百科、美育教育、教育新闻；
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            ////
            if (responseCode == 0) {
                res = true;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {

            res = false;
        });
    return res;
}

// 班级公告、班级新闻、班级日志、家长日志数据更新
function edit_bjgg(ID, FBID, ZYMC, ZYNR, ZYTP, SFFB) {
    var res;
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_Update.php'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                ID: ID,
                FBFW: 4,
                FBID: FBID,
                ZYMC: ZYMC,
                ZYNR: ZYNR,
                SFFB: SFFB,
                ZYTP: ZYTP,
                ZYPX: 0
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                res = true;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {

            res = false;
        });
    return res;
}

// 班级公告、班级新闻、班级日志、家长日志数据更新
function edit_xxgg(ID, FBID, ZYMC, ZYNR, ZYTP, SFFB) {
    var res;
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_Update.php'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                ID: ID,
                FBFW: 2,
                FBID: FBID,
                ZYMC: ZYMC,
                ZYNR: ZYNR,
                SFFB: SFFB,
                ZYTP: ZYTP,
                ZYPX: 0
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                res = true;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {

            res = false;
        });
    return res;
}


//班级公告/班级新闻/ 班级日志/家长日志  发布时选择年级
function selectClass(callback) {

    if (UserMannagerType(get_session("YHM")) == "99") {
        var arrbjx = get_session("DWID");
    } else {
        var arrBj = get_session("RJBJ").split(",");

        var arrbjx = arrBj.join(",");

    }

    $.ajax({
        url: apiphp('jiaoyuziyuan/getClassInfo.php'),
        data: {
            RJBJ: arrbjx
        },
        type: 'GET',
        async: false,
        success: function(data) {
            data = isobject(data);
            var result = data.data.list;
            callback(result);
            //                //
        },
        error: function() {

        }
    });
}


// 获取当前学校所有年级
function Grede_list(num) {

    $("#SelectGrade").empty();
    var DWID = get_session("DWID");
    $.ajax({
        url: apiphp_tp('api/Sys/gradeList.html'),
        data: {
            divisionId: DWID,
        },
        type: 'post',
        async: false,
        success: function(data) {

            //获取返回值
            data = isobject(data);
            //
            var result = data.data.list;
            //动态生成下列列表
            var obj = s("SelectGrade");
            if (result == "") {
                obj.add(new Option("全部", ""));
            } else {

                obj.add(new Option("全部", ""));
                var lenBj = result.length;

                for (var i = lenBj - 1; i >= 0; i--) {
                    var gradeName = result[i].gradeName;
                    var gradeId = result[i].gradeId;

                    //根据对应的权限显示相应的下拉框

                    if (num == "") {
                        obj.add(new Option(gradeName, gradeId));
                    } else if (num == "99") {

                        obj.add(new Option(gradeName, gradeId));
                    } else {
                        var sub_str = gread_name(num);
                        if (gradeName.indexOf(sub_str) >= 0) {
                            obj.add(new Option(gradeName, gradeId));
                        }
                    }

                    //根据对应的权限显示相应的下拉框


                }
            }
        },
        error: function() {

        }
    });
}

// 根据年级ID获取当前所有班级
function Class_list(gradeid) {
    $("#SelectClass").empty();
    $.ajax({
        url: apiphp_tp('api/Sys/classList.html'),
        data: {
            gradeId: gradeid,
        },
        type: 'post',
        async: false,
        success: function(data) {
            //获取返回值
            data = isobject(data);
            var result = data.data.list;
            //动态生成下列列表
            var obj = s("SelectClass");
            if (result == "") {
                obj.add(new Option("全部", ""));
            } else {

                obj.add(new Option("全部", ""));
                var lenBj = result.length;
                for (var i = lenBj - 1; i >= 0; i--) {
                    var className = result[i].className;
                    var classId = result[i].classId;
                    obj.add(new Option(className, classId));
                }
            }
        },
        error: function() {

        }
    });
}

// 获取任教班级中文名称,(由于拖慢显示速度，暂未使用)
function Class_name(RJBJ) {
    var total = new Array();
    $.ajax({
            url: apiphp('jiaoyuziyuan/getClassInfo.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                RJBJ: RJBJ,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {

                var num = data.data.list.length;
                var XXMC_STR = '';
                for (i = 0; i < num; i++) {
                    var NJMC = data.data.list[i].NJMC;
                    var BJMC = data.data.list[i].BJMC;
                    var XXMC = BJMC + '(' + NJMC + ')';
                    total += XXMC + ',';

                }
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
    return total;

}

// 统计分析，新增量
//TYPE :1,当天；2，当月；空，全部
function tjfx_add(type, dwid, bjid) {

    var total = new Array();
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_TjfxAdd.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                TYPE: type,
                DWID: dwid,
                BJID: bjid,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {

                total = data.data;

            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
    return total;

}


// 统计分析，班级文章明细分析
function list_bjqmx(NJID, BJID, FBSJ_a, FBSJ_b) {
    var total = new Array();
    var DWID = get_session("DWID");

    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_TjfxMx.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                DWID: DWID,
                NJID: NJID,
                BJID: BJID,
                FBSJ_a: FBSJ_a,
                FBSJ_b: FBSJ_b,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
    return total;
}

// 统计分析，教师明细分析
function list_jsmx() {
    var total = new Array();
    var DWID = get_session("DWID");
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_JsMx.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                DWID: DWID,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
    return total;
}

// 提交JSON数据，导出excel表格
function download_excel(Title_Name, Title_Head, Title_En_Head, data_json) {

    $.ajax({
            url: apiphp('jiaoyuziyuan/CreateExcel.php'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                Title_Name: Title_Name,
                Title_Head: Title_Head,
                Title_En_Head: Title_En_Head,
                data_json: data_json,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                //创建成功后，直接下载
                var filename = data.data;
                var fileroot = 'excel_download/' + filename;
                var fileurl = apiphp(fileroot);
                window.location.href = fileurl;
                //删除文件
                //del_excel(filename);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });

}

// 删除生成的excel表格
function del_excel(Filename) {

    $.ajax({
            url: apiphp('jiaoyuziyuan/DelExcel.php'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                Filename: Filename,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                //操作成功
                //
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });

}

// 班级公告、班级新闻、班级日志、家长日志展示列表（评论）
function list_plgl(FBID, status, ZYMC, content, FBSJ_a, FBSJ_b) {
    var total = new Array();
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_Pl.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                FBID: FBID,
                status: status,
                ZYMC: ZYMC,
                content: content,
                FBSJ_a: FBSJ_a,
                FBSJ_b: FBSJ_b,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            //
            if (responseCode == 0) {

                if (data.data.totalCount == 0) {
                    total = [];
                } else {
                    total = data.data.list;
                }

            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });

    return total;
}

// 班级公告、班级新闻、班级日志、家长日志数据评论删除
function del_plgl(id, relate_id, status) {
    var res;
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_PlDel.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                id: id,
                relate_id: relate_id,
                status: status
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
}

// 班级公告、班级新闻、班级日志、家长日志数据评论审核
function changge_plgl(id, relate_id, status) {
    var res;
    $.ajax({
            url: apiphp('jiaoyuziyuan/getJiaoYuZiYuan_PlCheck.php'),
            type: 'GET',
            dataType: 'json',
            async: false,
            data: {
                id: id,
                relate_id: relate_id,
                status: status
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.responseCode;
            var responseMessage = data.responseMessage;
            if (responseCode == 0) {
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "接口访问异常";
            layer.msg(responseInfo);
        });
}

//-----------------new-------------------------------
// 获取服务系统菜单
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-17

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级


//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function servicemenulist() {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Menu/ServiceMenuList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

// 用户名管理级别
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-03-15

//#####请求参数
//###接口级
//##########accesstoken			用户Token
//###函数级
//##########yhm			        用户名

//#####返回参数
//###接口级
//##########responseCode：		返回状态码（1：成功）
//##########responseMessage：	返回信息
//##########data：				返回数据（包含多个字段）
function UserMannagerType(yhm) {
    var total = "";
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserMannagerType.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                yhm: yhm,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                total = 0;
            }
        })
        .fail(function() {
            total = 0;
        });

    return total;
}


// 访问页面权限核实
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken			用户Token
//###函数级
//##########yhm			        用户名

//#####返回参数
//###接口级
//##########responseCode：		返回状态码（1：成功）
//##########responseMessage：	返回信息
//##########data：				返回数据（包含多个字段）
function MenuChk(locpage) {
    var total = "";
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Menu/CheckMenu.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                locpage: locpage,
            },
        })
        .done(function(data) {
            data = isobject(data);
            //
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = "success";
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                total = responseInfo;
            }
        })
        .fail(function() {
            total = "error";
        });
    return total;
}

// 用户有效期栏目
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########status				状态
//##########yhm：				用户账户

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_adminuserdate(status, yhm) {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                status: status,
                yhm: yhm,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

// 创建有效用户
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########yhm				用户名
//##########starttime		开始时间
//##########endtime			结束时间

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function add_sysuserdate(yhm, type, starttime, endtime, intro) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateAdd.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                yhm: yhm,
                type: type,
                starttime: starttime,
                endtime: endtime,
                intro: intro,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                res = true;
                $("input[value='立即新增']").attr("disabled", true); //成功后设置提交按钮为不可用，防止重复提交
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {
            res = "请求失败，请重新登录";
        });
    return res;
}

// 编辑有效用户
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########id				序号
//##########starttime		开始时间
//##########endtime			结束时间

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function edit_sysuserdate(id, type, starttime, endtime, intro) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateUpdate.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
                type: type,
                starttime: starttime,
                endtime: endtime,
                intro: intro,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                res = true;
                $("input[value='立即更新']").attr("disabled", true); //成功后设置提交按钮为不可用，防止重复提交
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {
            res = "请求失败，请重新登录";
        });
    return res;
}

// 切换有效用户状态
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########id				序号

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function change_sysuserdate(id) {
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateStatus.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
}

// 删除用户
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########id				序号

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function del_sysuserdate(id) {
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateDelete.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
}

// 用户组栏目
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_adminusergroup() {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Group/GroupList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

// 用户组栏目(简单版)
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_adminusergroupsimple() {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Group/GroupSimpleList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}


// 切换有效用户组状态
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########id				序号

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function change_sysusergroup(id) {
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Group/UserGroupStatus.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
}

// 编辑用户组菜单
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########id				序号
//##########service		    服务列表
//##########module			主菜单列表
//##########function_s		子菜单列表

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function edit_groupmenu(id, service, module, function_s) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Group/UserGroupMenuUpdate.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                id: id,
                service: service,
                module: module,
                function_s: function_s,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                res = true;
                $("input[value='立即更新']").attr("disabled", true); //成功后设置提交按钮为不可用，防止重复提交
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {
            res = "请求失败，请重新登录";
        });
    return res;
}

// 新增用户组
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########type			组号
//##########groupname		组名
//##########service		    服务列表
//##########module			主菜单列表
//##########function_s		子菜单列表

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function add_groupmenu(type, groupname, service, module, function_s) {
    var res;
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Group/UserGroupMenuAdd.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                type: type,
                groupname: groupname,
                service: service,
                module: module,
                function_s: function_s,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                res = true;
                $("input[value='立即更新']").attr("disabled", true); //成功后设置提交按钮为不可用，防止重复提交
            } else {
                //打印验证提示
                var responseInfo = responseMessage;

                res = responseInfo;
            }
        })
        .fail(function() {
            res = "请求失败，请重新登录";
        });
    return res;
}

// 系统菜单树
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_admintreemenu() {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Menu/TreeList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}
// 获取服务系统主模块菜单
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-17

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级


//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function modulemenulist(serviceurl) {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Menu/ModuleMenuList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                serviceurl: serviceurl,
            },
        })
        .done(function(data) {
            data = isobject(data);
            //
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

/////////////////公共部分/////////////////////////////////////////////////

/////////////////平台监控/////////////////////////////////////////////////
// 登录鉴权栏目
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########dwid：				单位ID
//##########dwmc：				单位名称
//##########yhm：				用户账户
//##########yhlb：				用户类别
//##########name：				姓名
//##########issort：				排序规则
//##########updatetimes：		更新时间（起）
//##########updatetimee：		更新时间（止）

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_admindljq(dwid, dwmc, yhm, yhlb, name, issort, updatetimes, updatetimee) {

    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Token/TokenList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                dwid: dwid,
                dwmc: dwmc,
                yhm: yhm,
                yhlb: yhlb,
                name: name,
                issort: issort,
                updatetimes,
                updatetimes,
                updatetimee,
                updatetimee,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);

            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

// 操作日志栏目
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########yhm：				用户账户
//##########name：				姓名
//##########optype：				操作类型
//##########opstate：			操作状态
//##########opinfo：				操作内容
//##########opsql：				操作语句
//##########creattimes：			创建时间（起）
//##########creattimee：			创建时间（止）

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_adminczrz(yhm, name, optype, opstate, opinfo, opsql, creattimes, creattimee) {

    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/Log/LogList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                yhm: yhm,
                name: name,
                optype: optype,
                opstate: opstate,
                opinfo: opinfo,
                opsql: opsql,
                creattimes,
                creattimes,
                creattimee,
                creattimee,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}

// 用户有效期栏目
//#####创建时间：2018-01-03
//#####创建人：cityfox
//#####QQ：29151335
//#####更新时间：2018-01-15

//#####请求参数
//###接口级
//##########accesstoken：		接口鉴权
//###函数级
//##########status				状态
//##########yhm：				用户账户

//#####返回参数
//###接口级
//##########code：				返回状态码（1：成功）
//##########msg：				返回信息
//##########data：				返回数据（包含多个字段）
function list_adminuserdate(status, yhm) {
    var total = new Array();
    var accesstoken = sessionStorage.getItem("session_access_token");
    $.ajax({
            url: apiphp_loctp('/api/User/UserdateList.html'),
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                accesstoken: accesstoken,
                status: status,
                yhm: yhm,
            },
        })
        .done(function(data) {
            data = isobject(data);
            var responseCode = data.code;
            var responseMessage = data.msg;
            if (responseCode == 1) {
                total = data.data.list;
            } else {
                //打印验证提示
                var responseInfo = responseMessage;
                layer.msg(responseInfo);
            }
        })
        .fail(function() {
            var responseInfo = "请求失败，请重新登录";
            layer.msg(responseInfo);
        });
    return total;
}