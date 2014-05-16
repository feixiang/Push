// INDEX roomList JS


var show_model = $.cookie('yf_mobiApi_showModel');

/**
*	
*/
function setShowModel(model){
	if(!model) show_model = 0;
	else show_model = model;
	
	$.cookie('yf_mobiApi_showModel', show_model);
	
	$(".plist li").each(function(){
		var simg1 = $(this).attr("_xg_file");
		var simg2 = $(this).attr("_jpg_file");
		
		var img_obj = $(this).find(".p-img img");
		img_obj.attr("src", img_obj.attr("lazy_img"));
	});
	
	$("img.lazy").lazyload({
		data_attribute : ""+show_model,
		effect : "fadeIn"
	});
	
	$(".moder div[_show_model]").removeClass("cur");
	$(".moder div[_show_model=" + show_model + "]").addClass("cur");
	
	if(show_model == 1){
		$(".plist li .info .def").show();
		$(".plist li .info .def2").hide();
	}else {
		$(".plist li .info .def").hide();
		$(".plist li .info .def2").show();
	}
}

$(document).ready(function(){
	
	setShowModel(show_model);
	
	if($(".order dd[_set]").length > 0){
		var set_obj = $(".order dd[_set]");
		set_obj.addClass("cur");
		if(set_obj.find("A").hasClass("ad")){
			var _set = set_obj.attr("_set");
			if(_set == "DESC") 
				set_obj.find("A i").addClass("add");
				set_obj.attr("_by", _set);
		}
	}
	
	$(".plist li").hover(
		function () {
			parent.setShowRoom($(this));
			$(".plist li").removeClass("cur");
			$(this).addClass("cur");
		},
		function () {
		}
	);
	
	
	if($(".plist li").length > 0){
		parent.setShowRoom($(".plist li:first"));
		$(".plist li").removeClass("cur");
		$(".plist li:first").addClass("cur");
	}

	$(".plist li .btn-use").click(function() {
        //alert("请在软件上使用此功能");
        var _cloudId = $(this).attr("_coludId");
        var _value = $(this).attr("_value");
        var li_obj = $(".plist li[_CloudID=" + _cloudId + "]");

        setRoomPingjia( li_obj , li_obj.attr("_CloudID"), _value);
		/**房间评价改变**/
		function setRoomPingjia(_obj, _cloudID , _val)
		{
			var url = "?s=SearchRoom/updataUsePingjia";
			var query = "cloudID=" + _cloudID +'&value=' + _val ; 
			$.ajax({
				type: "GET",
				url: url,
				dataType: "json",
				data: query,
				success: function(data) {
					if (data.status == 1) {
						var val = data.data.pingjia;
						_obj.find(".pingjia").html(val);
					}
				},
				error: function() {
					alert("error");
				}
			});
		}
		//同步更新新居网数据库
        var url = "?s=SearchRoom/getCloudArr";
        var idArr = '';
        var fulldate = '';
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: "json",
            data: "cloudID=" + _cloudId,
            success: function(data) {
                for (var i = 0; i < data.data.length; i++)
                {
                    if (i != data.data.length - 1)
                    {
                        idArr += data.data[i]['CloudID'] + ',';
                    } else {
                        fulldate = data.data[i]['writetime'];
                        idArr += data.data[i]['CloudID'];
                    }

                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //alert(errorThrown);
            }
        });

        //接口34:评价返回
        var baseUrl = "http://pp.yfway.com/api.php"
        var params = "type=34&pingjia_dengji="+_value+"&date="+fulldate+"&ids="+idArr;
        
        //console.log(params);
        
        $.ajax({
            type: "GET",
            url: baseUrl,
            dataType: "json",
            data: params,
            success: function(data) {
                //alert('success');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //alert(errorThrown);
            }
        });

        //parent.setRoomUse(li_obj.attr("_CloudID"), li_obj);
    });

	$(".p-img img").click(function(){
		if($(this).attr("_CloudID")){
			var url = "?s=RoomView/index&cloudID=" + $(this).attr("_CloudID");
			parent.webTo(url);
		}
	});
	
	$(".order dd").click(function(){
		if($(this).find("a").hasClass("ad")){
			$(this).find("a i").addClass("order_icon");
			if($(this).hasClass("cur")){
				var _by = $(this).attr("_by");
				if(_by == "ASC") {
					$(this).attr("_by","DESC");
					$(this).find("a i").addClass("add");
				}else {
					$(this).attr("_by","ASC");
					$(this).find("a i").removeClass("add");
				}
			}
		}
		$(".order dd").removeClass("cur");
		$(this).addClass("cur");
		parent.getSelect();
	});
	
	$(".moder div[_show_model]").click(function(){
		var _model = $(this).attr("_show_model");
		setShowModel(_model);
	});
	
});

