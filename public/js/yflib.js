/**
 * description   : yflib 通用函数
 * create : 2013年10月31日
 * author : feixiang
 */

/**
 * 定义全局变量
 *     一些常用的房间信息api
 */
_yf_RoomApi = {
    "roomDetail": "?s=Api/getRoomDetailByID",
    "roomAll": "?s=Api/getRoomAllByID",
}
_yf_RoomTpl = {
    "obj": "data",
    "key": "CloudID"
}
_yf_RoomFunc = {
    "getRoomDetailByID": getRoomDetailByID,
    "getRoomAllByID": getRoomAllByID,
}


/**
 * 解析模板算法
 *     这里先用简单的替换
 * @param {type} tpl
 * @param {type} key
 * @param {type} value
 * @returns html
 */
function yflib_tpl_parse(tpl, key, value) {
    var html = "";
    var re = new RegExp("{{\\s*" + _yf_RoomTpl.obj + "\\." + key + "\\s*}}", "g"); // \ 在双引号里面需要转义
    html = tpl.replace(re, value);
    return html;
}
/**
 * ajax获取房间信息 —— 通用函数
 * @param {type} url
 * @param {type} context 当前对象上下文
 * @param {type} CloudID
 * @param {type} callback 回调函数处理数据
 * @returns {undefined}
 */
function getRoomByID(url, context, CloudID, callback) {
    $.ajax({
        context: context, //传入上下文变量
        url: url,
        data: {"CloudID": CloudID},
        dataType: "json",
        success: callback,
        error: function(xhr, status) {
            $("body").append("status : status <br />return:<br />" + xhr.responseText);
        }
    });
}
/**
 * ajax获取房间信息
 * @param {type} context
 * @param {type} CloudID
 * @param {type} callback
 * @returns {undefined}
 */
function getRoomDetailByID(context, CloudID, callback) {
    var url = _yf_RoomApi.roomDetail;
    getRoomByID(url, context, CloudID, callback);
}
/**
 * ajax获取房间所有信息
 * @param {type} context
 * @param {type} CloudID
 * @param {type} callback 回调函数处理数据
 * @returns {undefined}
 */
function getRoomAllByID(context, CloudID, callback) {
    var url = _yf_RoomApi.roomAll;
    getRoomByID(url, context, CloudID, callback);
}

/**
 * ajax 写入房间信息 
 * @param {type} func 调用的函数
 * @param {type} target
 * @param {type} tpl
 * @returns {undefined}
 */
function yflib_roomList(func, target, tpl , callback) {
    if ( typeof func == 'function') {
        target.each(function(i, item) {
            var _this = $(this);
            var _CloudID = _this.attr(_yf_RoomTpl.key);
            func(_this, _CloudID, onDataRecieved);
        });
        if ( typeof callback == 'function') {
            callback();
        }
        function onDataRecieved(ret) {
            var data = ret.data;
            var html = tpl;
            //遍历数据集，替换模板中相应的数据项
            $.each(data, function(key, value) {
                html = yflib_tpl_parse(html, key, value);
            });
            $(this).append(html);
        }
    } else {
        alert(func + " is not a function");
        return false;
    }
}

/**
 * 例子
 */
function roomList_example() {
    //这里模板是指 target : thumbnail li 里面的内容， 这里采用angular JS的模板格式
    var tpl = "<div class=\"thumbnail center\">" +
            "<a href=\"?s=Public/roomDetail/CloudID/{{data.CloudID}}/\" target='_blank'>" +
            "<img src=\"" + koc_home + "{{data.jpg_file}}\" alt='{{data.CloudID}}' title='{{data.CloudID}}' /></a>" +
            "<p>CloudID：{{data.CloudID}}" +
            "<p>房型：{{data.WallNum}}墙{{data.DoorNum}}门{{data.WinNum}}窗</p>" +
            "<p>面积：{{data.area}} {{data.width}}X{{data.height}}</p>" +
            "</div>";
    var target = $(".roomList > li");
    var html = yflib_roomList(_yf_RoomFunc.getRoomDetailByID, target, tpl);
}