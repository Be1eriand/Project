var charts = document.getElementsByClassName("gaugechart");
var gaugeChart_img;

for (var i = 0; i < charts.length; i++) {
  createChart(charts[i], ($(charts[i]).attr('cur')), ($(charts[i]).attr('exp')));
};
function between(x, min, max) {
  return x >= min && x <= max;
}
function createChart(chartNum, current, expected) {
  var ctx = chartNum;
  percent = (current / expected) * 100;
  remainder = expected - current;

  if (remainder < 0) {
    remainder = 0;
  }
  if (between(percent, 95, 100) || percent > 100) {
    col = 'rgb(132, 186, 91)';
  } else if (between(percent, 85, 94)) {
    col = 'rgb(170, 222, 109)';
  } else if (between(percent, 75, 84)) {
    col = 'rgb(251, 209, 72)';
  } else if (between(percent, 65, 74)) {
    col = 'rgb(249, 151, 93)';
  } else {
    col = 'rgb(200, 92, 92)';
  };
  var myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          label: "My First Dataset",
          data: [current, remainder],
          backgroundColor: [col, "rgb(176,176,176)"],
          hoverBorderColor: 'lightgrey',
          hoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: chart => gaugeGraphClick(uid, mid, jid, sdate, tdate),
      onHover: function (e, elements) {
        $(e.currentTarget).css("cursor", "pointer");
      },
      hover: {
        mode: 'dataset',
        intersect: false,
      },
      rotation: 270,
      circumference: 180,
      elements: {
        arc: {
          borderWidth: 0,
          borderColor: 'rgb(0, 0, 0)',
        },
      },
      events: [],
    },
    plugins: [{
      afterDraw: chart => drawNeedle(chart, expected)
    }],
  });

  gaugeChart_img = myChart;
  myChart = null;
  
};

function drawNeedle(canvasID, target) {

  var needleValue = target;
  var dataTotal = canvasID.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
  var angle = Math.PI + (1 / dataTotal * needleValue * Math.PI);
  var ctx = canvasID.ctx;
  var cw = canvasID.canvas.offsetWidth;
  var ch = canvasID.canvas.offsetHeight;
  var cx = cw / 2;
  var cy = ch - 6;

  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(ch - 20, 0);
  ctx.lineTo(0, 3);
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fill();
  ctx.rotate(-angle);
  ctx.translate(-cx, -cy);
  ctx.beginPath();
  ctx.fill();

};
