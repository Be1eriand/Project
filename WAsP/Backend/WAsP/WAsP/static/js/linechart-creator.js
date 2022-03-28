var chart = $("#lineChartMain");

current = parseFloat(chart.attr('cur'));
expected = parseFloat(chart.attr('exp')) * 100;
count = line_graph_data.length;

function getAverage(input, len) {
    const sum = input.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const avg = (sum / input.length) || 0;
    output = []
    for (var i = 0; i < len; i++) {
        output.push(avg);
    };
    return output;
};

function getExpected(input, len) {
    output = []
    for (var i = 0; i < len; i++) {
        output.push(input);
    };
    return output;
};

function parseLabels(x) {
    output = []

    for (var i = 0; i < x.length; i++) {
        string = x[i] + " day" + ((x[i] != 1) ? "s" : "");
        output.push(string)
    };

    return output
};


var maxValue = line_graph_data.reduce(function(a, b) {
    return parseFloat(Math.max(a, b));
});

var minValue = line_graph_data.reduce(function (a, b) {
    return parseFloat(Math.min(a, b));
});

var avgValue = line_graph_data.reduce((a, b) => (parseFloat(a) + parseFloat(b))) / line_graph_data.length;

var pointBackgroundColors = [];
var pointBorderColors = [];

var myChart = new Chart(chart, {
    type: 'line',
    data: {
        labels: line_graph_labels,
        datasets: [{
            data: getAverage(line_graph_data, count),
            label: "Average %",
            borderColor: "rgb(251, 209, 72)",
            backgroundColor: "rgb(251, 209, 72)",
            fill: false,
            pointRadius: 0,
            borderWidth: 3,
            borderDash: [3, 2],
            pointStyle: 'line',
            order: 3,
        },{
            data: getExpected(expected, count),
            label: "Target %",
            borderColor: "rgb(70,130,180)",
            backgroundColor: "rgb(70,130,180)",
            fill: true,
            lineHeight: 2,
            pointStyle: 'line',
            fill: false,
            order: 1,
        }, {
            data: line_graph_data,
            label: "Actual %",
            borderColor: "rgb(0, 0, 0)",
            backgroundColor: "rgb(0, 0, 0)",
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBorderColors,
            fill: false,
            pointRadius: 4,
            order: 2,
            lineTension: 0.2
        }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: ['Productivity for Welder: ' + welder, '(Period: ' + from_date + ' to ' + to_date + ')'],
                color: 'rgb(0, 0, 0)',
                font: {
                    size: 14,
                    weight: 'bold',
                    lineHeight: 1.2,
                }
            }
        },
        maintainAspectRatio: false,
        bezierCurve: true,
        title: {
            display: true,
            text: chart
        },
        scales: {
            yAxis: {
                suggestedMax: (maxValue+10 < expected) ? parseInt(expected+10) : parseInt(maxValue+10),
                suggestedMin: (minValue-10 > expected) ? expected-10 : minValue-10,
                grace: 5,
                gridlines: {
                    display: true
                },
                order: 4,
                scaleLabel: {
                    display: true,
                    labelString: 'Productivity (%)'
                },
                ticks: {
                    color: 'rgb(0, 0, 0)',
                    callback: function (val, i) {
                        // Hide the label of every 2nd dataset
                        return this.getLabelForValue(val) + '%';
                    }
                },
                title: {
                    display: true,
                    text: 'Productivity (%)',
                    color: 'rgb(0, 0, 0)'
                }
            },
            xAxis: {
                order: 5
            }
        },
        legend: {
            position: 'right',
            labels: {
                usePointStyle: true
            },
        }
    },
});

for (i = 0; i < myChart.data.datasets[2].data.length; i++) {
    if (myChart.data.datasets[2].data[i] > myChart.data.datasets[1].data[i]) {
        pointBackgroundColors.push("#90cd8a");
        pointBorderColors.push("#488042");
    } else {
        pointBackgroundColors.push("#f58368");
        pointBorderColors.push("#8B0000");
    }
}

myChart.update();

var lineChart_img = myChart;