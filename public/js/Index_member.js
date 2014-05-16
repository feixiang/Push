/** 
 * <feixiang>
 * for member html 
 */

var room_type = ["主卧房", "客卧房", "儿童房", "书房", "客餐厅", "衣帽间", "其他"];
var kongjian_mianji = ["20以下", "20-30", "30-50", "50-70", "70-100", "100以上"];
var huxing = ["一居室", "一房一厅", "二房一厅", "二房二厅", "三房二厅", "其他"];
var huxing_mianji = ["60以下", "60-85", "85-150", "150-200", "200以上"];
var zhuangxiu_jiage = ["5000以下", "5000-7000", "7000-10000", "10000-15000", "15000以上"];

$(document).ready(function() {
    setRadio();
    setSelectRadio();
	setStep(1);
});
function setRadio() {
    $('input:radio').each(function() {
        var val = $(this).val();
        $(this).after(val);
    });
}

function setSelectRadio() {
    var show_rel = $('input[name="空间类型"]:radio:checked').attr("show-rel");
    $(".controls-ages").hide();
    $(".controls-ages").eq(show_rel).show();
    $(".controls-ages").eq(show_rel).find("input:radio").first().prop('checked', true);

    $('input[name="空间类型"]:radio').change(function() {
        //alert("test");
        var show_rel = $(this).attr("show-rel");
        $(".controls-ages").hide();
        $(".controls-ages").eq(show_rel).show();
        $(".controls-ages").eq(show_rel).find("input:radio").first().attr("checked", true);
    });

}
function fnNext() {
    //获得表单内容
    var post_str_tmp = $('form').serialize();

    // 先保存到服务器session里面
    var url = "?s=Web/saveClientInfo&"
    $.ajax({
        url: url + post_str_tmp,
        success: function(data) {

        }
    });

    post_str = post_str_tmp.replace(/&|=/g, "|");
    post_str += "|38组合||28衣柜||总价|0|价格详细|1^28=0^08=0^板式=0^宅配=0^|主材颜色||";
    post_str = decodeURIComponent(post_str);
    //先提交信息给软件
    fnSetClientRoomInfo(post_str);
}

function fnBack() {

}

function fnClose()
{
    // 关闭主窗口
    if (bIsCustomBrowser)
    {
        window.external.CB_SP_CloseDesignPage();
    } else {
        alert("CB_SP_CloseDesignPage");
    }
}

function fnIsOurCustomBrowser()
{
    // 检验是否是自定义浏览器我们只用调用函数
    // CB_IsOurCustomBrowser看是否可以获得.
    // 不带()表示属性调用,可以检验函数是否在外部窗口
    // 返回null表示不是自定义窗口,返回false
    if (window.external.CB_IsOurCustomBrowser != null)
    {
        return true;
    }
    else
    {
        return false;
    }
}

// 用一个变量检验是否是自定义浏览器.
bIsCustomBrowser = fnIsOurCustomBrowser();

/**
 * 格式如下：
 * 空间类型|儿童房|房价|5000-7000|户型总面积|60-85/二居室|客户姓名|1|客户电话|2|订单号||客户地址|3|客户性别|男|客户年龄|0-7|38组合||28衣柜||总价|0|价格详细|1^28=0^08=0^板式=0^宅配=0^|主材颜色||
 */
function fnSetClientRoomInfo(post_str)
{
    if (bIsCustomBrowser)
    {
        window.external.CB_SP_SetClientRoomInfo(post_str);
    }
    else
    {
        alert(post_str);
    }
}
function fnSwitchTo3D() {
    if (bIsCustomBrowser) {
        window.external.CB_SP_SwitchTo3D();
    }
    else {
        alert("CB_SP_fnSwitchTo3D");
    }
}