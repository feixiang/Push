$(document).ready(function() {
    setDatePicker();
});
function setDatePicker()
{
    var day = getDate();
    $("#dateinput").val(day);
    $('.datepicker').datepicker();
    roomfb_search();
}

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
function roomfb_search()
{
    //获得表单内容
    var post_str = $('form').serialize();
    var url = "?s=LogUserFeedback/roomList&" + post_str;
    $("#roomList").attr("src", url);
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
