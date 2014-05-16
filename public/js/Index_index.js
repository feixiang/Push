// INDEX JS

var yloc_name = ".right_box";

var menuYloc = null;

$(document).ready(function(){
	
	menuYloc = parseInt($(yloc_name).css("top").substring(0,$(yloc_name).css("top").indexOf("px")));
	$(window).scroll(function () { 
		offset = menuYloc+$(document).scrollTop()+"px";
		$(yloc_name).css("top",offset);
	});
	
	$("#select_price div[rel]").click(function(){
		$("#select_price div[rel]").removeClass("cur");
		$(this).addClass("cur");
		getSelect();
	});
	$("#select_time div[rel]").click(function(){
		$("#select_time div[rel]").removeClass("cur");
		$(this).addClass("cur");
		getSelect();
	});
	$("#select_style div[rel]").click(function(){
		$("#select_style div[rel]").removeClass("cur");
		$(this).addClass("cur");
		getSelect();
	});
	$("#select_bz div[rel]").click(function(){
		$("#select_bz div[rel]").removeClass("cur");
		$(this).addClass("cur");
		getSelect();
	});
	$("#select_brand div[rel]").click(function(){
		$("#select_brand div[rel]").removeClass("cur");
		$(this).addClass("cur");
		getSelect();
	});
	
	//setStep(2);
});



var filter_obj = ["#select_price", "#select_time", "#select_style", "#select_bz", "#select_brand"];

//ɸѡ
function getSelect(){
	var filter = new Array(filter_obj.length);
	/*
	if($("#select_price div.cur").length > 0) filter[0] = $("#select_price div.cur").attr("_rel");
	else filter[0] = "";

	if($("#select_time div.cur").length > 0) filter[1] = $("#select_time div.cur").attr("_rel");
	else filter[1] = "";

	if($("#select_style div.cur").length > 0) filter[2] = $("#select_style div.cur").attr("_rel");
	else filter[2] = "";

	if($("#select_bz div.cur").length > 0) filter[3] = $("#select_bz div.cur").attr("_rel");
	else filter[3] = "";
	
	if($("#select_brand div.cur").length > 0) filter[4] = $("#select_brand div.cur").attr("_rel");
	else filter[4] = "";
	
	var _order = $("#roomListFrame").contents().find(".order dd.cur").attr("_rel");
	filter[5] = _order;
	*/
	for(var i = 0; i < filter_obj.length; i ++){
		var _obj = $(filter_obj[i]);
		if(_obj.find("div.cur").length > 0) filter[i] = _obj.find("div.cur").attr("_rel");
		else filter[i] = "";
	}
	var _order = $("#roomListFrame").contents().find(".order dd.cur").attr("_rel");
	filter[5] = _order;
	
	var filt = filter.join("|");
	
	var by = $("#roomListFrame").contents().find(".order dd.cur").attr("_by");
	$.cookie("bzname", filt);
	var url = "?s=SearchRoom/roomList&aid=" + aid + "&by=" + by;
	$("#roomListFrame").attr("src",url);
}

/* ��ʾ������������ */
function setHeadMaxRoomCount(n){
	if($("#head_count").html() == "")$("#head_count").html(n);
}


/** ����Ĭ��ɸѡ�� **/
function setDefaultSelect(filter){
	var filter_arr = filter.split("|");
	if(filter_arr.length == 6){
		for(var i=0; i<filter_obj.length; i++){
			var _obj = $(filter_obj[i]);
			if(_obj.length > 0) {
				_obj.find("div[_rel='" + filter_arr[i] + "']").addClass("cur");
			}			
		}
	}else{
		for(var i=0; i<filter_obj.length; i++){
			var _obj = $(filter_obj[i]);
			if(_obj.length > 0) {
				_obj.find("div[_rel='null']").addClass("cur");
			}			
		}
	}
}