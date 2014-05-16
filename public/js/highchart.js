/**
 * highchart图表
 */
//var host = "http://cloud1.yfway.com/OpenAPI/";
var host = "http://" + location.host + "/OpenAPI/";
/**
 * 这个需要按条件搜索，从本地拿
 * @param {type} obj
 */
function hc_match_filter(obj, callback) {
    var post_str = $('form').serialize();
    //默认没填东西的字符串
    if (post_str == "WallNum=&DoorNum=&WinNum=&pinpai_id=0&type=null") {
        var url = host + "?s=Log/getLogMonthMatch";
    } else {
        var url = "?s=LogMatch/logMonthMatchFilter";
        url += "&" + post_str;
    }
    hc_month_match(obj, url, callback);
}
/**
 * 匹配搜索通用函数
 */
var match_total = [], match_core = [], match_plan = [], match_plan_add = []; //这几个作全局变量，在tips显示的时候用
function hc_month_match(obj, url, callback) {
    getDataAjax(url, null, onDataRecieved);
    function onDataRecieved(series) {
        if (series.status == 1) {
            var seriesData = series.data;
            var placeholder = $(obj);
            var total = [], core = [], plan = [],plan_add = [], label = [], data = [], label = [];
            $.each(seriesData, function(i, item) {
                match_total[i] = item.total;
                match_core[i] = item.core;
                match_plan[i] = item.plan;
                match_plan_add[i] = item.plan_add;
                label[i] = item.writetime;
                total[i] = parseInt(item.total);
                core[i] = getPercent(item.total, item.core);
                plan[i] = getPercent(item.total, item.plan);
                plan_add[i] = getPercent(item.total, item.plan_add);
            });
            data = [{
                    name: "核心库匹配率",
                    data: core
                }, {
                    name: "方案库匹配率",
                    data: plan
                }, {
                    name: "带柱子的方案库匹配率",
                    data: plan_add
                }];
            hc_line(placeholder, data, label, tips_match);
        }
        if (typeof callback == 'function') {
            callback();
        }
    }
}

/**
 * 用户使用数
 * @returns {undefined}
 */
function hc_user_match(obj) {
    var url = host + "?s=Log/getLogUserMatch";

    getDataAjax(url, null, onDataRecieved);
    function onDataRecieved(series) {
        if (series.status == 1) {
            var seriesData = series.data;
            var placeholder = $(obj);
            var total = [], label = [], data = [], label = [];
            var succore = [], sucplan = [], sucselect = [];
            $.each(seriesData, function(i, item) {
                label[i] = item.writetime;
                total[i] = parseInt(item.total);
                succore[i] = parseInt(item.succore);
                sucplan[i] = parseInt(item.sucplan);
                sucselect[i] = parseInt(item.sucselect);
            });
            data = [{
                    name: "总请求数",
                    data: total
                }, {
                    name: "找到核心库数",
                    data: succore
                }, {
                    name: "找到方案库数",
                    data: sucplan
                }, {
                    name: "应用数",
                    data: sucselect
                }];
            hc_line(placeholder, data, label, tips);
        }
    }
}

/**
 * 用户满意度
 * @returns {undefined}
 */
function hc_user_degree(obj) {
    var url = host + "?s=Log/getLogUserDegree";

    getDataAjax(url, null, onDataRecieved);
    function onDataRecieved(series) {
        if (series.status == 1) {
            var seriesData = series.data;
            var placeholder = $(obj);
            var total = [], ok = [], label = [], data = [], label = [];
            $.each(seriesData, function(i, item) {
                label[i] = item.writetime;
                total[i] = parseInt(item.total);
                ok[i] = parseInt(item.ok);
            });
            data = [{
                    name: "总评价数",
                    data: total
                }, {
                    name: "满意数",
                    data: ok
                }];
            hc_line(placeholder, data, label, tips);
        }
    }
}
/**
 * 基础库核心库数量
 * @type Array
 */
function hc_base_core(obj) {
    var url = host + "?s=Log/getLogBaseCore";

    getDataAjax(url, null, onDataRecieved);
    function onDataRecieved(series) {
        if (series.status == 1) {
            var seriesData = series.data;
            var placeholder = $(obj);
            var base = [], core = [], label = [], data = [], label = [];
            $.each(seriesData, function(i, item) {
                label[i] = item.writetime;
                base[i] = parseInt(item.base);
                core[i] = parseInt(item.core);
            });
            data = [{
                    name: "基础库",
                    data: base
                }, {
                    name: "核心库",
                    data: core
                }];
            hc_line(placeholder, data, label, tips);
        }
    }
}
/**
 * highchart通用函数
 * @param {type} placeholder
 * @param {type} data
 * @param {type} categories
 * @param {type} tips
 * @returns {undefined}
 */
function hc_line(placeholder, data, categories, tips) {
    placeholder.highcharts({
        chart: {
            type: 'spline' //图表的显示类型（line,spline,scatter,splinearea bar,pie,area,column）
        },
        title: {
            text: '',
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0  //Y轴最小值
        },
        credits: {
            enabled: false     //去掉highcharts网站url  
        },
        series: data,
        tooltip: {
            formatter: tips
        }
    });
}

/**
 * tooltip for common
 */
function tips() {
    return this.x + '：<br>' + this.series.name + '：<br>' + this.y;
}

/**
 * tooltip for match
 */
function tips_match() {
    var tips = this.x + '：<br>'
            + "总共：" + match_total[this.point.x] + "<br>";
    (this.series._i == 0) ? tips += "匹配成功:" + match_core[this.point.x] : tips += "匹配成功:" + match_plan[this.point.x];
    tips += '<br>';
    tips += this.series.name + "：" + this.y;
    return tips;
}

function getPercent(total, data) {
    return parseFloat((data / total).toFixed(3));
}