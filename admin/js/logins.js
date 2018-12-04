/*
 * @Author: Cityfox(29151335@qq.com) 
 * @Date: 2018-02-06 17:48:53 
 * @Last Modified by: Cityfox(29151335@qq.com)
 * @Last Modified time: 2018-05-14 09:27:50
 */
var access_token_s = sessionStorage.getItem("session_access_token");
// /*验证登录有效性，否-->退出提示登录*/

if (access_token_s == "" || access_token_s == null) {
    //未登录        
        top.location.href = "index.html";      
}

var total = TokenCheck(access_token_s,30);//Token有效期30分钟
//console.log(total);
if (total != "success") {
    
    //登录已失效
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('<br><p style="margin-left:20px;margin-right:20px;height:120px;line-height:30px;">登录已失效,为了账户安全请重新登录,原因如下：<br>1.长时间未进行操作;<br>2.账户在其他地方登录;<br>3.登录状态异常;</p>', {
            type: 1,
            btn: ['知道了'] 
            }, function(index, layero){
                top.location.href = "index.html"; 
            });
        $(".layui-layer-setwin").css("display","none") ;        
    }); 
           
}