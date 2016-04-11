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
    { metric: "CPU", value: 25.0, unit: "%"},
    { metric: "Memory", value: 25.0, unit: "%"},
    { metric: "Bandwidth", value: 25, unit: "GB/S"},
    { metric: "Disk_Read", value: 25, unit: "GB/S"},
    { metric: "Disk_Write", value: 25, unit: "GB/S"},
    { metric: "Tasks", value: 15, unit: "tasks"}
  ];

  var minOptions = {
    className: "min-radar",
    color: "#3498db",
    stroke: "#0097D6",
    opacityArea: 1,
    draggable: true
  };
  var minRadarChart = new NewRadarChart(minMetrics, minOptions);

  //Max Chart
  var maxOptions = {
    className: "max-radar",
    color: "#c0392b",
    stroke: "#c0392b",
    draggable: true,
    minBoundingFn: function(metric){
      //bounded to the the current normalized value of the min chart
      return minRadarChart.getData(metric).normalizedVal;
    }
  };

  var maxMetrics = [
    { metric: "CPU", value: 75.0, unit: "%"},
    { metric: "Memory", value: 75.0, unit: "%"},
    { metric: "Bandwidth", value: 75, unit: "GB/S"},
    { metric: "Disk_Read", value: 75, unit: "GB/S"},
    { metric: "Disk_Write", value: 75, unit: "GB/S"},
    { metric: "Tasks", value: 40, unit: "tasks"}
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
    color: "rgba(236, 240, 241,0.0)",
    stroke: "#ecf0f1",
    draggable: false
  };

  var liveMetrics = [
    { metric: "CPU", value: 55.0, unit: "%"},
    { metric: "Memory", value: 55.0, unit: "%"},
    { metric: "Bandwidth", value: 50, unit: "GB/S"},
    { metric: "Disk_Read", value: 50, unit: "GB/S"},
    { metric: "Disk_Write", value: 50, unit: "GB/S"},
    { metric: "Tasks", value: 25, unit: "tasks"}
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
