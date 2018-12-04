/**
 * Created by Administrator on 2017/8/9.
 */

//文本编辑函数
function createBox(id) {
    var contents = s(id);
    createE(contents);

    //获取元素 并且绑定事件
    var content = s('txtBox');
    var box = s('content');
    var Btn2 = s('btn2');
    var btn1 = s('btn');
    var btn3 = s('ex');
    //初始化文本框
    content.innerHTML = "";

    //提交图片
    Btn2.addEventListener('change', viewImg, false);
    // 图片预览函数
    function viewImg(event) {
        event = event || window.event;
        var files = this.files;
        //动态创建一个预览的图片盒子
        var div = document.createElement('div');
        //      获取选取到的资源
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            var fileExtension = files[i].name.split('.').pop().toLowerCase();
            reader.onload = (function(file) {
                return function(event) {
                    var span = document.createElement('span');
                    var img_base64 = this.result;
                    var imgurl = UPloadAPI_New(img_base64, fileExtension, 1);
                    span.innerHTML = '<img src="' + imgurl + '" alt="' + imgurl + '" />';
                    div.insertBefore(span, null);
                }
            })(f);
            //读取文件的内容
            reader.readAsDataURL(f);
        }
        //向父容器追加创建的结构
        content.appendChild(div)
    }
    //预览按钮
    btn1.addEventListener('click', function() {
        //显示预览框
        document.getElementById("content").style.display = "block";
        //        创建一个容器
        var x = cj("div");
        //首先清空接收容器的内容
        box.innerHTML = "";
        //获取容器中的div
        if (getEbyTagName(content, 'div').length == 0) {
            var div1 = document.createElement('div');
            div1.innerHTML = content.innerHTML;
            content.innerHTML = "";
            content.appendChild(div1);
        } else {
            var index = content.innerHTML.indexOf("<div>");
            var txt = content.innerHTML.substr(0, index);
            //判断txt 时候为空 如果为空 这不创建盒子 都这创建盒子
            if (txt != "") {
                //创建一个div
                var div2 = cj('div');
                div2.innerHTML = txt;
                //获取到第一个div 的位置
                content.insertBefore(div2, getEbyTagName(content, 'div')[0]);
                //移除掉前面裸露的文字
                content.innerHTML = content.innerHTML.substring(index);
            }
        }
        // 获取到文本框中所有的div
        //延时定时器
        setTimeout(function() {
            if (btn3.checked == true) {
                var divs = content.getElementsByTagName('div');

                // 遍历每个div 前面添加空格
                var kongge = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                for (var i = 0; i < divs.length; i++) {
                    var item = divs[i];
                    var div = cj('div');
                    div.style.lineHeight = "25px";
                    div.style.fontSize = "14px";
                    div.style.fontFamily = "Microsoft YaHei";
                    var html = item.innerHTML;
                    html = html.replace(/(&nbsp;)|(^\s+)|(\s+$)/ig, "");
                    
                    div.innerHTML = kongge + html;
                    x.appendChild(div);
                }
            } else {
                var divs = content.getElementsByTagName('div');
                var kongge = "";
                for (var i = 0; i < divs.length; i++) {
                    var item = divs[i];
                    var div = cj('div');
                    var html = item.innerHTML;
                    html = html.replace(/(&nbsp;)|(^\s+)|(\s+$)/ig, "");
                    div.innerHTML = kongge + html;
                    // div.innerHTML=kongge+item.innerHTML;
                    x.appendChild(div);
                }
            }

        }, 100);

        box.appendChild(x);
    });
}


//创建编辑的容器
function createE(parent) {
    //容器宽度
    var text_div_width = "800px";
    //容器最小高度
    var text_div_minheight = "300px";
    var str = "";
    str = '<div id="txtBox" style="user-modify:read-write; padding:10px; width:' + text_div_width + '; min-height:' + text_div_minheight + ';" contenteditable="true"></div>';
    str += '';
    parent.innerHTML = str;
}

//通过id获取到元素
function s(id) {
    return document.getElementById(id);
}
//创建元素节点
function cj(element) {
    return document.createElement(element);
}
//通过元素的标签名 获取到元素节点
function getEbyTagName(parent, name) {
    return parent.getElementsByTagName(name);
}