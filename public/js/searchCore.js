/**
 * 核心库匹配
 * @param {type} url
 * @returns {undefined}
 */
function searchCore() {
    var CloudID = $("#CloudID").val();
    if (CloudID == "") {
        alert("请填写完整信息");
        return false;
    }
    var url = "?s=SearchCore/search/CloudID/" + CloudID + "/";
    window.location.href = url;
}

