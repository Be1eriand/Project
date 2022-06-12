var charts = document.getElementsByClassName("chart");

for (var i = 0; i < charts.length; i++) {
  createChart(charts[i], ($(charts[i]).attr('cur') * 100), ($(charts[i]).attr('exp') * 100), $(charts[i]).attr('uid'), $(charts[i]).attr('mid'), $(charts[i]).attr('jid'), $(charts[i]).attr('start_date'), $(charts[i]).attr('to_date'));
};
function between(x, min, max) {
  return x >= min && x <= max;
}
function createChart(chartNum, current, expected, uid, mid, jid, sdate, tdate) {
  var ctx = chartNum.getContext("2d");

  ctx.clearRect(0, 0, chartNum.width, chartNum.height);

  percent = (current / expected)*100;
  remainder = 100 - current;

  if (remainder < 0) {
    remainder = 0;
  }
  if (between(percent, 95, 100) || percent > 100) {
    col_bg = 30;
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
      responsive:true,
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
      events: ['click'],
    },
    plugins: [{
      afterDraw: chart => drawNeedle(chart, expected)
    }],
  });

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

function gaugeGraphClick(id, machine, job, from, to) {
  window.location.href = '../'+id+'/0/'+job+'/'+from+'/'+to;
};



