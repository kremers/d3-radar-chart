$(document).ready(function(){
  var data = {
    "axes" : [
      {
        "axis" : "axis_one",
        "value": 9,
        "min" : 0,
        "max" : 20,
        "step": 1,
      },
      {
        "axis" : "axis_two",
        "value": 8,
        "min" : 0,
        "max" : 20,
        "step": 1,
      },
      {
        "axis" : "axis_three",
        "value": 8,
        "min" : 0,
        "max" : 20,
        "step": 1,
      },
      {
        "axis" : "axis_four",
        "value": 11,
        "min" : 0,
        "max" : 20,
        "step": 1,
      },
      {
        "axis" : "axis_five",
        "value": 15,
        "min" : 0,
        "max" : 20,
        "step": 1,
      },
      {
        "axis" : "axis_six",
        "value": 10,
        "min" : 0,
        "max" : 20,
        "step": 1,
      }
    ]
  };

  var config = {
    className: "example_b",
    radius: 5,
    width: 500,
    height: 500,
    maxValue: 20
  };

  var radar = new RadarChart("#chart", data, config);
  radar.draw();

  /*var temp = new RadarChart('#temp', data, {radius: 5, width: 400, height: 400});
  temp.draw();
  console.log(temp.config);*/






// Proposed API for this final product:

/*
var axis = new RadarChartAxis([
  {metric: "cpu", min: 0, max: 100},
  {metric: "ram", min: 0, max: 100},
  {metric: "network_io", min: 0, max: 1000},
  {metric: "disk_io", min: 0, max: 10000},
]);
var minMetrics = [{metric: "cpu", value: 10}, {metric: "ram", value: 10}, {metric: "network_id", value: 10}, {metric: "disk_id", value: 10}];
var minOptions = { className: "min-radar", ... }
var minRadarChart = new RadarChart(axis, minMetrics, minOptions);

var maxOptions = { className: "max-radar", minBoundingFn: function(metric) { return minRadarChart.getData()[metric]; }, ... }
var maxMetrics = [{metric: "cpu", value: 80}, {metric: "ram", value: 80}, {metric: "network_id", value: 800}, {metric: "disk_id", value: 1000}]
var maxRadarChart = new RadarChart(axis, maxMetrics, maxOptions);

minRadarChart.setOptions({maxBoundingFn: function(metric) { return maxRadarChart.getData()[metric]; } })

var liveMetrics = [{metric: "cpu", value: 60}, {metric: "ram", value: 60}, {metric: "network_id", value: 600}, {metric: "disk_id", value: 400}]
var liveRadarChart = new RadarChart(axis, liveMetrics, {className: "live-radar", draggable: false});
setInterval(function() {
  liveRadarChart.setData(liveMetrics);
}, 5000)

minRadarChart.getData() // So we can persist the boundaries when necessary

// The full monty
var chartSert = new RadarChartSet({width: 500, height: 500})
    .setAxis(axis)
    .addRadarChart(minRadarChart)
    .addRadarChart(maxRadarChart)
    .addRadarChart(liveRadarChart)
*/













});
