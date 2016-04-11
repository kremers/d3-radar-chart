$(document).ready(function(){

  function randomizeVal(value, metric){
    return null;
  }

  //Main

  var red = "#E7594B";
  var green = "#2ecc71";
  var blue = "#00976D";

  var axis = new RadarChartAxis([
    { metric: "CPU", min: 0.0, max: 100.0, step: 1}, //% Activity
    { metric: "Memory", min: 0, max: 100.0, step: 1}, //% Activity
    { metric: "Bandwidth", min: 0, max: 100, step: 1 }, //GB/s
    { metric: "Disk_Read", min: 0, max: 100, step: 1}, //GB/s
    { metric: "Disk_Write", min: 0, max: 100, step: 1}, //GB/s
    { metric: "Tasks", min: 0, max: 50, step: 1 } //#
  ], {
    width: 300, height: 300, factorLegend: 1,
    radians: 2 * Math.PI, maxValue: 100, // TODO: Make this dynamic
  });

  //Min Chart
  var minMetrics = [
    { metric: "CPU", value: 25.0, unit: "%"},
    { metric: "Memory", value: 25.0, unit: "%"},
    { metric: "Bandwidth", value: 25, unit: "GB/S"},
    { metric: "Disk_Read", value: 25, unit: "GB/S"},
    { metric: "Disk_Write", value: 25, unit: "GB/S"},
    { metric: "Tasks", value: 12.75, unit: "tasks"}
  ];

  var minOptions = {
    className: "min-radar",
    color: red,
    stroke: red,
    opacityArea: 1.0,
    draggable: true
  };
  var minRadarChart = new NewRadarChart(minMetrics, minOptions);

  //Max Chart
  var maxOptions = {
    className: "max-radar",
    color: green,
    stroke: green,
    draggable: true,
    opacityArea: 1.0,
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
    { metric: "Tasks", value: 37.75, unit: "tasks"}
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
    color: "rgba(236, 240, 241, 0.0)",
    stroke: "#000",
    draggable: false
  };

  var liveMetrics = [
    { metric: "CPU", value: 50.0, unit: "%"},
    { metric: "Memory", value: 50.0, unit: "%"},
    { metric: "Bandwidth", value: 50, unit: "GB/S"},
    { metric: "Disk_Read", value: 50, unit: "GB/S"},
    { metric: "Disk_Write", value: 50, unit: "GB/S"},
    { metric: "Tasks", value: 25.75, unit: "tasks"}
  ];
  var liveRadarChart = new NewRadarChart(liveMetrics, liveOptions);

  //backChart
  var backOptions = {
    className: "back-radar",
    color: "red",
    opacityArea: 0.7,
    draggable: false
  };

  var backMetrics = [
    { metric: "CPU", value: 100.0, unit: "%"},
    { metric: "Memory", value: 100.0, unit: "%"},
    { metric: "Bandwidth", value: 100, unit: "GB/S"},
    { metric: "Disk_Read", value: 100, unit: "GB/S"},
    { metric: "Disk_Write", value: 100, unit: "GB/S"},
    { metric: "Tasks", value: 50, unit: "tasks"}
  ];
  var backChart = new NewRadarChart(backMetrics, backOptions);


  var chartSet = new RadarChartSet("#chart", axis, {
    width: 300,
    height: 300,
    radius: 3
  });

  chartSet.addRadarChart(backChart);
  chartSet.addRadarChart(maxRadarChart);
  chartSet.addRadarChart(liveRadarChart);
  chartSet.addRadarChart(minRadarChart);
  chartSet.draw();
});
