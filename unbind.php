<?PHP

require_once ('common.php');

/**
 * 使用方法：http://api.yfway.com/apns/unbind.php?username={$username}&deviceuid={$deviceuid}
 *  注销设备
 */
function unregister() {
	// if (!isset($_GET["deviceuid"]) && !isset($_GET["username"])) {
	// _debug("deviceuid and username are needed!");
	// }
	if (!isset($_GET["deviceuid"])) {
		_debug("deviceuid and username are needed!");
	}
	$deviceuid = $_GET["deviceuid"];
	$username = "";
	if (isset($_GET["username"])) {
		$username = $_GET["username"];
	}
	_L("unregister", "[unregister]username=$username\ndeviceuid=$deviceuid");
	$device = new Device();
	$uid = 0 ;
	if ($username != "") {
		$user = new User();
		$uid = $user -> get_userid($username);
	}
	if ($device -> unregister($uid, $deviceuid)) {
		ajaxReturn(null, "success", 1);
	} else {
		ajaxReturn(null, "error", 0);
	}

}

unregister();
?>
