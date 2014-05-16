<?php

/**
 * 设备中心 -> 对应apns_devices表
 * 1 user -> n device
 * 1 device -> n message
 * @author Administrator
 */
class Device {

	/**
	 * 设备注册需要需要字段,对应数据库字段
	 * @var type
	 */
	private $device_info = array('device_type' => "android", 'appname' => "cloudapp", 'appversion' => '1.0', 'deviceuid' => "0", 'devicetoken' => '0', 'devicename' => 'iphone', 'devicemodel' => 'iphone', 'deviceversion' => '4', 'pushbadge' => 'enabled', 'pushalert' => 'enabled', 'pushsound' => 'enabled', 'development' => 'production');
	//数据库连接
	private $db;
	//设备所属用户
	private $uid;

	/**
	 * Production or Sandbox app for IOS
	 */
	private $DEVELOPMENT = 'production';
	// or 'sandbox'

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
	 * 注册设备
	 * 先判断设备状态，
	 * 存在且状态为active，直接返回设备ID
	 * 存在且状态为uninstalled ,则将其状态改为可用，
	 * 不存在则新增设备
	 * @param type $get
	 */
	public function register($uid, $get) {
		$deviceuid = $get["deviceuid"];
		$username = $get["username"];
		L("[register]user $username;device:$deviceuid");
		$device_id = $this -> add($uid, $get);
		return $device_id;
	}

	private function update_device($get) {

	}

	/**
	 *
	 * @param type $uid
	 * @param type $get
	 */
	private function add($uid, $get) {
		if (!empty($uid)) {
			// 从我们定义的数据项里读取数据
			foreach ($this->device_info as $key => $value) {
				// 如果定义了数据项，则使用传过来的参数
				if (array_key_exists($key, $get)) {
					$insert_values[$key] = $get[$key];
				} else {
					// 没有定义的使用自定义的默认项
					$insert_values[$key] = $value;
				}
			}
			$insert_values["uid"] = $uid;
			//            dump($insert_values);
			$sql = "INSERT INTO `apns_devices`
                                    (`uid`,
                                     `device_type`,
                                    `appname`,
                                    `appversion`,
                                    `deviceuid`,
                                    `devicetoken`,
                                    `devicename`,
                                    `devicemodel`,
                                    `deviceversion`,
                                    `pushbadge`,
                                    `pushalert`,
                                    `pushsound`,
                                    `development`,
                                    `status`,
                                    `created`,
                                    `modified`)
				VALUES (
                                    {$insert_values["uid"]},
                                    '{$insert_values["device_type"]}',
                                    '{$insert_values["appname"]}',
                                    '{$insert_values["appversion"]}',
                                    '{$insert_values["deviceuid"]}',
                                    '{$insert_values["devicetoken"]}',
                                    '{$insert_values["devicename"]}',
                                    '{$insert_values["device_type"]}',
                                    '{$insert_values["deviceversion"]}',
                                    '{$insert_values["pushbadge"]}',
                                    '{$insert_values["pushalert"]}',
                                    '{$insert_values["pushsound"]}',
                                    '{$insert_values["development"]}',
                                    'active',
                                    NOW(),
                                    NOW()
				)
                ON DUPLICATE KEY UPDATE
                                    `deviceuid`= {$uid},
                                    `device_type`= '{$insert_values["device_type"]}',
                                    `appname`= '{$insert_values["appname"]}',
                                    `appversion`='{$insert_values["appversion"]}',
                                    `deviceuid`='{$insert_values["deviceuid"]}',
                                    `devicetoken`='{$insert_values["devicetoken"]}',
                                    `devicename`='{$insert_values["devicename"]}',
                                    `devicemodel`='{$insert_values["device_type"]}',
                                    `deviceversion`='{$insert_values["deviceversion"]}',
                                    `pushbadge`='{$insert_values["pushbadge"]}',
                                    `pushalert`='{$insert_values["pushalert"]}',
                                    `pushsound`='{$insert_values["pushsound"]}',
                                    `status`='active',
                                    `modified`=NOW();";
			$this -> db -> execute($sql);
			// echo $this -> db -> _sql();
			return $this -> db -> getLastInsID();
		}
	}

	/**
	 *
	 * @param type $deviceuid
	 * @return type
	 */
	private function get_device_id($deviceuid) {
		$sql = "select `id` from `apns_devices`
		WHERE `deviceuid`='{$deviceuid}' limit 1;";
		$id = $this -> db -> getField($sql);
		return $id;
	}

	/**
	 * 判断设备是否可用
	 * @param type $deviceuid
	 */
	private function get_status($deviceuid) {
		$sql = "select `status` from `apns_devices`
		WHERE `deviceuid`='{$deviceuid}' limit 1;";
		$status = $this -> db -> getField($sql);
		// 设备不存在返回0
		if (empty($status))
			return -1;
		return ($status == "active") ? 1 : 0;
	}

	/**
	 * 激活设备
	 * @param type $deviceuid 设备唯一标识ID
	 * @return int 设备ID
	 */
	public function active($deviceuid) {
		$sql = "UPDATE `apns_devices`
		SET `status`='active'
		WHERE `deviceuid`='{$deviceuid}';";
		$this -> db -> execute($sql);
		$sql = "select `id` from `apns_devices` where `deviceuid` = '$deviceuid' limit 1";
		$device_id = $this -> db -> getField($sql);

		_debug("device_id=$device_id");
		return $device_id;
	}

	/**
	 * 卸载设备
	 * @param type $token
	 */
	public function unregister($deviceuid) {
		//  先判断设备状态
		$status = $this -> get_status($deviceuid);
		if ($status == 1) {
			$sql = "UPDATE `apns_devices`
		SET `status`='uninstalled'
		WHERE `deviceuid`='{$deviceuid}';";
			$this -> db -> execute($sql);
			L("[uninstall device]deviceuid:$deviceuid");
		}
		return true;
	}

	/**
	 * 获取用户绑定的设备列表
	 * @param type $uid
	 */
	public function get_bind_device($user_id) {
		$sql = "select * from `apns_devices` where `uid`=$user_id and `status`='active'";
		$devices = $this -> db -> select($sql);
		return $devices;
	}

	public function get_device_by_id($id) {
		$sql = "select * from `apns_devices` where `id`=$id and `status`='active'";
		$result = $this -> db -> find($sql);
		return $result;
	}

	public function get_device_by_uid($deviceuid) {
		$sql = "select * from `apns_devices` where `deviceuid`='$deviceuid' and `status`='active' limit 1";
		$result = $this -> db -> find($sql);
		// echo $this -> db -> _sql();
		return $result;
	}

}
?>
