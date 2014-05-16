<?PHP

/* * *
 *  服务器定时发送推送消息
 */
require_once('common.php');
require_once ( "Channel.class.php" );

function push() {
    $android_push_server = new AndroidPushServer();
    // 准备消息
    $android_push_server->prepare_message_queues();
    // 调用各消息发送服务器发送消息
    $android_push_server->push();
    
    $ios_push_server = new IosPushServer();
    $ios_push_server->push();
}

push();
?>
