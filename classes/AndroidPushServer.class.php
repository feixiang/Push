<?php

/**
 * 使用云推送推送android设备消息
 */
class AndroidPushServer extends PushServer {
	//
	private $baidu_channel = null ;

	function __construct() {
        parent::__construct();
		//初始化百度云推送
		$apiKey = C("apiKey");
		$secretKey = C("secretKey");
		$this -> baidu_channel = new Channel($apiKey, $secretKey);
		// _dump($this -> baidu_channel);
	}

	/**
	 * 推送单条消息
	 * @param type $item
	 */
	public function push_message($device_info, $message, $msg_type, $order_id, $mid) {
		$deviceuid = $device_info["deviceuid"];
		$ret = false ; 
		if ($message != "" && $deviceuid != ""){
			$ret = $this -> baidu_push($deviceuid, $message, $msg_type, $order_id , $mid);
		}
		return $ret ; 
	}

	/**
	 * 百度云推送
	 */
	public function baidu_push($deviceuid, $message, $msg_type, $order_id, $mid) {
		// 返回值	
		$ret_val = FALSE ; 
		//推送消息到某个user，设置push_type = 1;
		//推送消息到一个tag中的全部user，设置push_type = 2;
		//推送消息到该app中的全部user，设置push_type = 3;
		$push_type = 1;
		//推送单播消息
		$optional[Channel::USER_ID] = $deviceuid;
		//如果推送单播消息，需要指定user
		//optional[Channel::TAG_NAME] = "xxxx";  //如果推送tag消息，需要指定tag_name
		//指定发到android设备
		$optional[Channel::DEVICE_TYPE] = 3;
		//指定消息类型为顶部出现的通知 ， 0为透传给应用的消息
		$optional[Channel::MESSAGE_TYPE] = 0;
		//通知类型的内容必须按指定内容发送，示例如下：

		//根据订单类型生成对应标题
		$title = $this -> get_push_title($msg_type);
		// 生成推送的参数格式
		$param = array("type" => "$msg_type", "pid" => "$order_id");
		$param_str = json_encode($param);
		$message = "{ 
			'title': '$title',
			'description': '$message',
			'custom_content': $param_str
 		}";
		$message_key = "msg_key";
		$ret = $this -> baidu_channel -> pushMessage($push_type, $message, $message_key, $optional);

		// 更新推送状态
		if (false === $ret) {
			if (C("debug")) {
				_debug('<br />WRONG, ' . __FUNCTION__ . ' ERROR!!!!!');
				_debug('<br />ERROR NUMBER: ' . $this -> baidu_channel -> errno());
				_debug('<br />ERROR MESSAGE: ' . $this -> baidu_channel -> errmsg());
				_debug('<br />REQUEST ID: ' . $this -> baidu_channel -> getRequestId());
			}
			$this -> _pushFailed($mid);
		} else {
			// 再处理百度云推送的发送状态3
			$success_cnt = $ret["response_params"]["success_amount"];
			if ($success_cnt > 0) {
				$this -> _pushSuccess($mid);
				$ret_val = TRUE ;
				_debug(__FUNCTION__ . " OK!!!!!success_amount=$success_cnt");
			} else {
				$this -> _pushFailed($mid);
				_debug(__FUNCTION__ . " Failed!!!!!success_amount=$success_cnt");
			}
		}
		return $ret_val ; 
	}

	/**
	 * 处理消息队列
	 */
	public function push_queue() {
		/**
		 * 获得该类型设备的消息列表
		 */$messages = $this -> MsgCenter -> get_push_messages($this -> device_type);
		_dump($messages);
		if ($messages) {
			$msg_count = count($messages);
			foreach ($messages as $key => $value) {
				$this -> push_message($value);
			}
		}
	}

}
?>
