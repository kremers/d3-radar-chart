$(document).ready(function(){

  /*var radar = new RadarChart("#chart", data, config);
  radar.draw();*/

  /*var temp = new RadarChart('#temp', data, {radius: 5, width: 400, height: 400});
  temp.draw();
  console.log(temp.config);*/






// Proposed API for this final product:

/*
var axis = new RadarChartAxis([
  {metric: "cpu", min: 0, max: 100, step: 1},
  {metric: "ram", min: 0, max: 100, step: 1},
  {metric: "network_io", min: 0, max: 1000, step: 10},
  {metric: "disk_io", min: 0, max: 10000, step: 100},
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
var chartSert = new RadarChartSet(axis, {width: 500, height: 500})
    .addRadarChart(minRadarChart)
    .addRadarChart(maxRadarChart)
    .addRadarChart(liveRadarChart)
*/


var axis = new RadarChartAxis([
  {metric: "cpu", min: 0, max: 100, step: 1},
  {metric: "ram", min: 0, max: 100, step: 1},
  {metric: "network_io", min: 0, max: 100, step: 1},
  {metric: "disk_io", min: 0, max: 100, step: 1},
  {metric: "blah1", min: 0, max: 100, step: 1},
  {metric: "blah2", min: 0, max: 100, step: 1},
], {
  width: 500,
  height: 500,
  factorLegend: 1,
  radians: 2 * Math.PI,
  maxValue: 100, // TODO: Make this dynamic
});
var minMetrics = [{metric: "cpu", value: 10}, {metric: "ram", value: 10}, {metric: "network_io", value: 10}, {metric: "disk_io", value: 10}, {metric: "blah1", value: 10}, {metric: "blah2", value: 10}];
var minOptions = { className: "min-radar" }
var minRadarChart = new NewRadarChart(minMetrics, minOptions);

/*var maxOptions = { className: "max-radar" }
var maxMetrics = [{metric: "cpu", value: 80}, {metric: "ram", value: 80}, {metric: "network_io", value: 800}, {metric: "disk_io", value: 1000}, {metric: "blah1", value: 90}, {metric: "blah2", value: 100}]
var maxRadarChart = new NewRadarChart(maxMetrics, maxOptions);
*/

var chartSet = new RadarChartSet("#chart", axis, {width: 500, height: 500});
  chartSet.addRadarChart(minRadarChart)
  //chartSet.addRadarChart(maxRadarChart)





});
