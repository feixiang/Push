<?PHP

/**
 * 通用函数
 */
//包含配置文件
if (is_file("config.php")) {
	C(
	include 'config.php');
}

if (!function_exists("__autoload")) {

	function __autoload($class_name) {
		require_once ('classes/' . $class_name . '.class.php');
	}

}

/**
 * 数据库操作函数
 * @return \mysqli
 */
function M() {
	$db = new Model();
	if (mysqli_connect_errno())
		throw_exception(mysqli_connect_error());
	return $db;
}

// 获取配置值
function C($name = null, $value = null) {
	//静态全局变量，后面的使用取值都是在 $)config数组取
	static $_config = array();
	// 无参数时获取所有
	if (empty($name))
		return $_config;
	// 优先执行设置获取或赋值
	if (is_string($name)) {
		if (!strpos($name, '.')) {
			$name = strtolower($name);
			if (is_null($value))
				return isset($_config[$name]) ? $_config[$name] : null;
			$_config[$name] = $value;
			return;
		}
		// 二维数组设置和获取支持
		$name = explode('.', $name);
		$name[0] = strtolower($name[0]);
		if (is_null($value))
			return isset($_config[$name[0]][$name[1]]) ? $_config[$name[0]][$name[1]] : null;
		$_config[$name[0]][$name[1]] = $value;
		return;
	}
	// 批量设置
	if (is_array($name)) {
		return $_config = array_merge($_config, array_change_key_case($name));
	}
	return null;
	// 避免非法参数
}

function ajaxReturn($data = null, $message = "", $status) {
	$ret = array();
	$ret["data"] = $data;
	$ret["message"] = $message;
	$ret["status"] = $status;
	echo json_encode($ret);
	die();
}

// 取得对象实例 支持调用类的静态方法
function get_instance_of($name, $method = '', $args = array()) {
	static $_instance = array();
	$identify = empty($args) ? $name . $method : $name . $method . to_guid_string($args);
	if (!isset($_instance[$identify])) {
		if (class_exists($name)) {
			$o = new $name();
			if (method_exists($o, $method)) {
				if (!empty($args)) {
					$_instance[$identify] = call_user_func_array(array(&$o, $method), $args);
				} else {
					$_instance[$identify] = $o -> $method();
				}
			} else
				$_instance[$identify] = $o;
		} else
			halt(L('_CLASS_NOT_EXIST_') . ':' . $name);
	}
	return $_instance[$identify];
}

/**
 * debug 输出
 */
function debug_error($str) {
	echo("<br />$str");
	return false;
}


//调试数组
function _dump($var) {
	if (C("debug"))
		dump($var);
}

// 浏览器友好的变量输出
function dump($var, $echo = true, $label = null, $strict = true) {
	$label = ($label === null) ? '' : rtrim($label) . ' ';
	if (!$strict) {
		if (ini_get('html_errors')) {
			$output = print_r($var, true);
			$output = '<pre>' . $label . htmlspecialchars($output, ENT_QUOTES) . '</pre>';
		} else {
			$output = $label . print_r($var, true);
		}
	} else {
		ob_start();
		var_dump($var);
		$output = ob_get_clean();
		if (!extension_loaded('xdebug')) {
			$output = preg_replace("/\]\=\>\n(\s+)/m", '] => ', $output);
			$output = '<pre>' . $label . htmlspecialchars($output, ENT_QUOTES) . '</pre>';
		}
	}
	if ($echo) {
		echo($output);
		return null;
	} else
		return $output;
}

/**
 * 调试输出
 * @param type $msg
 */
function _debug($msg) {
	if (C("debug")) {
		$time = date("Y-m-d H:i:s");
		$msg = "[$time]\n{$msg}\n";
		$msg = str_replace("\n", "<br />", $msg);
		echo $msg ; 
	}
}

/**
 * 日志记录
 */
function _log($filename, $msg) {
	if (C("log")) {
		$dir = dirname($filename);
		if (!file_exists($dir)) {
			mkdir($dir, 0777, true);
		}
		$time = date("Y-m-d H:i:s");
		$msg = "[$time]\n$msg\n";

		$fd = fopen($filename, "a+");
		fwrite($fd, $msg);
		fclose($fd);
		chmod($filename, 0777);
	}
}

function _L($log_home, $msg) {
	$filename = _get_log_filename($log_home);
	_log($filename, $msg);
}

function _get_log_filename($name) {
	$year = date("Y");
	$month = date("m");
	$day = date("d");
	$log_home = C("LOG_HOME");
	$filename = "$log_home/$name/$year/$month/$day.txt";
	$dir = dirname($filename);
	if (!file_exists($dir)) {
		if (!mkdir($dir, 0777, true)) {
			die('Failed to create $dir...');
		}
		chmod($dir, 0777);
	}
	if (!file_exists($filename)) {
		file_put_contents($filename, "#created at " . date("Y-m-d H:i:s") . "\n");
		chmod($filename, 0777);
	}
	return $filename;
}
?>
