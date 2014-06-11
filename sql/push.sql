delimiter $$

CREATE TABLE `apns_devices` (
  `uid` int(10) unsigned NOT NULL,
  `device_type` enum('ios','android') NOT NULL DEFAULT 'android',
  `appname` varchar(255) NOT NULL,
  `appversion` varchar(25) DEFAULT '',
  `deviceuid` varchar(255) NOT NULL COMMENT '标识设备的唯一ID，android由百度云返回，ios由apns返回token',
  `devicetoken` char(64) DEFAULT NULL COMMENT '暂时无用',
  `devicename` varchar(255) NOT NULL,
  `devicemodel` varchar(100) DEFAULT '',
  `deviceversion` varchar(25) DEFAULT '',
  `pushbadge` enum('disabled','enabled') DEFAULT 'disabled',
  `pushalert` enum('disabled','enabled') DEFAULT 'disabled',
  `pushsound` enum('disabled','enabled') DEFAULT 'disabled',
  `development` enum('production','sandbox') CHARACTER SET latin1 NOT NULL DEFAULT 'production',
  `status` enum('active','uninstalled') NOT NULL DEFAULT 'active',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`,`deviceuid`),
  KEY `devicename` (`devicename`),
  KEY `status` (`status`),
  KEY `uid` (`uid`) USING BTREE,
  KEY `deviceuid` (`deviceuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Store unique devices'$$

CREATE
DEFINER=`yfcloud`@`%`
TRIGGER `cloudapp`.`Archive`
BEFORE UPDATE ON `cloudapp`.`apns_devices`
FOR EACH ROW
INSERT INTO `apns_device_history` VALUES (
	OLD.`uid`,
	OLD.`deviceuid`,
	OLD.`appname`,
	OLD.`appversion`,
	OLD.`devicename`,
	OLD.`devicemodel`,
	OLD.`deviceversion`,
	OLD.`pushbadge`,
	OLD.`pushalert`,
	OLD.`pushsound`,
	OLD.`development`,
	OLD.`status`,
	NOW()
)
$$

delimiter $$

CREATE TABLE `apns_device_history` (
  `uid` varchar(64) NOT NULL,
  `deviceuid` varchar(255) NOT NULL COMMENT '设备唯一ID',
  `appname` varchar(255) NOT NULL,
  `appversion` varchar(25) DEFAULT NULL,
  `devicename` varchar(255) NOT NULL,
  `devicemodel` varchar(100) NOT NULL,
  `deviceversion` varchar(25) NOT NULL,
  `pushbadge` enum('disabled','enabled') DEFAULT 'disabled',
  `pushalert` enum('disabled','enabled') DEFAULT 'disabled',
  `pushsound` enum('disabled','enabled') DEFAULT 'disabled',
  `development` enum('production','sandbox') CHARACTER SET latin1 NOT NULL DEFAULT 'production',
  `status` enum('active','uninstalled') NOT NULL DEFAULT 'active',
  `archived` datetime NOT NULL,
  KEY `clientid` (`uid`),
  KEY `devicename` (`devicename`),
  KEY `devicemodel` (`devicemodel`),
  KEY `deviceversion` (`deviceversion`),
  KEY `pushbadge` (`pushbadge`),
  KEY `pushalert` (`pushalert`),
  KEY `pushsound` (`pushsound`),
  KEY `development` (`development`),
  KEY `status` (`status`),
  KEY `appname` (`appname`),
  KEY `appversion` (`appversion`),
  KEY `deviceuid` (`deviceuid`),
  KEY `archived` (`archived`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Store unique device history'$$

delimiter $$

CREATE TABLE `cloudapp_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` char(20) NOT NULL,
  `order_token` varchar(64) DEFAULT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`,`username`),
  UNIQUE KEY `uni_user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8$$

delimiter $$

CREATE TABLE `push_message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` char(20) NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` tinyint(4) unsigned NOT NULL,
  `order_id` varchar(255) DEFAULT '' COMMENT '订单ID',
  `status` enum('failed','delivered','queued') DEFAULT 'queued',
  `writetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=155098 DEFAULT CHARSET=utf8 COMMENT='原始消息纪录'$$

