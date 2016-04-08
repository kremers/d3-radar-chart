### API Notes and JSON Definitions
*The Goal* is to create a reusable and extendible Library for draggable Radar charts,
that allow draggable and non-draggable nodes for each chart data object passed in.

The end user will be able to:
- view multiple stacked radar charts
- move drag enabled charts
- extract data from drag enabled charts

### Data Model
The Data model is how the API will accept the proposed data values and attributes
needed to generate one or more charts.

```
// list of axes used to generate the frame of the chart
// each axis has a min, max, and step value,
// which is used to control the movement for each value node
// resting on said axis

// the rest of the attributes are used to generate the size and points
// of the radar chart,
var axis = new RadarChartAxis([
  {metric: "cpu", min: 0, max: 100, step: 1},
  {metric: "ram", min: 0, max: 100, step: 1},
  {metric: "network_io", min: 0, max: 1000, step: 10},
  {metric: "disk_io", min: 0, max: 10000, step: 100},
],{
  width: 500,
  height: 500,
  factorLegend: 1,
  radians: 2 * Math.PI,
  maxValue: 100
});
```


### Public Methods
These are the set of accessible methods available to developers to use
- `new RadarChartAxis([...],{...});`
- `new NewRadarChart();`
