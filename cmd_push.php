<?PHP

/* * *
 *  命令行调用 发送推送消息
 */
//需要先切换到自己的目录
chdir(dirname(__FILE__)) or die("chdir error");
require_once ('common.php');

$username = $argv[1];
$message = $argv[2];
$type = $argv[3];
$order_id = $argv[4];
$mid = $argv[5];

push($username, $message, $type, $order_id, $mid);

/**
 * 指定设备deviceuid , 消息id发送 , $mid > 0 才发送
 */
function push($username, $message, $type, $order_id, $mid) {
	$PushServer = new PushServer();
	if ($mid > 0) {
		$PushServer -> push($username, $message, $type, $order_id, $mid);
	} else {
		_L(C("LOG_ERROR"),"username={$username}\ntype={$type}\nmessage={$message}\norder_id={$order_id}\nresult:error\n");
	};
}
?>
