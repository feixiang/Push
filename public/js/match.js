//初始化
$(function() {
    //getStartCloudID("#CloudID");
})
function clearFilter() {
    $("#filter").hide();
}
function showFilter() {
    $("#filter").fadeIn();
}
function setFilter(target, array)
{
    var html = "";
    $.each(array, function(i, item) {
        html += "<li item='" + item + "'><a>" + item + "</a></li>";
    });
    $(target).html(html);
}
var base_angle = 0; // 定义全局的angle，让其他图片根据核心库旋转 
function showMatchResult(rs, data) {
    clearDebug();
    clearFilter();

    var style = [], kocwritetime = [];
    var html = "<div class='row-fluid margin40'><ul class='thumbnails' id='matchrs'>";
    // $(rs).html(d);
    if (data.status == 1) {
        if (data.data != null) {
            var data_tmp = data.data.data;
            $.each(data_tmp, function(i, item) {
                // 第一个是 核心库的信息  , 以核心库的角度为基准，进行旋转
                // 这里需要将图片旋转一下,使用css3的图片旋转 transform:rotate(deg)
                var rotate = Math.round((item.fAngleStart - base_angle) / Math.PI * 180);
                var rotateStyle = "-webkit-transform:rotate(" + rotate + "deg)";
                var width = 0, height = 0;
                if (rotate == 90 || rotate == -90 || rotate == 270 || rotate == -270) {
                    width = item.height;
                    height = item.width;
                } else
                {
                    width = item.width;
                    height = item.height;
                }
                html += "<li class='span3 center' id='" + item.CloudID + "'>" +
                        "<a target='_blank' href='?s=/RoomPlan/roomDetail/CloudID/" + item.CloudID + "/'>" +
                        "<div class='thumbnail center'>" +
                        "<img style='max-height:226px;" + rotateStyle + "'  src='" + koc_home + item.jpg_file + "' title='ID:" + item.CloudID + "'>" +
                        "</a>" +
                        "<p>" + width + "X" + height + "</p><p>匹配度：" + item.fMatchValue + "</p><p>带柱子匹配度：" + item.fMatchValueAdd + "</p></div></li>";

                if (-1 == $.inArray(item.style, style))
                    style.push(item.style);
                var s_period_timestamp = (item.s_period);
                if (-1 == $.inArray(s_period_timestamp, kocwritetime))
                    kocwritetime.push(s_period_timestamp);

            });
            html += "</ul></div>";
            $(rs).html(html);
            //过滤条件
            setFilter("#room_style", style);
            setFilter("#kocwritetime", kocwritetime);
            showFilter();

            //initPagination();
        } else {
            $(rs).html("没有找到匹配结果");
        }
    } else {
        $(rs).html("没有找到匹配结果");
    }
    debug(data.message);
}

// 这里有文件上传，所以需要使用FormData
function match(url, rs)
{
    $(rs).html("");
    $("#debug").html("");
    var formData = new FormData();
    //还可以这样
    // var formData = new FormData($("#match-form"));
    var room_type_tmp = $("#room_type option:selected").val();
    var room_type = room_type_tmp.split("|");

    //文件
    var file = $("#fileInput").get(0).files[0];
    if (room_type.length < 1 || room_style == "" || file == null)
            //if( room_type.length < 1)
            {
                alert("请填写完整信息");
                return;
            }
    formData.append('room_type', room_type[0]);
    formData.append('room_type2', room_type[1]);
    formData.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function() {

        var data = this.response;
        var result = $.parseJSON(data);
        //$(rs).html(data);
        showMatchResult(rs, result);
    };

    xhr.upload.onprogress = function(event) {
        loading(rs);
    }
    xhr.onerror = function() {
        $(rs).html("没有找到匹配结果");
    };
    xhr.send(formData);
}
// 这里使用CloudID进行匹配，更简单点
function matchByID(url, rs)
{
    loading(rs);

    var room_type_tmp = $("#room_type2 option:selected").val();
    var room_type = room_type_tmp.split("|");
    var room_type2 = room_type[1];
    var CloudID = $("#CloudID").val();
    if (room_type2 == "" || CloudID == "") {
        alert("请填写完整信息");
        return;
    }
    previewkoc('?s=Public/getRoomByCloudId', '#preview');

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: {
            CloudID: CloudID,
            room_type2: room_type2
        },
        success: function(data) {
            showMatchResult(rs, data);
        }
    });
}


// 这里使用CloudID进行匹配，更简单点
var preCloudID = 0;
function previewkoc(url, rs)
{
    var CloudID = $("#CloudID").val();
    if (CloudID == "") {
        alert("请填写完整信息");
        return false;
    }
    if (preCloudID == CloudID)
        return false;
    preCloudID = CloudID;
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: {
            CloudID: CloudID
        },
        success: function(d) {
            var html = "";
            //$(rs).html(d);
            if (d.status == 1) {
                if (d.data != null) {
                    var item = d.data;
                    html = "<a target='_blank' href='?s=/Roominfo/roomDetail/CloudID/" + item.CloudID + "/'>" +
                            "<div class='thumbnail center'>" +
                            "<img style='max-height:226px;' src='" + koc_home + item.jpg_file + "' title='ID:" + item.CloudID + "'>" +
                            "</a>" +
                            "<p>" + item.width + "X" + item.height + "</p>";

                    base_angle = item.fAngleStart;
                }
                $(rs).html(html);
            }
            else {
                $(rs).html("<em>没有找到该CloudID的信息</em>");
            }
        }
    });
}
//function getStartCloudID(input)
//{
//    var url = "?s=Match/getStartCloudID";
//    getDataAjax(url, null, onDataReceived);
//    function onDataReceived(data) {
//        $(input).val(data);
//    }
//}

var isLoading = 0;
function initRoomStyleClick()
{
    var filter_url = "?s=Match/matchfilter";
    rs = "#rs";
    $("#room_style > li").on("click", function()
    {
        if (isLoading == 0) {
            loading(rs);
            isLoading = 1;
            $("#room_style > li.active").removeClass("active");
            $(this).addClass("active");
            var room_style = $(this).attr("room_style");
            matchfilter(filter_url, rs, room_style);
        }
        else {
            alert("请稍候...");
        }
    });
}

function matchfilter(url, rs, room_style)
{
    $.ajax({
        type: "GET",
        data: {
            room_style: room_style
        },
        url: url,
        dataType: "json",
        success: function(data) {
            //$(rs).html(data);
            isLoading = 0;
            var result = data.result, html = "";
            if (result != 0) {
                $(rs).html("<em>找到" + result + "个结果</em>");
                for (var i = 0; i < result; ++i) {
                    var ids = data.ids;
                    html += getRoomData(ids[i]);
                }
                $(rs).html(html);
            } else {
                $(rs).html("<em>没有找到匹配结果</em>");
            }
        },
        error: function(xhr, status) {
            $(rs).html("return:<br />" + xhr.responseText);
        }
    });

}

function matchPlanTest(url)
{
    var CloudID = $("#CloudID").val();
    if (CloudID == "") {
        alert("请填写完整信息");
        return false;
    }
    window.open( url + "/CloudID/"+CloudID) ; 
}

