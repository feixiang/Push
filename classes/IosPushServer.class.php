<?php

/**
 * ios端推送消息 
 */
class IosPushServer extends PushServer {

    private $apnsData;
    private $certificate = '/usr/local/apns/apns.pem';
    private $passphrase = 'passphrase';
    private $ssl = 'ssl://gateway.push.apple.com:2195';
    private $feedback = 'ssl://feedback.push.apple.com:2196';
    private $sandboxCertificate = '/usr/local/apns/apns-dev.pem'; // change this to your development certificate absolute path
    private $sandboxPassphrase = 'passphrase';
    private $sandboxSsl = 'ssl://gateway.sandbox.push.apple.com:2195';
    private $sandboxFeedback = 'ssl://feedback.sandbox.push.apple.com:2196';
    private $sslStreams;

    function __construct() {
        parent::__construct();
        /**
         * 检查证书
         */
        $certificate = C('cloudapprelease');
        if (!empty($certificate) && file_exists($certificate)) {
            $this->certificate = $certificate;
        }
        $sandboxCertificate = C('cloudappdebug');
        if (!empty($sandboxCertificate) && file_exists($sandboxCertificate)) {
            $this->sandboxCertificate = $sandboxCertificate;
        }

        /**
         * apns数据格式
         */
        $this->apnsData = array(
            'production' => array(
                'certificate' => $this->certificate,
                'ssl' => $this->ssl,
                'feedback' => $this->feedback,
                'passphrase' => $this->passphrase
            ),
            'sandbox' => array(
                'certificate' => $this->sandboxCertificate,
                'ssl' => $this->sandboxSsl,
                'feedback' => $this->sandboxFeedback,
                'passphrase' => $this->sandboxPassphrase
            )
        );
    }

 	public function push_message($device_info,$message,$msg_type,$order_id,$mid){
 		$ret = false ;
 		$development = $device_info["development"];
		$deviceuid = $device_info["deviceuid"];
        if (!isset($this->sslStreams[$development])) {
            $this->_connectSSLSocket($development);
        }
        $mid = 0;
        if (!isset($this->sslStreams[$development])) {
            $this->_connectSSLSocket($development);
        }
        $ret = $this->_pushMessage($mid, $message,$msg_type, $deviceuid, $development, $order_id);
		return $ret ; 
    }

    /**
     * 
     */
    public function push_bk() {
        $this->processQueue();
    }

    protected function processQueue() {
        $messages = $this->MsgCenter->get_push_messages($this->device_type);
        if ($messages)
            $this->_iterateMessages($messages);
    }

    private function _iterateMessages($result) {
//        _dump($result);
        foreach ($result as $key => $value) {
            $id = $value['id'];
            $message = stripslashes(substr($value["message"], 0, 20));
            $token = $value['devicetoken'];
            $development = $value['development'];
            $order_id = $value['order_id'];

            // Connect the socket the first time it's needed.
            if (!isset($this->sslStreams[$development])) {
                $this->_connectSSLSocket($development);
            }
            $this->_pushMessage($id, $message, $token, $development, $order_id);
        }
        // Close streams and check feedback service
        foreach ($this->sslStreams as $key => $socket) {
            $this->_closeSSLSocket($key);
            $this->_checkFeedback($key);
        }
    }

