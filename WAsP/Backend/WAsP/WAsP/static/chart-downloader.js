function downloadChart(imgid, chart) {
    var a = document.createElement('a');
    a.href = chart.toBase64Image();
    a.download = 'chart_' + imgid + '.png';
    a.click();
}