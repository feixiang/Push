// 这里对当前页面导航高亮
$(function() {
    setHover();
    init_nav_search()
});
/**
 * 全局变量定义
 */
var _debug = 1;
var koc_home = "http://cloud.yfway.com/resource/newimages/";

function init_nav_search()
{
    $("#navbt_search").click(function() {
        var CloudID = $("#navsearch_input").val();
        if (CloudID == "")
            return false;
        var query = "?s=Public/roomDetail/CloudID/" + CloudID + "/";
        window.location.href = query;
    });
}

function setHover()
{
    var url = document.URL;
    var href = "";
    if (url.search("s=") == -1)
    {
        $("#home_nav > li").first().addClass("active");
        return false;
    }
    $("#home_nav > li").each(function() {
        href = $(this).find("a").attr("href");
        var address = href.split("=")[1];
        if (address != null) {
            // 这里用正则判断一下地址
            if (url.search(address) != -1)
            {
                $(this).addClass("active");
                return false;
            }
        }
    });
}
function loading(rs) {
    $(rs).html("<img src='../Public/img/loading.gif' />");
}
function loading_ok(rs) {
    $(rs).html("");
}
function clearDebug() {
    $("#debug").empty();
}
function debug(msg) {
    if (_debug)
        $("body").append(msg);
}
function showTips(msg) {
    $('#tips').html(msg);
    $('#tips').fadeIn();
}
function _tips(msg){
    $('#tips').html(msg);
    $('#tips').fadeIn();
    setTimeout("hideTips()",2000);
}
function hideTips() {
    $('#tips').fadeOut();
}
function disableBt(obj , text) {
    $(obj).html(text);
    $(obj).addClass("disabled");
}
function enableBt(obj,text) {
    if ($(obj).hasClass("disabled")) {
        $(obj).removeClass("disabled");
        $(obj).html(text);
    }
}
/**
 * 重置iframe高度
 * @returns {undefined}
 */
function resetHeight() {
    var iframe_height = $("iframe:eq(0)").contents().find("body").height() + 30;
    $("#iframe").height = iframe_height;
}


/**
 * 异步获取数据
 * @param {type} url
 * @param {type} options
 * @param {type} callback 回调函数处理数据
 */
function getDataAjax(url, options, callback)
{
    $.ajax({
        url: url,
        type: "GET",
        data: options,
        dataType: "json",
        success: callback,
        error: function(xhr, status) {
            $("body").append("status :"+ status + " <br />return:<br />" + xhr.responseText);
        }
    });
}

function addZero(number)
{
    return number < '10' ? (number = '0' + number) : number;
}

function getDate()
{
    var mydate = new Date();
    var time = mydate.getFullYear() + "-" + addZero((mydate.getMonth() + 1)) + "-" + addZero(mydate.getDate());
    return time;
}
function getMonth()
{
    var date = new Date();
    return date.getMonth() + 1;
}

function setDatePicker()
{
    var day = getDate();
    $("#dateinput").val(day);
    $('.datepicker').datepicker({
        autoclose: true
    });
}

