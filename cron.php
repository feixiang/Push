<?PHP

/* * *
 *  服务器定时发送推送消息
 */
require_once('common.php');

function push() {
    $push_server = new PushServer();
    // 准备消息
    $push_server->prepare_message_queues();
    // 调用各消息发送服务器发送消息
    $push_server->push();
}

push();
?>
