<?PHP

require_once ('common.php');

$device_uid = $_GET["deviceuid"];
$message = $_GET["message"];
$type = $_GET["type"];
$order_id = $_GET["order_id"];

$PushServer = new PushServer();
$PushServer -> api_push($device_uid, $message, $type, $order_id);
?>
