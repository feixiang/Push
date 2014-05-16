#!/usr/bin/php
<?PHP

// AUTOLOAD CLASS OBJECTS... YOU CAN USE INCLUDES IF YOU PREFER
if(!function_exists("__autoload")){ 
	function __autoload($class_name){
		require_once('classes/'.$class_name.'.class.php');
	}
}

// CREATE DATABASE OBJECT ( MAKE SURE TO CHANGE LOGIN INFO )
// CREATE DATABASE OBJECT ( MAKE SURE TO CHANGE LOGIN INFO IN CLASS FILE )
$db = new DbConnect('127.0.0.1', 'yfcloud_apns', 'yf_apns', 'cloudapp2' , 3307 );
$db->show_errors();

// FETCH $_GET OR CRON ARGUMENTS TO AUTOMATE TASKS
$args = (!empty($_GET)) ? $_GET:array('task'=>$argv[1]);

// FETCH $_GET OR CRON ARGUMENTS TO AUTOMATE TASKS
$apns = new APNS($db, $args, './pem/cloudapprelease.pem', './pem/cloudappdebug.pem');
?>
