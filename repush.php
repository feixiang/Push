<?php

/* * *
 * 重发消息
 */
require_once ('common.php');


function repush() {
	$mid = $_GET["mid"];
	$MsgCenter = new Message();
	$msgInfo = $MsgCenter -> get_message_by_id($mid);
	//dump($msgInfo);
	if ($msgInfo) {
		$PushServer = new PushServer();

		$username = $msgInfo["username"];
		$message = $msgInfo["message"];
		$type = $msgInfo["type"];
		$order_id = $msgInfo["order_id"];

		$PushServer -> push($username, $message, $type, $order_id, $mid);

	} else {
		echo "no message found!";
	}
	//echo (intval($mid) > 0) ? "1" : "0";
}

repush();
?>
