<?PHP

require_once ('common.php');

/**
 *  注销设备
 */
function unregister() {
	if (!isset($_GET["deviceuid"])) {
		debug_error("deviceuid is needed!");
	}
	// 注册设备
	$deviceuid = $_GET["deviceuid"];
	L("[unbind]deviceuid=$deviceuid");
	$device = new Device();
	if ($device -> unregister($deviceuid)) {
		ajaxReturn(null, "success", 1);
	} else {
		ajaxReturn(null, "error", 0);
	}
}

unregister();
?>
