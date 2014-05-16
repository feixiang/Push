// Main JS

//~{75;XIOR;R3~}
function history_back(){
	history.go(-1);
}

function setShowRoom(li_obj){
	var _style = li_obj.attr("_style");
	var _price = li_obj.attr("_price");
	var _type = li_obj.attr("_type");
	var _time = li_obj.attr("_writetime");
	var _s_area = li_obj.attr("_s_area");
	var _jpg_file = li_obj.attr("_jpg_file");
	var _xg_file = li_obj.attr("_xg_file");
	
	$("#mt_img_f1").attr("src",_xg_file);
	$("#mt_img_f2").attr("src",_jpg_file);
	$("#mt_type").html(_type);
	$("#mt_time").html(_time);
	$("#mt_s_area").html(_s_area);
	$("#mt_price").html("~{#$~}" + _price);
	$("#mt_style").html(_style);
}

function resetHeight(){
	var _child_height = $("#roomListFrame").contents().find("#container").height();
	$("#roomListFrame").height(_child_height);
}

function fnIsOurCustomBrowser()
{
	// ~{<lQiJG7qJGWT6(Red/@@FwNRCGV;SC5wSC:/J}~}
	// CB_IsOurCustomBrowser~{?4JG7q?IRT;q5C~}.
	// ~{2;4x~}()~{1mJ>JtPT5wSC~},~{?IRT<lQi:/J}JG7qTZMb2?40?Z~}
	// ~{75;X~}null~{1mJ>2;JGWT6(Re40?Z~},~{75;X~}false
	if(window.external.CB_IsOurCustomBrowser != null)
	{
		return true;
	}
	else
	{
		return false;
	}
}

// ~{SCR;8v1dA?<lQiJG7qJGWT6(Red/@@Fw~}.
bIsCustomBrowser = fnIsOurCustomBrowser();

function fnClose()
{
	// ~{9X1UVw40?Z~}
	if(bIsCustomBrowser)
	{
		window.external.CB_Close();
	}
}

function fnApplySpCloudPlan(_style, _mrsk, _koc, _yunzs_nr, _yunzs_name)
{
	if(bIsCustomBrowser)
	{
		window.external.CB_SP_GetCloudPlanData(_style, _mrsk, _koc, _yunzs_nr, _yunzs_name);
	}
}
