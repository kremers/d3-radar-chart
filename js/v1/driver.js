$(document).ready(function(){

  function randomizeVal(value, metric){

  }

  //Main
  var axis = new RadarChartAxis([
    { metric: "CPU", min: 0.0, max: 5.0, step: 1}, //GHz
    { metric: "Memory", min: 0, max: 16384, step: 1}, //MB
    { metric: "Bandwidth", min: 0, max: 100, step: 1 }, //MB.S
    { metric: "Disk_Read", min: 0, max: 100, step: 1},
    { metric: "Disk_Write", min: 0, max: 100, step: 1},
    { metric: "Tasks", min: 0, max: 30, step: 1 }
  ], {
    width: 400, height: 400, factorLegend: 1,
    radians: 2 * Math.PI, maxValue: 100, // TODO: Make this dynamic
  });

  //Min Chart
  var minMetrics = [
    { metric: "CPU", value: 2.1, unit: "GHz"},
    { metric: "Memory", value: 4096, unit: "MB"},
    { metric: "Bandwidth", value: 10, unit: "MB/S"},
    { metric: "Disk_Read", value: 10, unit: "MB/S"},
    { metric: "Disk_Write", value: 12, unit: "MB/S"},
    { metric: "Tasks", value: 5, unit: ""}
  ];

  var minOptions = {
    className: "min-radar",
    color: "#FFF",
    stroke: "#0097D6",
    opacityArea: 1,
    draggable: true
  };
  var minRadarChart = new NewRadarChart(minMetrics, minOptions);

  //Max Chart
  var maxOptions = {
    className: "max-radar",
    color: "#0097D6",
    stroke: "#0097D6",
    draggable: true,
    minBoundingFn: function(metric){
      return minRadarChart.getData()[metric];
    }
  };

  var maxMetrics = [
    { metric: "CPU", value: 4.5, unit: "GHz"},
    { metric: "Memory", value: 12288, unit: "MB"},
    { metric: "Bandwidth", value: 85, unit: "MB/S"},
    { metric: "Disk_Read", value: 75, unit: "MB/S"},
    { metric: "Disk_Write", value: 89, unit: "MB/S"},
    { metric: "Tasks", value: 25, unit: "MB/S"}
  ];
  var maxRadarChart = new NewRadarChart(maxMetrics, maxOptions);
  minRadarChart.setOptions({maxBoundingFn: function(metric){return maxRadarChart.getData()[metric];}});

  //Live Chart
  var liveOptions = {
    className: "live-radar",
    color: "#40d47e",
    stroke: "#27ae60",
    draggable: false
  };

  var liveMetrics = [
    { metric: "CPU", value: 3.0, unit: "GHz"},
    { metric: "Memory", value: 8192, unit: "MB"},
    { metric: "Bandwidth", value: 50, unit: "MB/S"},
    { metric: "Disk_Read", value: 50, unit: "MB/S"},
    { metric: "Disk_Write", value: 50, unit: "MB/S"},
    { metric: "Tasks", value: 18, unit: "MB/S"}
  ];
  var liveRadarChart = new NewRadarChart(liveMetrics, liveOptions);


  var chartSet = new RadarChartSet("#chart", axis, {
    width: 400,
    height: 400,
    radius: 3
  });

  chartSet.addRadarChart(maxRadarChart);
  chartSet.addRadarChart(liveRadarChart);
  chartSet.addRadarChart(minRadarChart);

  chartSet.draw();
});
