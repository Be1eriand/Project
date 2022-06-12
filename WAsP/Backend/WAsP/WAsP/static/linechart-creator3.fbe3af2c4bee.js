var percent = parseInt(document.currentScript.getAttribute('perc'));
var expected = parseInt(document.currentScript.getAttribute('exp'));
var chartid = document.currentScript.getAttribute('chartid');

function generateRandom(input, len, max, min) {
    var output_real = [];
    var output_perc = [];
    for (var i = 0; i < len; i++) {
        value = parseInt((Math.floor(Math.random() * (max - min + 1) + min)));
        value_real = value + parseInt(input);
        output_real.push(value_real);
        pos = i - 1;
        if (pos >= 0) {
            perc_calc = ((value_real - output_real[pos]) / output_real[pos]) * 100;
            output_perc.push(perc_calc);
        } else {
            first_calc = ((value_real-expected)/expected)*100;
            output_perc.push(first_calc);
        }
    }
    return [output_real, output_perc];
};

function getAverage(input, len) {
    const sum = input.reduce((a, b) => a + b, 0);
    const avg = (sum / input.length) || 0;
    output = []
    for (var i = 0; i < len; i++) {
        output.push(avg);
    };
    return output;
};

var productivity = generateRandom(percent, 20, 15, -15);
var productivity_real = productivity[0];
var productivity_perc = productivity[1];

var maxValue_real = productivity_real.reduce(function(a, b) {
    return Math.max(a, b);
});
var maxValue_perc = productivity_perc.reduce(function (a, b) {
    return Math.max(a, b);
});

var avgValue_real = productivity_real.reduce((a, b) => (a + b)) / productivity_real.length;
var avgValue_perc = productivity_perc.reduce((a, b) => (a + b)) / productivity_perc.length;

var pointBackgroundColors = [];
var pointBorderColors = [];

var myChart_line = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
        labels: ['9hr', '8hr', '7hr', '6hr', '5hr', '4hr', '3hr', '2hr', '1hr', '45min', '30min', '15min', '10min', '5min', '1min', '30sec', '15sec', '10sec', '5sec', 'Live'],
        datasets: [{
            data: [expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected, expected],
            label: "Target Productivity",
            borderColor: "rgb(70,130,180)",
            fill: false,
            borderWidth: 3,
            borderDash: [5, 5],
            pointStyle: 'line',
            fill: false,
        }, {
            data: productivity_real,
            label: "Actual Productivity",
            borderColor: "#000000",
            borderWidth: 1,
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBorderColors,
            fill: false,
            pointRadius: 10,
            radius: 10,
            lineTension: 0.4
    }]
    },
    options: {
        scales: {
            y: [{
                grid: {
                    color: "black",
                    display: true,
                    drawBorder: false,
                    zeroLineColor: "#000000",
                    zeroLineWidth: 3
                },
                max: maxValue_real+5,
                min: -maxValue_real-5,
            }],
            x: [{
                grid: {
                    color: "#FFFFFF",
                    zeroLineColor: "#FFFFFF"
                },
            }]
        },
        legend: {
            position: 'right',
            labels: {
                usePointStyle: true
            },
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, productivity_real) {
                    return tooltipItems.yLabel + "%";
                }
            }
        }
    }
});
console.log(productivity_perc)

var myChart_bar = new Chart(document.getElementById("bar-chart"), {
    data: {
        labels: ['9hr', '8hr', '7hr', '6hr', '5hr', '4hr', '3hr', '2hr', '1hr', '45min', '30min', '15min', '10min', '5min', '1min', '30sec', '15sec', '10sec', '5sec', 'Live'],
        datasets: [{
            type: 'bar',
            data: productivity_perc,
            borderColor: "#000000",
            borderWidth: 1,
            backgroundColor: function (context) {
                const chart = context.chart;
                const { ctx, chartArea, scales } = chart;

                if (!chartArea) {
                    return null;
                }
                return getGradient(ctx, chartArea, scales);
            },
            fill: true,
        },
        {
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: "#000000",
            borderWidth: 1,
            pointRadius: 0,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, productivity_real) {
                    return tooltipItems.yLabel + "%";
                }
            }
        }
    }
});

console.log(myChart_bar.data);

function getGradient(ctx, chartArea, scales) {
    let width, height, gradient;
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;

    if (gradient === null || width !== chartWidth || height !== chartHeight) {
        const pointzero = scales.y.getPixelForValue(0);
        const pointzeroheight = pointzero - chartArea.top;
        const pointzeroPercentage = pointzeroheight / chartHeight;

        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartHeight + chartArea.top);
        gradient.addColorStop(pointzeroPercentage, "rgba(132, 186, 91, 0.3)");
        gradient.addColorStop(pointzeroPercentage, "rgba(211, 94, 96, 0.3)");

    }
    return gradient;
}

for (i = 0; i < myChart_line.data.datasets[1].data.length; i++) {
    if (myChart_line.data.datasets[1].data[i] >= myChart_line.data.datasets[0].data[i]) {
        pointBackgroundColors.push("#90cd8a");
        pointBorderColors.push("#488042");
    } else {
        pointBackgroundColors.push("#f58368");
        pointBorderColors.push("#8B0000");
    }
}

myChart_line.update();
myChart_bar.update();

function downloadChart() {
    var a = document.createElement('a');
    a.href = myChart.toBase64Image();
    a.download = 'chart_'+chartid+'.png';
    console.log(a.download)

    a.click();
}