<?PHP

require_once('common.php');

/**
 *  激活设备
 */
function unregister() {
    if (!isset($_GET["deviceuid"])) {
        debug_error("deviceuid is needed!");
    }
    // 注册设备
    $deviceuid = $_GET["deviceuid"];
    $device = new Device();
    if ($device->active($deviceuid)) {
        ajaxReturn(null, "success", 1);
    } else {
        ajaxReturn(null, "error", 0);
    }
}

unregister();
?>
