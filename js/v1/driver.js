$(document).ready(function(){

  function randomizeVal(value, metric){
    return null;
  }

  //Main
  var axis = new RadarChartAxis([
    { metric: "CPU", min: 0.0, max: 100.0, step: 1}, //% Activity
    { metric: "Memory", min: 0, max: 100.0, step: 1}, //% Activity
    { metric: "Bandwidth", min: 0, max: 100, step: 1 }, //GB/s
    { metric: "Disk_Read", min: 0, max: 100, step: 1}, //GB/s
    { metric: "Disk_Write", min: 0, max: 100, step: 1}, //GB/s
    { metric: "Tasks", min: 0, max: 50, step: 1 } //#
  ], {
    width: 400, height: 400, factorLegend: 1,
    radians: 2 * Math.PI, maxValue: 100, // TODO: Make this dynamic
  });

  //Min Chart
  var minMetrics = [
    { metric: "CPU", value: 20.0, unit: "%"},
    { metric: "Memory", value: 20.0, unit: "%"},
    { metric: "Bandwidth", value: 10, unit: "GB/S"},
    { metric: "Disk_Read", value: 10, unit: "GB/S"},
    { metric: "Disk_Write", value: 12, unit: "GB/S"},
    { metric: "Tasks", value: 5, unit: "tasks"}
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
      //bounded to the the current normalized value of the min chart
      return minRadarChart.getData(metric).normalizedVal;
    }
  };

  var maxMetrics = [
    { metric: "CPU", value: 75.0, unit: "%"},
    { metric: "Memory", value: 75.0, unit: "%"},
    { metric: "Bandwidth", value: 85, unit: "GB/S"},
    { metric: "Disk_Read", value: 75, unit: "GB/S"},
    { metric: "Disk_Write", value: 89, unit: "GB/S"},
    { metric: "Tasks", value: 45, unit: "tasks"}
  ];
  var maxRadarChart = new NewRadarChart(maxMetrics, maxOptions);

  //Set Bound Functions
  maxRadarChart.setOptions({
    //can only go up to the normalized max value of the chart
    maxBoundingFn: function(metric) {
      return maxRadarChart.getData(metric).normalizedMax;
    }
  });

  minRadarChart.setOptions({
    maxBoundingFn: function(metric) {
      //bounded by the normalized value of the max chart
      return maxRadarChart.getData(metric).normalizedVal;
    }
  });

  minRadarChart.setOptions({
    minBoundingFn: function(metric) {
      //minimum normalized val is 0
      return 0;
    }
  });

  //Live Chart
  var liveOptions = {
    className: "live-radar",
    color: "#40d47e",
    stroke: "#27ae60",
    draggable: false
  };

  var liveMetrics = [
    { metric: "CPU", value: 45.0, unit: "%"},
    { metric: "Memory", value: 45.0, unit: "%"},
    { metric: "Bandwidth", value: 50, unit: "GB/S"},
    { metric: "Disk_Read", value: 50, unit: "GB/S"},
    { metric: "Disk_Write", value: 50, unit: "GB/S"},
    { metric: "Tasks", value: 18, unit: "tasks"}
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
