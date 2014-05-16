$(document).ready(function() {
    setDatePicker();
});

function getSelect() {
    var filter = new Array();
    if ($("#select_caiji div.cur").length > 0)
        filter[0] = $("#select_caiji div.cur").attr("_rel");
    else
        filter[0] = "";

    if ($("#select_pipei div.cur").length > 0)
        filter[1] = $("#select_pipei div.cur").attr("_rel");
    else
        filter[1] = "";

    var filt = filter.join("|");

    var url = "?s=RoomList/roomList&aid=" + aid + "&filter=" + filt;
    $("#roomList").attr("src", url);
}

/*
 *  这里做搜索
 *  获取表单内容，修改iframe的地址进行刷新
 */
function room_search()
{
    //获得表单内容
    var post_str = $('form').serialize();
    var url = "?s=RoomList/roomList&" + post_str;
    $("#roomList").attr("src", url);
}

/**
 * ajax获得分页导航
 * @returns {undefined}
 */
function ajax_pagination(obj, url) {
    getDataAjax(url, null, onDataReceived);
    function onDataReceived(ret) {
        if (ret.status == 1) {
            var data = ret.data;
            var total = data.total;
            var pageCount = data.pageCount;
            initPagination(obj, total, 1);
        } else {
            
        }
    }
}
function initPagination(obj, total, current) {
    var options = {
        currentPage: current,
        totalPages: total
    }
    $(obj).bootstrapPaginator(options);
}

function jump_to(p) {

    var post_str = $('form').serialize();
    var url = "?s=RoomList/roomList&" + post_str + "&p=" + p;
    $("#roomList").attr("src", url);
}

function showTips(msg) {
    $('#tips').html(msg);
    $('#tips').fadeIn();
    setTimeout(function() {
        $('#tips').fadeOut();
    }, 1000);
}
