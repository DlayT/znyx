// 配置得js
// 公共的地址路径
function url() {
    // 测试环境
    // return 'http://192.168.0.153:9096/TSH/tol_api/index.php/api/';

    // 修改后得地址
    // return 'http://192.168.0.130/znyx/api_tol/index.php/api/';
    // 正式环境
    return 'http://jx.tsheducation.net:8080/api_tol_zn/index.php/api';

}

function img() {
    // 测试环境的图片地址
    // return 'http://192.168.0.153:9096/TSH/uploads/';
    // 正式环境地址
    return 'http://jx.tsheducation.net:8080/uploads/'
}
// 获取URL 参数 
//获取链接中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}


// 记录访问量的接口 http://192.168.0.153:9096/TSH/tol_api/index.php/api/access/AccessAdd?articleid=56
function ActiveSum(id) {
    jQuery.support.cors = true;
    $.ajax({
        url: url() + '/access/AccessAdd',
        contentType: 'text/plain',
        data: {
            articleid: id
        },
        type: 'GET',
        dataType: 'json',
        success: function(data) {

        },
        error: function(data) {
            //
        }
    });
}