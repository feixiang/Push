$(document).ready(function() {
    parent.scrollTo(0, 0);

    $("img.lazy").lazyload({
        effect: "fadeIn"
    });
});
function set_core(){
    var url = $(this).attr("href") ;
    
}

function jump_to()
{
    var p = $("#input_page_jump").val();
    if (p < 0)
    {
        alert('请填写正确的页数');
        return false;
    }
    parent.jump_to(p);
}

//跳转到新的统计窗口
function getReport()
{
    var post_str = $('form', window.parent.document).serialize();
    var search_date = $("#dateinput", window.parent.document).val();
    var url = '?s=/RoomList/getReport/searchdate/' + search_date + '&' + post_str;
    window.open(url);
}

//反馈按钮
function room_feedback(obj)
{
    var cloud_id = $(obj).attr('CloudID');
    var slevel = $(obj).attr('level');

    var url = "?s=/RoomList/room_feedback/CloudID/" + cloud_id + "/level/" + slevel;

    //初始化评论对话框
//    initComment(cloud_id);

    var status;

    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            var msg = data.message;
            parent.showTips(msg);
            $(obj).css('color', 'red');
            $('a[CloudID=' + cloud_id + '][level=' + revlevel + ']').css('color', 'black');
            status = data.status;
            var revlevel = (slevel == 1 ? 2 : 1);

            if (status == 1)
            {
                $(obj).css('color', 'red');
                $('a[CloudID=' + cloud_id + '][level=' + revlevel + ']').css('color', 'black');
            }
        }
    });

}

function initComment(cloud_id)
{
    $('#optionsRadios3', window.parent.document).attr('checked', true);
    $('input[name="inlineCheckbox"]', window.parent.document).each(function() {
        $(this).attr('checked', false);
    });
    $('#commit_content', window.parent.document).val('');


    $('#pcomment', window.parent.document).attr("CloudID", cloud_id);
    $('#myModal', window.parent.document).modal();
}

//提交评论
function postcomment(obj)
{
    var cloud_id = $(obj).attr('CloudID');
    var mark_val = $('input[name="optionsRadios"]:checked', window.parent.document).attr('value');
    var mark_reasion = '';

    $('input[name="inlineCheckbox"]:checked', window.parent.document).each(function() {
        mark_reasion += $(this).attr('value') + ",";
    });

    if (mark_reasion.substr(mark_reasion.length - 1, 1) == ',')
    {
        mark_reasion = mark_reasion.substr(0, mark_reasion.length - 1);
    }

    var comment = $('#commit_content', window.parent.document).val();
    if (comment != '')
    {
        mark_reasion += ',' + comment;
    }

    var url = '?s=/RoomList/addComment/';

    $.ajax({
        url: url,
        dataType: 'json',
        data: {
            CloudID: cloud_id, //匹配率请求数
            mark_val: mark_val,
            mark_reasion: mark_reasion
        },
        success: function(data) {
            $('#myModal', window.parent.document).modal("hide");
            var msg = data.info;
            parent.showTips(msg);
        }
    });
}

function ajax_roomList() {
    var tpl = "<td>{{data.CloudID}}</td>" +
            "<td><a target='_blank' href='?s=Public/roomDetail/CloudID/{{data.CloudID}}/'>" +
            "        <img class='table-img' src='"+koc_home+"{{data.jpg_file}}' alt='{{data.CloudID}}' title='ID:{{data.CloudID}}' /> " +
            "    </a>" +
            "</td>" +
            "<td>" +
            "    <a target='_blank' href='?s=Public/roomDetail/CloudID/{{data.CloudID}}/'>" +
            "        <img class='table-img' src='"+koc_home+"{{data.xg_file}}' alt='{{data.CloudID}}' title='ID:{{data.CloudID}}' />" +
            "    </a>" +
            "</td>" +
            "<td>" +
            "    <table>" +
            "        <tr><td>匹配度</td><td>{{data.fMatchValue}}</td></tr>" +
            "        <tr><td>核心库</td><td>{{data.CoreID}}</td></tr>" +
            "        <tr><td>参考方案库数量</td><td>{{data.plancnt}}</td></tr>" +
            "        <tr><td>操作</td>" +
            "            <td>" +
            "                <a target='_blank' href='?s=SearchRoom/search_ex/CloudID/{{data['CloudID']}}/' >扩展匹配</a>" +
            "                <a target='_blank' href='?s=SearchRoom/index/CloudID/{{data['CloudID']}}/' >匹配</a>" +
            "            </td>" +
            "        </tr>" +
            "    </table>" +
            "</td>" +
            "<td>" +
            "    <table>" +
            "        <tr><td>{{data.caiji_cat|get_caiji}}</td></tr>" +
            "        <tr><td>{{data.suohao}}</td></tr>" +
            "        <tr><td>{{data.soft_version}}</td></tr>" +
            "        <tr><td><a href='"+koc_home+"{{data.SubPath}}'>下载koc</a></td></tr>" +
            "        <tr>" +
            "            <td>" +
            "                <a onClick='room_feedback(this)' CloudID='{{data.CloudID}}' level='1'>满意</a>" +
            "                <a onClick='room_feedback(this)' CloudID='{{data.CloudID}}' level='2'>不满意</a>" +
            "            </td>" +
            "        </tr>" +
            "    </table>" +
            "</td>" +
            "<td>" +
            "    <table>" +
            "        <tr><td>品牌</td><td>{{data.pinpai}}</td></tr>" +
            "        <tr><td>类型</td><td>{{data.type}}</td></tr>" +
            "        <tr><td>风格</td><td>{{data.style}}</td></tr>" +
            "        <tr><td>面积</td><td> {{data.area}}</td></tr>" +
            "        <tr><td>墙数</td><td> {{data.WallNum}}</td></tr>" +
            "    </table>" +
            "</td>" +
            "<td>" +
            "    <table>" +
            "        <p>{{data.post_date}}</p>" +
            "        <tr><td>IP</td><td>{{data.ip}}</td>" +
            "        </tr>" +
            "        <tr><td>地区</td><td>{{data.ip_area}}</td></tr>" +
            "    </table>" +
            "</td>";
    var target = $(".roomList > tr");
    var html = yflib_roomList(_yf_RoomFunc.getRoomAllByID, target, tpl);
}