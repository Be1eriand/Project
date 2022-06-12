var charts = document.getElementsByClassName("gaugechart");

for (var i = 0; i < charts.length; i++) {
  createChart(charts[i], $(charts[i]).attr('cur'), $(charts[i]).attr('exp'), $(charts[i]).attr('jid'));
};
function between(x, min, max) {
  return x >= min && x <= max;
}
function createChart(chartNum, current, expected, jid) {
  var ctx = chartNum;
  percent = (current / expected) * 100;
  remainder = expected - current;

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
          label: ['Worked', 'Remaining'],
          data: [current, remainder],
          backgroundColor: [col, "rgb(230, 230, 230)"],
          hoverBorderColor: 'lightgrey',
          hoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: chart => window.location.href = gauge_url+jid,
      onHover: function (e, elements) {
        $(e.currentTarget).css("cursor", "pointer");
      },
      rotation: 270,
      circumference: 180,
      elements: {
        arc: {
          borderWidth: 0,
          borderColor: 'rgb(0, 0, 0)',
        },
      },
    },
  });

  myChart = null;
};