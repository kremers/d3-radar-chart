$(document).ready(function(){
  var data = [{
    "className": "outer_loop",
    "normalize": true,
    "scale_max": 20,
    "show_polygon": true,
    "axes" : [
      {
        "axis" : "axis_one",
        "value": 16,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": false,
        "order": 0
      },
      {
        "axis" : "axis_two",
        "value": 16,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 1
      },
      {
        "axis" : "axis_three",
        "value": 16,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 2
      },
      {
        "axis" : "axis_four",
        "value": 16,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 3
      },
      {
        "axis" : "axis_five",
        "value": 16,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 4
      },
      {
        "axis" : "axis_six",
        "value": 16,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 5
      }
    ]
  },{
    "className": "streaming",
    "normalize": true,
    "scale_max": 20,
    "show_polygon": false,
    "axes" : [
      {
        "axis" : "axis_one",
        "value": 9,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": false,
        "order": 0
      },
      {
        "axis" : "axis_two",
        "value": 8,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 1
      },
      {
        "axis" : "axis_three",
        "value": 8,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 2
      },
      {
        "axis" : "axis_four",
        "value": 11,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 3
      },
      {
        "axis" : "axis_five",
        "value": 15,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 4
      },
      {
        "axis" : "axis_six",
        "value": 10,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 5
      }
    ]
  },{
    "className": "inner_loop",
    "normalize": true,
    "scale_max": 20,
    "show_polygon": true,
    "axes" : [
      {
        "axis" : "axis_one",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 0
      },
      {
        "axis" : "axis_two",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 1
      },
      {
        "axis" : "axis_three",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 2
      },
      {
        "axis" : "axis_four",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 3
      },
      {
        "axis" : "axis_five",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 4
      },
      {
        "axis" : "axis_six",
        "value": 5,
        "abs_min" : 0,
        "min" : 0,
        "abs_max" : 10,
        "max" : 10,
        "step": 1,
        "drag": true,
        "order": 5
      }
    ]
  }];

  var config = {
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

});
