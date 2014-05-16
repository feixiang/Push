//初始化
$(function() {
    //getStartCloudID("#CloudID");
})
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

function matchPlanTest(url)
{
    var CloudID = $("#CloudID").val();
    if (CloudID == "") {
        alert("请填写完整信息");
        return false;
    }
    window.open( url + "/CloudID/"+CloudID) ; 
}

/**
 * 核心库匹配
 * @param {type} url
 * @returns {undefined}
 */
function matchCore(url){
    var CloudID = $("#CloudID").val();
    if (CloudID == "") {
        alert("请填写完整信息");
        return false;
    }
    window.open( url + "/CloudID/"+CloudID) ; 
}

