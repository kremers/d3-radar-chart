//Radar Chart Tembot v1
//pre-requisite: underscore.js

/*
 * Prototypes and Public functions
 */

//Constructor
function RadarChart(id, data, options){

  //Declarations
  this.id = id;
  this.data = data;
  this.options = options;
  this.config = {
    radius: 6, // Radius Point
    width: 600,
    height: 600,
    factor: 1, // Scaling Box
    factorLegend: 0.85,
    levels: 3, // Layers Box
    maxValue: 15,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    color: d3.scale.category10(),
    normalize: false
  };
}

//update configuration
RadarChart.prototype.updateConfiguration = function(options) {
  if(options){
    for(var i in options){
      this.config[i] = options[i];
    }
  }
};

//based on the data passed in, update the scale
RadarChart.prototype.updateScale = function() {
  // body...
  var max_num = d3.max(this.data.axes.map(function(object){
    console.log(object);
    return object.value;
  }));

  this.config.maxValue = Math.max(this.config.maxValue, max_num);
};

//initial render function
RadarChart.prototype.draw = function() {
  this.updateConfiguration(this.options);
  this.updateScale();
};