    /**
     * apns推送消息  ,
     * $message是一个json数组，消息数据按以下格式:
     * {"aps":{"alert":"Message from TEST SERVER at 20140120"}}
     */
    private function _pushMessage($pid, $message,$msg_type, $token, $development, $order_id = "") {
        $ret = FALSE ; 	
        // 进行消息的组装
        $arr_message = array();
        $arr_message['aps'] = array();
        $arr_message['aps']['alert'] = (string) $message;
		// 参数数组
        $arr_message['type'] = $msg_type;
        $arr_message['pid'] = (string) $order_id;
        $message = json_encode($arr_message);
		_dump($message);
		
        if (strlen($pid) == 0)
            $this->_triggerError('Missing message pid.', E_USER_ERROR);
        if (strlen($message) == 0)
            $this->_triggerError('Missing message.', E_USER_ERROR);
        if (strlen($token) == 0)
            $this->_triggerError('Missing message token.', E_USER_ERROR);
        if (strlen($development) == 0)
            $this->_triggerError('Missing development status.', E_USER_ERROR);

        $fp = false;
        if (isset($this->sslStreams[$development])) {
            $fp = $this->sslStreams[$development];
        }

        if (!$fp) {
            $this->_pushFailed($pid);
            $this->_triggerError("A connected socket to APNS wasn't available.");
        } else {
            $expiry = time() + 120; // 2 minute validity hard coded!
            $msg = chr(1) . pack("N", $pid) . pack("N", $expiry) . pack("n", 32) . pack('H*', $token) . pack("n", strlen($message)) . $message;

            $fwrite = fwrite($fp, $msg);
            if (!$fwrite) {
                $this->_pushFailed($pid);
                $this->_triggerError("Failed writing to stream.", E_USER_ERROR);
                $this->_closeSSLSocket($development);
            } else {
                $tv_sec = 1;
                $tv_usec = null; // Timeout. 1 million micro seconds = 1 second
                $r = array($fp);
                $we = null; // Temporaries. "Only variables can be passed as reference."
                $numChanged = stream_select($r, $we, $we, $tv_sec, $tv_usec);
                if (false === $numChanged) {
                    $this->_triggerError("Failed selecting stream to read.", E_USER_ERROR);
                } else if ($numChanged > 0) {
                    $command = ord(fread($fp, 1));
                    $status = ord(fread($fp, 1));
                    $identifier = implode('', unpack("N", fread($fp, 4)));
                    $statusDesc = array(
                        0 => 'No errors encountered',
                        1 => 'Processing error',
                        2 => 'Missing device token',
                        3 => 'Missing topic',
                        4 => 'Missing payload',
                        5 => 'Invalid token size',
                        6 => 'Invalid topic size',
                        7 => 'Invalid payload size',
                        8 => 'Invalid token',
                        255 => 'None (unknown)',
                    );
                    $this->_triggerError("APNS responded with command($command) status($status) pid($identifier).", E_USER_NOTICE);

                    if ($status > 0) {
                        // $identifier == $pid
                        $this->_pushFailed($pid);
                        $desc = isset($statusDesc[$status]) ? $statusDesc[$status] : 'Unknown';
                        $this->_triggerError("APNS responded with error for pid($identifier). status($status: $desc)", E_USER_ERROR);
                        // The socket has also been closed. Cause reopening in the loop outside.
                        $this->_closeSSLSocket($development);
                    } else {
                        // Apple docs state that it doesn't return anything on success though
                        _debug("push success");
                        $this->_pushSuccess($pid);
						$ret = TRUE;
                    }
                } else {
                    _debug("push success");
                    $this->_pushSuccess($pid);
                    $ret = TRUE;
                }
            }
        }
        return $ret ; 
    }

    private function _connectSSLSocket($development) {
        $ctx = stream_context_create();
        stream_context_set_option($ctx, 'ssl', 'local_cert', $this->apnsData[$development]['certificate']);
        stream_context_set_option($ctx, 'ssl', 'passphrase', $this->apnsData[$development]['passphrase']);
        $this->sslStreams[$development] = stream_socket_client($this->apnsData[$development]['ssl'], $error, $errorString, 100, (STREAM_CLIENT_CONNECT | STREAM_CLIENT_PERSISTENT), $ctx);
        if (!$this->sslStreams[$development]) {
            $this->_triggerError("Failed to connect to APNS: {$error} {$errorString}.");
            unset($this->sslStreams[$development]);
            return false;
        }
        return $this->sslStreams[$development];
    }

    /**
     * Close the SSL stream (sandbox or production)
     *
     * @param $development string Development environment - sandbox or production
     * @return void
     * @access private
     */
    private function _closeSSLSocket($development) {
        if (isset($this->sslStreams[$development])) {
            fclose($this->sslStreams[$development]);
            unset($this->sslStreams[$development]);
        }
    }

    /**
     * Fetch APNS Messages
     *
     * This gets called automatically by _pushMessage.  This will check with APNS for any invalid tokens and disable them from receiving further notifications.
     *
     * @param string $development Which SSL to connect to, Sandbox or Production
     * @access private
     */
    private function _checkFeedback($development) {
        $ctx = stream_context_create();
        stream_context_set_option($ctx, 'ssl', 'local_cert', $this->apnsData[$development]['certificate']);
        stream_context_set_option($ctx, 'ssl', 'passphrase', $this->apnsData[$development]['passphrase']);
        stream_context_set_option($ctx, 'ssl', 'verify_peer', false);
        $fp = stream_socket_client($this->apnsData[$development]['feedback'], $error, $errorString, 100, (STREAM_CLIENT_CONNECT | STREAM_CLIENT_PERSISTENT), $ctx);

        if (!$fp)
            $this->_triggerError("Failed to connect to device: {$error} {$errorString}.");
        while ($devcon = fread($fp, 38)) {
            $arr = unpack("H*", $devcon);
            $rawhex = trim(implode("", $arr));
            $token = substr($rawhex, 12, 64);
            if (!empty($token)) {
                $this->DeviceCenter->unregister(null, $token);
                debug_error("Unregistering Device Token: {$token}.");
            }
        }
        fclose($fp);
    }

    private function _triggerError($str) {
        debug_error($str);
    }

}

?>
