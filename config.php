<?php

/**
 * 数据库配置文件
 */
$db_config_file = "/etc/yfcloud/clouddb/config.ini";
$db_config = parse_ini_file($db_config_file, true);
$db_ini = $db_config["yfcloud_apns_3307"];
// var_dump($db_ini); 
 
$db = array(
    // IOS证书 
    'cloudapprelease' => './pem/cloudapprelease.pem',
    'cloudappdebug' => './pem/cloudappdebug.pem',
    // 百度云推送开发者
    'apiKey' => "7RvU2p85pp84HbdAY7X8YXrG",
    'secretKey' => "wxG6qr1x6D5AHdDnTlr8eQn3URMPUaxm",
    'message_title' => "订单系统通知",
    'tips_multi_message' => "您有{n}条退单消息，请查看",
    // 支持的设备类型
    'DEVICE_TYPE' => array(
        "android" => 0,
        "ios" => 1
    ),
    
	// 消息类型
	'MSG_TYPE' =>array(
		//订单状态改变(审核通过,审核退回).
		"0" => "消息",
		"1" => "审核退回消息",
		"2" => "量尺消息",
		"3" => "审核通过",
		// 客户状态改变(待量尺,已量尺,方案设计..)
		"11" => "房间状态改变",
		// 其他类型通知
		"21" => "私人定制",
		"22" => "楼盘信息推送",
		"23" => "爆款提醒",
	),
    'RETRY' => 10,
    'limit' => 2,
    'debug' => 1,
    'log' => 1,
/*
    "LOG_HOME" => "log/daily",
    "LOG_ERROR" => "log/error" ,
    "LOG_PUSH_ERROR" => "log/push_error" ,
    "LOG_PUSH_SUCCESS" => "log/push_success" ,
    "LOG_CMD_PUSH" => "log/cmd_push" ,
    "LOG_API_PUSH" => "log/api_push" ,
    "LOG_PUSH_SQL" => "log/sql" ,
    "LOG_PUSH" => "log/push" ,
    "LOG_PUSH2" => "log/push2" ,
    "LOG_PUSH_RETRY" => "log/retry" ,
*/
//	dolphin@20140527 +
    "LOG_HOME" => "/data2/log/apns",

);

$ret = array_merge($db_ini , $db);
return $ret;
?>
