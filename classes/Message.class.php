<?php

/**
 * 消息中心 -> 对应 push_message表和apns_messages表
 * 1 user -> n device
 * 1 device -> n message
 * @author Administrator
 */
class Message {

	/**
	 * 设备注册需要需要字段,对应数据库字段
	 * @var type
	 */
	//数据库连接
	private $db;

	/**
	 * 构造函数建立数据库连接
	 */
	function __construct() {
		$this -> db = M();
	}

	/**
	 * 析构函数
	 *  关闭数据库连接
	 */
	public function __destruct() {
		$this -> db -> close();
	}

	/**
	 * 保存消息到原始消息表
	 */
	public function save($username, $message, $type, $order_id) {
		$sql = "INSERT INTO `cloudapp`.`push_message`
                (`username`,`message`,`type`,`order_id`)
                VALUES
                ('{$username}','{$message}',{$type}, '{$order_id}');";
		$filename = _get_log_filename(C("LOG_PUSH_SQL"));
		_log($filename, "$sql\n");
		$this -> db -> execute($sql);
		//echo $sql ;
		$message_id = $this -> db -> getLastInsID();
		return $message_id;
	}

	/**
	 * 保存消息到待发送队列 apns_messages
	 * @param type $mid 原始消息ID
	 * @param type $device_id
	 * @param type $order_id
	 * @param type $type
	 * @param type $message
	 * @return type 返回消息ID，并更新原始消息表状态
	 */
	public function save_queue_message($device_id, $order_id, $type, $message) {
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
		//        if ($message_id > 0) {
		//            $this->_saveSuccess($mid);
		//        }
		return $message_id;
	}

	/**
	 * 消息发送队列
	 * 根据设备类型获取待发送消息
	 * @return type
	 */
	public function get_push_messages($device_type = "android") {
		// 先发旧消息
		$limit = C("limit");
		$sql = "SELECT
                    `apns_messages`.`id`,
                    `apns_messages`.`message`,
                    `apns_messages`.`order_id`,
                    `apns_devices`.`devicetoken`,
                    `apns_devices`.`deviceuid`,
                    `apns_devices`.`device_type`,
                    `apns_devices`.`status`,
                    `apns_devices`.`development`
                FROM `apns_messages`
                LEFT JOIN `apns_devices` ON (`apns_devices`.`id` = `apns_messages`.`fk_device`)
                WHERE `apns_devices`.`device_type`='$device_type' AND
                        `apns_messages`.`status` in ('queued' , 'failed')
                        AND `apns_messages`.`delivery` <= NOW()
                ORDER BY `apns_messages`.`created` ASC
                LIMIT $limit;";

		//        _debug($sql);
		$result = $this -> db -> query($sql);
		return $result;
	}

	/**
	 * 根据用户ID取得待发送消息
	 * @return type
	 */
	// 先发旧消息
	public function get_push_messages_by_uid($uid, $device_type = "android") {
		$limit = C("limit");
		$sql = "SELECT
                    `apns_messages`.`id`,
                    `apns_messages`.`message`,
                    `apns_messages`.`order_id`,
                    `apns_devices`.`devicetoken`,
                    `apns_devices`.`deviceuid`,
                    `apns_devices`.`device_type`,
                    `apns_devices`.`status`,
                    `apns_devices`.`development`
                FROM `apns_messages`
                LEFT JOIN `apns_devices` ON (`apns_devices`.`id` = `apns_messages`.`fk_device`)
                WHERE `apns_devices`.`uid`=$uid AND
                        `apns_devices`.`device_type`='$device_type' AND
                        `apns_messages`.`status` ='queued'
                        AND `apns_messages`.`delivery` <= NOW()
                ORDER BY `apns_messages`.`created` ASC
                LIMIT $limit;";

		//        _debug($sql);
		$result = $this -> db -> query($sql);
		return $result;
	}

	/**
	 * 更新原始消息状态
	 * 加入消息列表是否成功处理
	 * @param type $mid
	 */
	public function _saveSuccess($mid) {
		$sql = "UPDATE `push_message`
                SET `status`='delivered'
                WHERE `id`={$mid};";
		$ret = $this -> db -> execute($sql);
		//        _debug($this->db->_sql());
	}

	public function _saveFailed($mid) {
		$sql = "UPDATE `push_message`
                SET `status`='failed'
                WHERE `id`={$mid}";
		$this -> db -> execute($sql);
	}

	/**
	 * 推送消息是否成功处理
	 * @param type $mid
	 */
	public function _pushSuccess($mid) {
		if ($mid > 0) {
			$sql = "UPDATE `push_message`
                SET `status`='delivered'
                WHERE `id`={$mid};";
			$ret = $this -> db -> execute($sql);
		}
	}

	public function _pushFailed($mid) {
		if ($mid > 0) {
			$sql = "UPDATE `push_message`
                SET `status`='failed'
                WHERE `id`={$mid}";
			$this -> db -> execute($sql);
		}
	}

	/**
	 * 获得待发送消息队列
	 */
	public function get_queued_messages() {
		$limit = C("limit");
		// 获取待发送的消息
		$sql = "SELECT
                    `push_message`.`id`,
                    `push_message`.`username`,
                    `push_message`.`message`,
                    `push_message`.`type`,
                    `push_message`.`order_id`
                 FROM `cloudapp`.`push_message` 
                 JOIN `cloudapp_user` ON (`push_message`.`username` = `cloudapp_user`.`username`)
                 WHERE `push_message`.`status`='queued' limit $limit;";
		$result = $this -> db -> query($sql);
		// _debug($this -> db -> _sql());
		return $result;
	}

	/**
	 *
	 */
}
?>
