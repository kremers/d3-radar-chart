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
  this.maxAxisValues = [];
  this.minAxisValues = [];
  this.config = {
    radius: 6, // Radius Point
    width: 600,
    height: 600,
    factor: 1, // Scaling Box
    factorLegend: 0.85,
    levels: 3, // Layers Box
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    color: d3.scale.category10(),
    normalize: false
  };
}

//update configuration
RadarChart.prototype.updateConfiguration = function(options) {
  if(options)
    for(var i in options){
      this.config[i] = options[i];
    }
};

//based on the data passed in, update the scale
RadarChart.prototype.updateScale = function() {
  var max_array = [];

  _.each(this.data, function(datum){
    var result =_.max(datum.axes, function(axis){ return axis.value; });
    max_array.push(result.value);
  });

  this.config.maxValue = Math.max(this.config.maxValue, _.max(max_array, function(i){return i}));
};

RadarChart.prototype.addAxisNames = function() {
  // body...
  var axisNames = [];
  _.each(this.data, function(radar){
    _.each(radar.axes, function(axis){ axisNames.push(axis.axis); });
  });

  this.axisNames = _.uniq(axisNames);
  this.totalAxisLength = this.axisNames.length;
};

RadarChart.prototype.computeRadius = function() {
  this.radarRadius = this.config.factor * Math.min(this.config.width / 2.0, this.config.height / 2.0);
};

RadarChart.prototype.drawFrame = function() {
  // body...
  console.log("Draw frame");
};

RadarChart.prototype.drawAxis = function() {
  // body...
  //generate the axis element
  var radar = this; //bind this to RadarChart so that we can acess config objects and such
  var axis = radar.graph.selectAll(".axis")
                       .data(radar.axisNames)
                       .enter()
                       .append("g")
                       .attr("class", "axis");

  //add the corresponding lines for each unique axis
  axis.append("line")
      .attr("x1", this.config.width / 2.0)
      .attr("y1", this.config.height / 2.0)
      .attr("x2", function(axis, index){
        radar.maxAxisValues[index] = {
          x: radar.config.width / 2.0 * (1 - radar.config.factor * Math.sin(index * radar.config.radians / radar.totalAxisLength)),
          y: 0
        };
        return radar.maxAxisValues[index].x;
      })
      .attr("y2", function(axis, index){
        radar.maxAxisValues[index].y = radar.config.height / 2.0 * (1 - radar.config.factor * Math.cos(index * radar.config.radians / radar.totalAxisLength));
        return radar.maxAxisValues[index].y;
      })
      .attr("class", "line")
      .style("stroke", "#7f8c8d")
      .style("stroke-width", "1px");

  axis.append("text")
      .text(function(axis){return axis;})
      .style("font-family", "Helvetica")
      .style("font-size", "10px")
      .attr("transform", function (axis, index) { return "translate(0, -10)"; })
      .attr("x", function(axis, index){
        return radar.config.width / 2.0 * (1 - radar.config.factorLegend * Math.sin(index * radar.config.radians / radar.totalAxisLength)) - 20 * Math.sin(index * radar.config.radians / radar.totalAxisLength);
      })
      .attr("y", function(axis, index){
        return radar.config.height / 2.0 * (1 - Math.cos(index * radar.config.radians / radar.totalAxisLength) + 20 * Math.cos(index * radar.config.radians / radar.totalAxisLength));
      });

  console.log("Draw axis - done");      
};

//initial render function
RadarChart.prototype.draw = function() {
  this.updateConfiguration(this.options);
  this.updateScale();
  this.addAxisNames();
  this.computeRadius();

  //get rid of any remaining svgs
  d3.select(this.id).select("svg").remove();

  //create the graph
  this.graph = d3.select(this.id)
                 .append("svg")
                 .attr("width", this.config.width)
                 .attr("height", this.config.height)
                 .append("g");

  //draw the frame and the axis
  this.drawFrame();
  this.drawAxis();
};


