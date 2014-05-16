/**
 * description   : yflib界面通用函数
 * create : 2013年12月9日
 * author : wufeixiang
 */

/**
 * 定义全局变量
 *     一些常用的房间信息api
 */


/**
 * 对ajax请求进行处理
 * @returns {undefined}
 */
function initAjaxDialog() {
    $("a[target='ajaxTodo']").bind("click", function() {
        event.preventDefault();

    });
}
$.fn.extend({
    ajaxTodo: function() {
        return this.each(function() {
            var $this = $(this);
            $this.click(function(event) {
                var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
                DWZ.debug(url);
                if (!url.isFinishedTm()) {
                    alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
                    return false;
                }
                var title = $this.attr("title");
                if (title) {
                    alertMsg.confirm(title, {
                        okCall: function() {
                            ajaxTodo(url, $this.attr("callback"));
                        }
                    });
                } else {
                    ajaxTodo(url, $this.attr("callback"));
                }
                event.preventDefault();
            });
        });
    }
});

