$(document).ready(function(){

  var axis = new RadarChartAxis([
    { metric: "cpu", min: 0, max: 10, step: 1},
    { metric: "ram", min: 0, max: 4096, step: 1},
    { metric: "network_io", min: 0, max: 100, step: 1 },
    { metric: "disk_io", min: 0, max: 100, step: 1 },
    { metric: "blah1", min: 0, max: 100, step: 1 },
    { metric: "blah2", min: 0, max: 100, step: 1}
    ], {
    width: 500,
    height: 500,
    factorLegend: 1,
    radians: 2 * Math.PI,
    maxValue: 100, // TODO: Make this dynamic
  });

  var minMetrics = [
    { metric: "cpu", value: 3},
    { metric: "ram", value: 1024 },
    { metric: "network_io", value: 10 },
    { metric: "disk_io", value: 10 },
    { metric: "blah1", value: 10 },
    { metric: "blah2", value: 10 }
  ];

  var minOptions = { className: "min-radar", color: "#FFF", opacityArea: 1 };
  var minRadarChart = new NewRadarChart(minMetrics, minOptions);

  var maxOptions = { className: "max-radar", color: "#0097D6" };
  var maxMetrics = [
    { metric: "cpu", value: 5 },
    { metric: "ram", value: 2048},
    { metric: "network_io", value: 45 },
    { metric: "disk_io", value: 35 },
    { metric: "blah1", value: 47 },
    { metric: "blah2", value: 50 }
  ];

  var maxRadarChart = new NewRadarChart(maxMetrics, maxOptions);
  var chartSet = new RadarChartSet("#chart", axis, {
    width: 500,
    height: 500,
    radius: 4
  });

  chartSet.addRadarChart(maxRadarChart);
  chartSet.addRadarChart(minRadarChart);
  chartSet.draw();
});
