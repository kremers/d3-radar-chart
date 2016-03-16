$(document).ready(function(){

  //Example Data
  var data = [
    {
      className: 'argentina',
      axes: [
        {axis: "strength", value: 6},
        {axis: "intelligence", value: 7},
        {axis: "charisma", value: 10},
        {axis: "dexterity", value: 8},
        {axis: "luck", value: 9}
      ]
    },
    {
      className: 'germany',
      axes: [
        {axis: "strength", value: 13},
        {axis: "intelligence", value: 16},
        {axis: "charisma", value: 15},
        {axis: "dexterity", value: 12},
        {axis: "luck", value: 12}
      ]
    }
  ];

  //drag function is inside the bounds of the api, so I can move it from there

  //Initialize the Chart
  var chart = RadarChart.chart();
  var svg = d3.select('#chart').append('svg')
              .attr('width', 600)
              .attr('height', 800);

  //Call the Chart and Render It
  svg.append('g').classed('focus', 1).datum(data).call(chart);
});
