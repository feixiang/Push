<?PHP

require_once ('common.php');

/**
 *  注册用户及设备 , 客户端初始化的时候调用
 *  如果设备存在，则更新设备信息
 *  参数：GET
 *      用户信息：
 *      username : 订单系统返回的用户名
 *      order_token    : 订单系统返回的用户的token
 *      user_id  : 百度云返回的用户唯一id
 */
function register() {
	if (!isset($_GET["device_type"])) {
		$device_list = implode(",", C("DEVICE_TYPE"));
		debug_error("device type is needed!supported:$device_list");
	}
	if (!isset($_GET["username"]) || !isset($_GET["order_token"]) || !isset($_GET["deviceuid"])) {
		debug_error("username , order_token , deviceuid are needed!");
	}
	$message = "[register]username=" . $_GET["username"] . "\ndeviceuid=" . $_GET["deviceuid"] . "\norder_token=" . $_GET["order_token"];
	L("$message");

	// 注册用户
	$UserCenter = new User();
	$uid = $UserCenter -> register($_GET);
	// 注册设备,如果设备已经存在，则更新设备信息
	$DeviceCenter = new Device();
	$device_id = $DeviceCenter -> register($uid, $_GET);

	_debug("user_id=$uid<br />device_id=$device_id<br />");
	if ($device_id) {
		$data["device_id"] = $device_id;
		ajaxReturn($data, "success", 1);
	} else {
		ajaxReturn(null, "error", 0);
	}
}

register();
?>
