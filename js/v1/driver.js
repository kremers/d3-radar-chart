$(document).ready(function(){
  var data = [{
    "className": "Example Class",
    "normalize": true,
    "scale_max": 20,
    "axes" : [
      {
        "axis" : "axis_one",
        "value": 4,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true
      },
      {
        "axis" : "axis_two",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true
      },
      {
        "axis" : "axis_three",
        "value": 7,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true
      },
      {
        "axis" : "axis_four",
        "value": 3,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true
      },
      {
        "axis" : "axis_five",
        "value": 4,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true
      }
    ]
  }];

  var radar = new RadarChart('#radar', data);
  radar.draw();
  console.log(radar.config);

  /*var temp = new RadarChart('#temp', data, {radius: 5, width: 400, height: 400});
  temp.draw();
  console.log(temp.config);*/
  
});