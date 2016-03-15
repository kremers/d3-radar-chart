$(document).ready(function(){
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

  RadarChart.draw("#chart", data);
});
