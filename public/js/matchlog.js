function realtime_statistics(obj)
{
    var month = getMonth();
    var url = "?s=LogMatch/get_statistics";
    getDataAjax(url, {
        action: "m_nDailyRequestNum",
        legend: "匹配率",
        month: month
    }, onDataRecieved);
    function onDataRecieved(ret) {
        var total = ret.data;
        var request = [{
                url: url,
                // 核心库匹配率
                action: "m_nDailyMatchedNum",
                legend: "核心库匹配率",
                month: month
            }, {
                url: url,
                // 方案库匹配率
                action: "m_nDailyPlanMatched",
                legend: "方案库匹配率",
                month: month
            }, {
                url: url,
                // 带柱子的方案库
                action: "m_nDailyPlanMatchedAdd",
                legend: "带柱子的方案库匹配率",
                month: month
            }];
        initSeriesData(obj, null, request, getPercent, total);
    }
}

function monthMatchDoor4(obj) {
    var month = getMonth();
    var url = "?s=LogMatch/get_statistics";
    getDataAjax(url, {
        action: "m_nDailyRequestNum4",
        legend: "核心库匹配率",
        month: month
    }, onDataRecieved);
    function onDataRecieved(ret) {
        var total = ret.data;
        var request = [{
                url: url,
                action: "m_nDailyMatchedNum4", // 匹配率
                legend: "核心库匹配率",
                month: month
            }, {
                url: url,
                action: "m_nDailyPlanMatched4", // 方案库
                legend: "方案库匹配率",
                month: month
            }, {
                url: url,
                action: "m_nDailyPlanMatchedAdd4", // 带柱子的方案库
                legend: "带柱子的方案库匹配率",
                month: month
            }];
        initSeriesData(obj, null, request, getPercent, total);
    }
}

/**
 * 画表通用函数
 */
function initSeriesData(obj, chartOptions, request, datahandler, total) {
    $.each(request, function(i, item) {
        getDataAjax(
                item.url,
                {
                    action: item.action,
                    legend: item.legend,
                    month: item.month
                },
        onDataRecieved)
    });
    // 定义全局参数给plot用
    var data = [], real_data = [], label = [], count = 0;
    var flotOptions = setFlotOptions(label);
    var placeholder = $(obj);

    $.plot(placeholder, data, flotOptions);
    // ajax接收到数据后回调 
    function onDataRecieved(series) {
        //处理单个数据
        var tmp_data = [];
        var percent = 0;
        var seriesData = series.data;
        // 先判断一下数据长度是否一样，不一样则提示一下
        if (total.length != seriesData.length) {
            debug("数据源长度不一致，请检查数据。");
        }
        $.each(total, function(i, item) {
            if (count == 0)
                label.push([i, seriesData[i].writetime]);
            percent = datahandler(item.data, seriesData[i].data);
            real_data[count] = seriesData;
            tmp_data.push([i, percent]);
        });
        data[count] = {
            label: series.legend,
            data: tmp_data
        }
        if (count == 0)
            flotOptions = setFlotOptions(label);
        count++; // 用一个全局变量维持label只做1次

        $.plot(placeholder, data, flotOptions);
    }
    var previousPoint = null;
    placeholder.bind("plothover", function(event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {

                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                        y = parseInt((item.datapoint[1].toFixed(2)) * 100) + "%";
                var total_count = total[item.dataIndex].data;
                var current_data = real_data[item.seriesIndex][item.dataIndex].data;

                showTooltip(item.pageX, item.pageY, "匹配率：" + y + "；<br />总共：" + total_count + "；<br />匹配成功：" + current_data);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
}
// 柱状图
function flot_base_core(obj)
{
    var request = [{
            url: "?s=LogMatch/getMaintainlib",
            action: "base_cnt", // 当天总的匹配请求数
            legend: "基础库"  //把标题也传过去
        }, {
            url: "?s=LogMatch/getMaintainlib",
            action: "core_cnt", // 当天匹配到的请求数
            legend: "核心库"  //把标题也传过去
        }];
    $.each(request, function(i, item) {
        getDataAjax(item.url, {
            action: item.action,
            legend: item.legend
        }, onDataRecieved)
    });
    // 定义全局参数给plot用
    var data = [], real_data = [], label = [], count = 0, label_tips = [];
    // 不断向data添加数据 
    var placeholder = $(obj);
    var options = {
        series: {
            lines: {
                show: true
            },
            bars: {
                show: true,
                barWidth: 0.6
            }
        },
        xaxis: {
            ticks: label
        },
        grid: {
            clickable: true,
            hoverable: true
        },
        legend: {
            show: true
        }
    }
    $.plot(placeholder, data, options);
    // ajax接收到数据后回调 
    function onDataRecieved(series) {
        //处理单个数据
        var tmp_data = [];
        var seriesData = series.data;
        $.each(seriesData, function(i, item) {
            // 第一个数据时，将label和legend写好
            if (count == 0)
            {
                label.push([i, item.writetime]);
            }
            real_data[count] = seriesData;
            tmp_data.push([i, item.data]);
        });
        label_tips[count] = series.legend;
        data[count] = {
            // 这里legend也需要服务器端返回，不然会出现 ajax 返回先后的问题
            label: series.legend,
            data: tmp_data
        }
        count++; // 用一个全局变量维持label只做1次
        $.plot(placeholder, data, options);
    }
    var previousPoint = null;
    placeholder.bind("plothover", function(event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                $("#tooltip").remove();
                var tips = data[item.seriesIndex].label + "：" + real_data[item.seriesIndex][item.dataIndex].data + "<br />";
                var index_2 = item.seriesIndex ? 0 : 1 ;
                tips  += data[index_2].label + "：" + real_data[index_2][item.dataIndex].data;
                showTooltip(pos.pageX, pos.pageY, tips);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
}

// 数据的处理方式
function getIntData(series) {
    return parseInt(series.data);
}
function getPercent(total, data) {
    return (data / total).toFixed(2);
}

function showTooltip(x, y, contents) {
    $("<div id='tooltip'>" + contents + "</div>").css({
        position: "absolute",
        display: "none",
        top: y + 5,
        left: x + 5,
        border: "1px solid #fdd",
        "background-color": "#fee",
        opacity: 0.80
    }).appendTo("#container").fadeIn(200);
}

/****        图表的配置       ***/
function setFlotOptions(label)
{
    var flotOptions = {
        series: {
            lines: {
                show: true,
                step: true
            },
            points: {
                show: true
            }
        },
        legend: {
            backgroundOpacity: 0.5,
            position: 'se'
        },
        grid: {
            hoverable: true,
            clickable: true
        },
        xaxis: {
            ticks: label
//            ticks: ""
        },
        yaxis: {
            min: 0,
            max: 1
        }
    };
    return flotOptions;
}