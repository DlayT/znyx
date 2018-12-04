// 获取地址中的参数
var id = getQueryString('id');
var fbid = getQueryString('fbid');
// 请求数据 获取详情数据
// 函数调用
GetMessage_info(id, fbid);
// 回掉函数 处理获取的数据
function GetMessage_info_callback(data) {
    //返回数据处理
    //
    var datas = data.data;
    var ID = datas.ID; //  数据ID
    var ZYMC = datas.ZYMC; // 资源名称
    var FBSJ = datas.FBSJ.substr(0, 10); //发布时间
    var TJRY = datas.TJRY; // 提交人员
    var ZYNR = datas.ZYNR; //资源内容
    var html = "";
    if (ID == "") {
        html += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text_div pad_left_10 c_box fc_grey_3">';
        html += '暂无数据';
        html += '</div>';
    } else {
        // 标题
        $('.tils').html(ZYMC);
        // 内容
        $('.txtBox').html(ZYNR);
        // 发布的时间
        $('.times').html(FBSJ);
        // 提交人员
        $('.people').html(TJRY);

    }
}


//详情接口交互（定义接口地址，传入参数，创建js文件）
function GetMessage_info(id, fbid) {
    var local_url = HOST_url() + "/public_php_json/jiaoyuziyuan/JsonP_getJiaoYuZiYuan_Info.php";
    var data = {
        jsoncallback: 'GetMessage_info_callback', // 回调函数
        ID: id, //  数据ID
        FBID: fbid, // 发布ID
        SFFB: 1 // 是否发布
    };
    //提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
    var url = JsonToGet(local_url, data); //将接口与参数拼接成JsonP请求模式
    //创建JS引用文件
    appendChild_script(url);
}