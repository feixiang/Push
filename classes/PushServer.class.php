<?php

/**
 * 推送服务器
 *      处理推送的逻辑
 */
class PushServer {

	//current push server instance
	protected $_model = null;
	// instances
	protected $_models = array();
	// linkNum
	protected $_linkNum = 0;
	// db instance
	protected $db = null;
	// Message instance
	protected $MsgCenter = null;
	// User instance
	protected $UserCenter = null;
	// Device instance
	protected $DeviceCenter = null;
	// Device type
	protected $device_type = "android";
	// Retry times
	protected $retry = 0;
	protected $title_array = array();
	protected $devices = array();

	/**
	 * 构造函数
	 *      建立数据库连接
	 */
	function __construct() {
		$this -> db = M();
		$this -> MsgCenter = new Message();
		$this -> DeviceCenter = new Device();
		$this -> UserCenter = new User();
		$this -> retry = C("RETRY");
		$this -> title_array = C("MSG_TYPE");
		$this -> devices = C("DEVICE_TYPE");
	}

	// 单件模式，对应类型的实例
	public function getInstance($device_type) {
		$name = ucwords($device_type);
		$device_type = strtolower($device_type);
		$_linkNum = $this -> devices["$device_type"];
		$model = null;
		if (!isset($this -> _models[$_linkNum])) {
			$model = get_instance_of("{$name}PushServer");
		} else {
			$model = $this -> _model;
		}
		return $model;
	}

	/**
	 * @param $username 用户名
	 * @param $message 消息
	 * @param $param 参数数组
	 */
	public function push($username, $message, $msg_type, $order_id, $mid = 0) {
		$uid = $this -> UserCenter -> get_userid($username);
		// 获得用户的所有设备
		$deviceList = $this -> DeviceCenter -> get_bind_device($uid);
		// _dump($deviceList);
		if ($deviceList) {
			foreach ($deviceList as $key => $device_info) {
				$this -> push_common($device_info, $message, $msg_type, $order_id, $mid);
			}
		} else {
			_L("error", "username=$username\nmessage=$message\norder_id=$order_id\nresult=no devices found\n");
		}
	}

	/**
	 * 推送通用函数，包括超时重发
	 */
	private function push_common($device_info, $message, $msg_type, $order_id, $mid) {
		//使用单件模式，返回已经实例化的实例
		$device_type = $device_info["device_type"];
		$deviceuid = $device_info["deviceuid"];
		$deviceversion = $device_info["deviceversion"];
		$model = $this -> getInstance($device_type);
		$ret = $model -> push_message($device_info, $message, $msg_type, $order_id, $mid);

		// 发送失败的尝试重新发送
		while (!$ret && $this -> retry > 0) {
			$ret = $model -> push_message($device_info, $message, $msg_type, $order_id, $mid);
			$this -> retry--;
			_L("retry", "device=$deviceversion\nmessage=$message\norder_id=$order_id\nresult=retry\n");
		}
		if ($ret) {
			_L("success", "device=$deviceversion\nmessage=$message\norder_id=$order_id\nresult=success\n");
		} else {
			_L("push_error", "device=$deviceversion\nmessage=$message\norder_id=$order_id\nresult=error\n");
		}
	}

	public function get_push_title($type) {
		if (isset($this -> title_array["$type"])) {
			$title = $this -> title_array["$type"];
		} else {
			$title = $this -> title_array["0"];
		}
		return $title;
	}

	/**
	 * 外部调用直接发送消息
	 * @param type $id  设备ID
	 * @param type $message 消息
	 * @param type $message 消息类型
	 * @param type $order_id    （客户端接收参数）订单号
	 */
	public function api_push($id, $message, $msg_type, $order_id) {
		//查找设备的类型
		$device_info = $this -> DeviceCenter -> get_device_by_uid($id);
		// _dump($device_info);
		if ($device_info) {
			$device_type = $device_info["device_type"];
			$model = $this -> getInstance($device_type);
			$mid = 0;
			$this -> push_common($device_info, $message, $msg_type, $order_id, $mid);
		} else {
			_L("api_push", "no device:$id found");
		}
	}

	/**
	 * 定时任务执行
	 */
	public function cron() {

	}

	/**
	 * 子类重载此函数进行消息队列处理
	 */
	protected function processQueue() {

	}

	/**
	 *  将消息保存到消息队列
	 */
	public function prepare_message_queues() {
		// 获取待发送的消息
		$message_list = $this -> MsgCenter -> get_queued_messages();
		//        _dump($message_list);
		// 有新消息则添加到消息队列
		if ($message_list) {
			foreach ($message_list as $key => $value) {
				$mid = $value["id"];
				$username = $value["username"];
				$order_id = $value["order_id"];
				$type = $value["type"];
				$message = $value["message"];

				$devices = $this -> UserCenter -> get_devices_by_username($username);
				//            _dump($devices);
				//为每个设备保存消息到消息队列
				if ($devices) {
					foreach ($devices as $key => $value) {
						$device_id = $value;
						$this -> MsgCenter -> save_queue_message($device_id, $order_id, $type, $message);
					}
					// 测试，先屏蔽
					$this -> MsgCenter -> _saveSuccess($mid);
				}
			}
		}
	}

	// 先保存消息
	public function save_message($device_id, $order_id, $type, $message) {
		$this -> MsgCenter -> save_message($device_id, $order_id, $type, $message);
		$sql = "INSERT INTO `cloudapp`.`apns_messages`
                (`fk_device`,
                `order_id`,
                `type`,
                `message`,
                `delivery`,
                `status`,
                `created`,
                `modified`)
                VALUES
                ($device_id,
                 '$order_id',
                 $type,
                '$message',
                CURRENT_TIMESTAMP,
                'queued',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
                );";
		$this -> db -> execute($sql);
		$message_id = $this -> db -> getLastInsID();
		return $message_id;
	}

	/**
	 * 推送消息是否成功处理
	 * @param type $mid
	 */
	protected function _pushSuccess($mid) {
		$this -> MsgCenter -> _pushSuccess($mid);
	}

	protected function _pushFailed($mid) {
		$this -> MsgCenter -> _pushFailed($mid);
	}

	/**
	 * 析构函数
	 *      关闭数据库连接
	 */
	public function __destruct() {
		$this -> db -> close();
	}

	// 调用方法测试
	private function test() {
		$username = "ydkhd";
		$message = "test function";
		$msg_type = 1;
		$order_id = "order_id";
		$mid = 0;
		$pushServer = new PushServer();
		$pushServer -> push($username, $message, $msg_type, $order_id, $mid);
	}

}
?>
