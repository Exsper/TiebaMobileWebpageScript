// ==UserScript==
// @name         百度网页手机贴吧工具
// @namespace    https://github.com/Exsper/
// @version      0.3
// @description  网页手机贴吧解锁被隐藏的帖子（不包含楼内回复）；移除帖内广告楼层；推荐帖子改直链；切换到旧版贴吧
// @author       Exsper
// @match        https://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/f?kz=*
// @match        https://tieba.baidu.com/mo/*/m?kz=*
// @grant        none
// @run-at       document-end
// ==/UserScript==


//TODO
//旧版贴吧返回新版贴吧

var $ = window.$;

var useOldUrl = true; //热门帖子推荐链接使用旧版贴吧
var oldPageUrl = "/mo/q-0--%3AFG%3D1-sz%40320_1004%2C-1-3-0--1--wapp/m?kz=";

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


//更改新版贴吧界面
function newPageHelper(tid) {
    //添加旧版页面通道
    $(".operation-items.clearfix").prepend($('<li><a href="'+location.origin + oldPageUrl + tid+'"><div class="img-wrapper"><span class="jump"></span></div><p>转到旧版</p></a></li>'));
    //删除下载app按钮
    $(".father-cut-daoliu-normal-box").remove();
    //显示被隐藏的楼层
    $(".class_hide_flag").removeClass("class_hide_flag");
    //显示换页按钮
    addGlobalStyle('.father-cut-pager-class-no-page>#list_pager { visibility:visible!important }');
    //移除广告楼层
    $("#pblist").children("li:not([data-info])").remove();
    //移除漂浮广告
    $(".fixed_bar").remove();
    //页面下方热门帖子链接改直链
    $(".father-cut-recommend-normal-box").unbind();
    var $hotRecommend = $(".pb_cut_hot_recommend_content.j_recommend_item");
    $hotRecommend.each(function(i, hr) {
        hr.setAttribute("target", "_blank");
        if (useOldUrl) hr.setAttribute("href", location.origin + oldPageUrl + hr.getAttribute("data-tid"));
        else hr.setAttribute("href", location.origin + "/p/" + hr.getAttribute("data-tid"));
    });
}


function UrlDecode(str){
    function asc2str(s){
        return String.fromCharCode(s);
    }
    var ret="";
    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        if(chr == "+"){
            ret+=" ";
        }else if(chr=="%"){
            var asc = str.substring(i+1,i+3);
            if(parseInt("0x"+asc)>0x7f){
                ret+=asc2str(parseInt("0x"+asc+str.substring(i+4,i+6)));
                i+=5;
            }else{
                ret+=asc2str(parseInt("0x"+asc));
                i+=2;
            }
        }else{
            ret+= chr;
        }
    }
    return ret;
}

//更改旧版贴吧界面
function oldPageHelper(tid) {
    //旧版网页图片链接改成原图链接
    var imgs = document.querySelectorAll(".BDE_Image");
    for (var i = 0; i < imgs.length; ++i) {
        imgs[i].parentElement.href = UrlDecode(imgs[i].src.split("src=")[1]);
    }
}



function main() {
    console.log("t");
    if (location.href.indexOf("/p/") > 0) newPageHelper(location.href.split("/p/")[1].split("?")[0]);
    else if (location.href.indexOf("f?kz=") > 0) newPageHelper(location.href.split("kz=")[1].split("&")[0]);
    else if (location.href.indexOf("m?kz=") > 0) oldPageHelper(location.href.split("kz=")[1].split("&")[0]);
}


//window.onload = function(){
    main();
//}

