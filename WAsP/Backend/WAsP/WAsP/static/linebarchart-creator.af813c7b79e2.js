var chart = $("#lineBarChartMain");

expected = parseFloat(chart.attr('exp'));

count = line_graph_data.length;

function getExpected(input, len) {
    output = []
    for (var i = 0; i < len; i++) {
        output.push(input);
    };
    return output;
};


var myChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: line_graph_labels,
        datasets: [{
            data: bar_graph_data,
            label: "Actual Worked Hours",
            type: 'bar',
            yAxisID: 'y',
            borderColor: "rgba(112, 127, 184, 1)",
            borderWidth: 1,
            backgroundColor: "rgba(112, 127, 184, 0.8)",
            fill: true,
            order: 3,
        }, {
                data: getExpected(expected, count),
                type: 'line',
                label: "Goal Hours",
                borderColor: "rgb(251, 209, 72)",
                backgroundColor: "rgb(251, 209, 72)",
                yAxisID: 'y2',
                fill: false,
                pointRadius: 0,
                borderWidth: 3,
                borderDash: [3, 2],
                pointStyle: 'line',
                order: 3,
        }, {
            data: line_graph_data,
            type: 'line',
            yAxisID: 'y2',
            label: "Accumulated Worked Hours",
            borderColor: "rgb(0, 0, 0)",
            backgroundColor: "rgb(0, 0, 0)",
            fill: false,
            pointRadius: 4,
            order: 1,
            lineTension: 0.1
        }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Hours Logged for Job: ' + graph_job,
                color: 'rgb(0, 0, 0)',
                font: {
                    size: 20,
                    weight: 'bold',
                    lineHeight: 1.2,
                }
            },
            legend: {
                reverse: true
            }
        },
        maintainAspectRatio: false,
        bezierCurve: true,
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        title: {
            display: true,
            text: chart
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                gridlines: {
                    display: false,
                },
                grid: {
                    borderWidth: 3,
                    borderColor: 'rgb(112, 127, 184)'
                },
                ticks: {
                    color: 'rgb(112, 127, 184)',
                    callback: function (val, i) {
                        // Hide the label of every 2nd dataset
                        return this.getLabelForValue(val);
                    }
                },
                title: {
                    display: true,
                    text: 'Hrs per Shift (Hrs)',
                    color: 'rgb(112, 127, 184)'
                }
            },
            y2: {
                type: 'linear',
                position: 'right',
                gridlines: {
                    display: false
                },
                grid: {
                    borderWidth: 3,
                    borderColor: 'rgb(0, 0, 0)'
                },
                ticks: {
                    color: 'rgb(0, 0, 0)',
                    callback: function (val, i) {
                        // Hide the label of every 2nd dataset
                        return this.getLabelForValue(val);
                    }
                },
                title: {
                    display: true,
                    text: 'Accumulated Hours (Hrs)',
                    color: 'rgb(0, 0, 0)'
                }
            },
            x: {
                order: 5,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 50
                }
            }
        },
        legend: {
            position: 'right',
            labels: {
                usePointStyle: true
            },
        },
    },
});

var lineChart_img = myChart;