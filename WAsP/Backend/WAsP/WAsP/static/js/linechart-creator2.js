var percent = parseInt(document.currentScript.getAttribute('perc'));
var expected = parseInt(document.currentScript.getAttribute('exp'));
var chartid = document.currentScript.getAttribute('chartid');

function generateRandom(input, len, max, min) {
    var output = [];
    for (var i = 0; i < len; i++) {
        output.push(parseInt((Math.floor(Math.random() * (max - min + 1) + min))))
    }
    return output;
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
var maxValue = productivity.reduce(function(a, b) {
    return Math.max(a, b);
});
var avgValue = productivity.reduce((a, b) => (a + b)) / productivity.length;
var pointBackgroundColors = [];
var pointBorderColors = [];







var myChart = new Chart(document.getElementById("line-chart2"), {
    type: 'line',
    data: {
        labels: ['9hr', '8hr', '7hr', '6hr', '5hr', '4hr', '3hr', '2hr', '1hr', '45min', '30min', '15min', '10min', '5min', '1min', '30sec', '15sec', '10sec', '5sec', 'Live'],
        datasets: [{
            data: productivity,
            label: "Actual Productivity",
            borderColor: "#000000",
            borderWidth: 2,
            backgroundColor: function(context) {
                const chart = context.chart;
                const { ctx, chartArea, scales } = chart;

                if (!chartArea) {
                    return null;
                }
                return getGradient(ctx, chartArea, scales);
            },
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBorderColors,
            lineTension: 0.5,
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
                max: maxValue+5,
                min: -maxValue-5,
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
        }
    },
});


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
        gradient.addColorStop(pointzeroPercentage, "rgb(132, 186, 91)");
        gradient.addColorStop(pointzeroPercentage, "rgb(211, 94, 96)");

    }
    return gradient;
}

for (i = 0; i < myChart.data.datasets[0].data.length; i++) {
    if (myChart.data.datasets[0].data[i] >= 0) {
        pointBackgroundColors.push("#90cd8a");
        pointBorderColors.push("#488042");
    } else {
        pointBackgroundColors.push("#f58368");
        pointBorderColors.push("#8B0000");
    }
}

myChart.update();

function downloadChart() {
    var a = document.createElement('a');
    a.href = myChart.toBase64Image();
    a.download = 'chart_'+chartid+'.png';
    console.log(a.download)

    a.click();
}