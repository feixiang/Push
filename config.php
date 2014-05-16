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
    'apiKey' => "xxx",
    'secretKey' => "xxx",
    // 支持的设备类型
    'DEVICE_TYPE' => array(
        "android" => 0,
        "ios" => 1
    ),
    
	// 消息类型
	'MSG_TYPE' =>array(
		"0" => "消息",
	),
    'RETRY' => 5,
    'limit' => 2,
    'debug' => 1,
    'log' => 1,
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
);

$ret = array_merge($db_ini , $db);
return $ret;
?>
