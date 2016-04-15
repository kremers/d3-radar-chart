$(document).ready(function(){

  function randomizeVal(value, metric){
    return null;
  }

  var axisValues = {
    "Load Avg": {
      metric: "Load Avg",
      min: 0.0,
      max: 100.0,
      step: 1
    }, //% Activity
    "Mem Use": {
      metric: "Mem Use",
      min: 0,
      max: 100.0,
      step: 1
    }, //% Activity
    "Network RX": {
      metric: "Network RX",
      min: 0,
      max: 1000,
      step: 1
    }, //GB/s
    "Bytes R/s": {
      metric: "Bytes R/s",
      min: 0,
      max: 1000,
      step: 50
    }, //GB/s
    "Bytes W/s": {
      metric: "Bytes W/s",
      min: 0,
      max: 1000,
      step: 1
    }, //GB/s
    "Tasks": {
      metric: "Tasks",
      min: 0,
      max: 50,
      step: 1
    } //#
  };

  var axis = new RadarChartAxis(_.values(axisValues), {
    width: 400,
    height: 400,
    factorLegend: 1,
    radians: 2 * Math.PI,
    maxValue: 100, // TODO: Make this dynamic
  });

  //Min Chart
  var minMetrics = [{
    metric: "Load Avg",
    value: 0.25 * axisValues["Load Avg"].max,
    unit: "%"
  }, {
    metric: "Mem Use",
    value: 0.25 * axisValues["Mem Use"].max,
    unit: "%"
  }, {
    metric: "Network RX",
    value: 0.25 * axisValues["Network RX"].max,
    unit: "GB/S"
  }, {
    metric: "Bytes R/s",
    value: 0.25 * axisValues["Bytes R/s"].max,
    unit: "GB/S"
  }, {
    metric: "Bytes W/s",
    value: 0.25 * axisValues["Bytes W/s"].max,
    unit: "GB/S"
  }, {
    metric: "Tasks",
    value: 0.25 * axisValues["Tasks"].max,
    unit: "tasks"
  }];

  var minOptions = {
    className: "min-radar",
    color: "#FFDDDD",
    stroke: "#2ecc71",
    opacityArea: 1.0,
    draggable: true
  };
  var minRadarChart = new NewRadarChart(minMetrics, minOptions);

  //Max Chart
  var maxOptions = {
    className: "max-radar",
    color: "#2ecc71",
    stroke: "#2ecc71",
    draggable: true,
    minBoundingFn: function(metric) {
      //bounded to the the current normalized value of the min chart
      return minRadarChart.getData(metric).normalizedVal;
    }
  };

  var maxMetrics = [{
    metric: "Load Avg",
    value: 0.75 * axisValues["Load Avg"].max,
    unit: "%"
  }, {
    metric: "Mem Use",
    value: 0.75 * axisValues["Mem Use"].max,
    unit: "%"
  }, {
    metric: "Network RX",
    value: 0.75 * axisValues["Network RX"].max,
    unit: "GB/S"
  }, {
    metric: "Bytes R/s",
    value: 0.75 * axisValues["Bytes R/s"].max,
    unit: "GB/S"
  }, {
    metric: "Bytes W/s",
    value: 0.75 * axisValues["Bytes W/s"].max,
    unit: "GB/S"
  }, {
    metric: "Tasks",
    value: 0.75 * axisValues["Tasks"].max,
    unit: "tasks"
  }];
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
    stroke: "rgb(253, 255, 91)",
    draggable: false
  };

  var liveMetrics = [{
    metric: "Load Avg",
    value: 0.5 * axisValues["Load Avg"].max,
    unit: "%"
  }, {
    metric: "Mem Use",
    value: 0.5 * axisValues["Mem Use"].max,
    unit: "%"
  }, {
    metric: "Network RX",
    value: 0.5 * axisValues["Network RX"].max,
    unit: "GB/S"
  }, {
    metric: "Bytes R/s",
    value: 0.5 * axisValues["Bytes R/s"].max,
    unit: "GB/S"
  }, {
    metric: "Bytes W/s",
    value: 0.5 * axisValues["Bytes W/s"].max,
    unit: "GB/S"
  }, {
    metric: "Tasks",
    value: 0.5 * axisValues["Tasks"].max,
    unit: "tasks"
  }];
  var liveRadarChart = new NewRadarChart(liveMetrics, liveOptions);

  //backChart
  var backOptions = {
    className: "back-radar",
    color: "#FFDDDD",
    opacityArea: 1.0,
    draggable: false
  };

  var backMetrics = [{
    metric: "Load Avg",
    value: 100.0,
    unit: "%"
  }, {
    metric: "Mem Use",
    value: 100.0,
    unit: "%"
  }, {
    metric: "Network RX",
    value: 1000,
    unit: "GB/S"
  }, {
    metric: "Bytes R/s",
    value: 1000,
    unit: "GB/S"
  }, {
    metric: "Bytes W/s",
    value: 1000,
    unit: "GB/S"
  }, {
    metric: "Tasks",
    value: 50,
    unit: "tasks"
  }];
  var backChart = new NewRadarChart(backMetrics, backOptions);


  var chartSet = new RadarChartSet("#chart", axis, {
    width: 400,
    height: 400,
    radius: 3
  });

  chartSet.addRadarChart(backChart);
  chartSet.addRadarChart(maxRadarChart);
  chartSet.addRadarChart(minRadarChart);
  chartSet.addRadarChart(liveRadarChart);
  chartSet.draw();
});
