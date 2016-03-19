##API Notes for Refactoring

Goal: to create a simple, reusable, json passable radar chart that takes in
the following values as an input, and have the ability to render multiple
radar charts, as well as have the ability to drag and see the data manipulation
in real time as the values are updated.

###Proposed Data Model

```
[{
  "className": "Name of the Class",
  "normalize": true,
  "scale_max": 20,
  "axes" : [
    {
      "axis" : "name of axis",
      "value": 4,
      "abs_min" : 0,
      "min" : 0,
      "abs_max" : 10,
      "max" : 10,
      "step": 1,
      "drag": true
    },
    {
      "axis" : "name of axis",
      "value": 5,
      "abs_min" : 0,
      "min" : 0,
      "abs_max" : 10,
      "max" : 10,
      "step": 1,
      "drag": true
    },
    {
      "axis" : "name of axis",
      "value": 7,
      "abs_min" : 0,
      "min" : 0,
      "abs_max" : 10,
      "max" : 10,
      "step": 1,
      "drag": true
    },
    {
      "axis" : "name of axis",
      "value": 3,
      "abs_min" : 0,
      "min" : 0,
      "abs_max" : 10,
      "max" : 10,
      "step": 1,
      "drag": true
    },
    {
      "axis" : "name of axis",
      "value": 4,
      "abs_min" : 0,
      "min" : 0,
      "abs_max" : 10,
      "max" : 10,
      "step": 1,
      "drag": true
    }
  ]
}]
```

###JSON Definition:

- `className`: name of the chart, used to differentiate which nodes belong to what chart (i.e min max variables)
- `normalize`: if you have multiple axes that operate on different scales (i.e
  not simple numerical values) enable normalization to render the graph on the
  same scale. this will also help to export data back to their original units based on the axis.
- `scale_max`: used to set the maximum scale value. if the axis values are all the same unit, this can help render the length of each axis. defaults to the max value of the axes passed in.
- `axes`: an array of axis. this is where the data will reside for the most part
- `axis`: name of an axis
- `value`: the value to be held on the axis
- `abs_min`: used in the normalization function, this determines the minimum value of the axis in question
- `min`: (optional param), used in a bounded min max radar chart (example soon), this adds a node to indicated the min threshold, as well as bind the draggable value node.
- `abs_max`: used in the normalization function, this determines the maximum value of the axis in question
- `max`: (optional param), used in a bounded min max radar chart (example soon), this adds a node to indicated the max threshold, as well as bind the draggable value node.
- `step`: (optional param), used to add steps to the axis, this binds the value nodes position to a per unit increase rather than a free-flowing element.
- `drag`: enables or disables the the drag call to the corresponding axis. This allows the value node as well as the min and max nodes (if defined) to be adjustable by the user.


###API Accessible Functions:

- `RadarChart.draw(id, data)`: binds the d3 element to the id passed in and creates the radar chart(s) based on the data passed in.
- `RadarChart.export([axes])`: exports the current values of the radar chart's JSON data when. by default, it exports all the data,. Add an array of axes names to pull only certain axis data
