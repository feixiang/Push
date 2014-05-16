<?PHP

/* * *
 * 接收订单系统推送的消息，保存到消息原始表
 */
require_once('common.php');

/**
 * 批量消息的接收
 * 这里只进行消息保存，发送消息由计划任务按指定时间完成
 */
function save_message() {
    if (!isset($_POST["message"])) {
        die("message is needed!");
    }
    $message = $_POST["message"];
    
    _log("log/origin/push_multi_" . date("Y-m-d") . ".txt", "$message");

    $MsgCenter = new Message();
    $messages_obj = simplexml_load_string($message);
	$mid = 0 ;
	$PushServer = new PushServer();
	if( $messages_obj ){
	    foreach ($messages_obj->note as $key => $value) {
	        $attribute = $value->attributes();
	        $username = $attribute->username;
	        $message = $attribute->message;
	        $type = $attribute->type;
	        $order_id = $attribute->order_id;
	
	        $mid = $MsgCenter->save($username, $message, $type, $order_id);
			// 这里接收消息马上发送 ， 为了不堵塞客户端，这里后台调用
			$api_file = "cmd_push.php";
			$log_file = _get_log_filename(C("LOG_PUSH2"));
			$cmd = "/usr/bin/php $api_file $username $message $type $order_id $mid >> $log_file 2>&1 &";
			// echo $cmd;
			`$cmd`;
	    }
	}
    //echo (intval($mid) > 0) ? "1" : "0";
    echo $mid;
}

save_message();


?>
