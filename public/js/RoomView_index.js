// 


$(document).ready(function()
{
	$(".roomView .box").click(function()
	{
		$(".roomView .box").removeClass("cur");
		$(this).addClass("cur");
		$("#showimg").attr("src",$(this).attr("_xg_file"));

		setShowRoom($(this));
	});
	$(".roomView .box:first").click();
	
	var $cur = 1;
	var $num = 4;
	var $len = $('.roomView .con .box').length;
	var $pagecount = Math.ceil($len / $num);
	var offset = $('.roomView .con').width();
	
	$(".roomView .right_btn").click(function(){
		if (!$(".roomView table").is(':animated')) {
			if($cur < $pagecount){
				$(".roomView table").animate({marginLeft:'+=' + (-1*offset)});
				$cur ++;
			}
		}
	});
	$(".roomView .left_btn").click(function(){
		if (!$(".roomView table").is(':animated')) {
			if ($cur > 1) {
				$(".roomView table").animate({marginLeft:'+=' + (1*offset)});
				$cur --;
			}
		}	
	});

	$(".btn-use").click(function(){
		var li_obj = $(".roomView div.box.cur");
		
		//var _style = li_obj.attr("_style");
		//var _style = $("#style_select").val();
		//var _koc = li_obj.attr("_koc");
		//var _mrsk = li_obj.attr("_mrsk");
		//var _yunzs_name = li_obj.attr("_yunzs_name");
		//var _yunzs_nr = li_obj.attr("_yunzs_nr");

		//fnApplySpCloudPlan(_style, _mrsk, _koc, _yunzs_nr, _yunzs_name);
		setRoomUse(coludid);
	});
	
	$("#use-btn").click(function(){
		var li_obj = $(".roomView div.box.cur");
		
		//var _style = li_obj.attr("_style");
		//var _koc = li_obj.attr("_koc");
		//var _mrsk = li_obj.attr("_mrsk");
		//var _yunzs_name = li_obj.attr("_yunzs_name");
		//var _yunzs_nr = li_obj.attr("_yunzs_nr");

		//fnApplySpCloudPlan(_style, _mrsk, _koc, _yunzs_nr, _yunzs_name);
		setRoomUse(coludid);
	});
	
	$("#use-btn2").click(function(){
		var li_obj = $(".roomView div.box.cur");
		
		//var _style = li_obj.attr("_style");
		//var _style = "";
		//var _koc = li_obj.attr("_koc");
		//var _mrsk = li_obj.attr("_mrsk");
		//var _yunzs_name = li_obj.attr("_yunzs_name");
		//var _yunzs_nr = li_obj.attr("_yunzs_nr");

		//fnApplySpCloudPlan(_style, _mrsk, _koc, _yunzs_nr, _yunzs_name);
		setRoomUse(coludid);
	});

	$("#btn-back").click(function(){
		history_back();
	});
});