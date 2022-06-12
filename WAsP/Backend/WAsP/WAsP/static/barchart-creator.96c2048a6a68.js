var charts = document.getElementsByClassName("barchart");

for (var i = 0; i < charts.length; i++) {
  createChart(charts[i], $(charts[i]).attr('cur'), $(charts[i]).attr('exp'), $(charts[i]).attr('cur_label'), $(charts[i]).attr('exp_label'), $(charts[i]).attr('rev'));
};



function between(x, min, max) {
  return x >= min && x <= max;
}
function createChart(chartNum, current, expected, cur_label, exp_label, reverse) {
  current = parseInt(current);
  expected = parseInt(expected);

  var ctx = chartNum;
  percent = (current / expected) * 100;
  remainder = expected - current;

  if (remainder < 0) {
    remainder = 0;
  }
  if (!reverse) {
    if (between(percent, 75, 100) || percent > 100) {
      col = 'rgb(132, 186, 91)';
    } else if (between(percent, 55, 74)) {
      col = 'rgb(170, 222, 109)';
    } else if (between(percent, 35, 54)) {
      col = 'rgb(251, 209, 72)';
    } else if (between(percent, 15, 34)) {
      col = 'rgb(249, 151, 93)';
    } else {
      col = 'rgb(200, 92, 92)';
    };
  } else {
    if (between(percent, 75, 100) || percent > 100) {
      col = 'rgb(200, 92, 92)';
    } else if (between(percent, 55, 74)) {
      col = 'rgb(249, 151, 93)';
    } else if (between(percent, 35, 54)) {
      col = 'rgb(251, 209, 72)';
    } else if (between(percent, 15, 34)) {
      col = 'rgb(170, 222, 109)';
    } else {
      col = 'rgb(132, 186, 91)';
    };
  }
  
  var myChart = new Chart(ctx, {
    type: "bar",
    data:{
      labels: ['Data'],
      datasets: [{
        label: cur_label,
        data: [current],
        backgroundColor: col,
        barThickness: 50,
      }, {
        label: exp_label,
        data: [remainder],
        backgroundColor: 'rgb(230, 230, 230)',
        barThickness: 50,
      }
    ]
    },
    options: {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        }
      },
      responsive: true,
      scales: {
        x: {
          display: true,
          stacked: true,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: false,
            drawTicks: true
          },
          max: expected,
          ticks: {
            count: 2,
            beginsAtZero: true,
            suggestedMax: expected,
          }
        },
        y: {
          display: false,
          stacked: true,
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false
          },
        }
      },
      plugins: {
        legend: {
          display: false
        },
      }
    },
  });

  myChart = null;
};