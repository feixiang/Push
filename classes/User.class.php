<?php

/**
 * 用户中心 -> 对应 cloudapp_user表
 *
 * @author Administrator
 */
class User {

    private $db;

    /**
     * 构造函数建立数据库连接
     */
    function __construct() {
        $this->db = M();
    }

    /**
     * 析构函数
     *  关闭数据库连接
     */
    public function __destruct() {
        $this->db->close();
    }

    /**
     * 用户注册
     *     先判断用户是否存在 ，存在则返回用户ID
     * @param type $get
     */
    public function register($get) {
        $order_token = $get["order_token"];
        $username = $get["username"];
        $uid = $this->get_userid($username);
        if ($uid <= 0) {
            $sql = <<< EOF
            INSERT INTO `cloudapp`.`cloudapp_user` (`order_token`,`username`) VALUES ('$order_token','$username');
EOF;

            $ret = $this->db->execute($sql);
            $uid = $this->db->getLastInsID();
        }
        return $uid;
    }

    /*
     * 通过用户名获得用户ID
     */

    public function get_userid($username) {
        $sql = "select `id` from `cloudapp_user` where `username`='$username'" ; 
        $user_id = $this->db->getField($sql);
        return empty($user_id) ? 0 : $user_id;
    }

    /**
     * 通过用户名获得用户对应的设备
     *      只返回状态可用的设备
     */
    public function get_devices_by_username($username) {
        $devices = array();
        $uid = $this->get_userid($username);
        $sql = "select `apns_devices`.`id` FROM `cloudapp`.`apns_devices` 
                where `uid`=$uid and `apns_devices`.`status` = 'active'; ";
        $result = $this->db->query($sql);
        if ($result) {
            foreach ($result as $key => $value) {
                $devices[] = $value["id"];
            }
        }
        return $devices;
    }

    /**
     * 
     * @param type $username
     */
    public function get_user_status($username) {
        $sql = "select `id` FROM `cloudapp`.`cloudapp_user` where `username`='$username';";
        $uid = $this->db->getField($sql);
        if (empty($uid))
            return -1;
        return $uid;
    }

}

?>
