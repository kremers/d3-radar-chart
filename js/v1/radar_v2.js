//Radar Chart Tembot v1
//pre-requisite: underscore.js


/*
 * Random Helper Functions
 */

function getPolygonClassName(className){
  return className + "-radar";
}

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

//based on the options passed in by the user, 
//update the configuration
RadarChart.prototype.updateConfiguration = function(options) {
  if(options)
    for(var i in options){
      this.config[i] = options[i];
    }
};

//based on the data passed in 
//update the scale the radar chart will use
RadarChart.prototype.updateScale = function() {
  var max_array = [];

  _.each(this.data, function(datum){
    var result =_.max(datum.axes, function(axis){ return axis.value; });
    max_array.push(result.value);
  });

  this.config.maxValue = Math.max(this.config.maxValue, _.max(max_array, function(i){return i}));
};

// binds the arrays and the number of total axes 
//to the Radar chart object
RadarChart.prototype.addAxisNames = function() {
  var axisNames = [];
  _.each(this.data, function(radar){
    _.each(radar.axes, function(axis){ axisNames.push(axis.axis); });
  });

  this.axisNames = _.uniq(axisNames);
  this.totalAxisLength = this.axisNames.length;
};

//binds the radar radius to the RadarChart
RadarChart.prototype.computeRadius = function() {
  this.radarRadius = this.config.factor * Math.min(this.config.width / 2.0, this.config.height / 2.0);
};

RadarChart.prototype.drawFrame = function() {
  //to be added later for visual purposes of course
};

//this is designed to draw all unique axes that are passed in
//even if the two radar charts have two different sets of data
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

  //this will be used for the tooltips so that lables
  //and legends can be added to the chart for better viewing
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
};


//for a given radar chart, this calculates the data points required
//returns a double array of the x & y coordinates
RadarChart.prototype.calculatePoints = function(data) {
  
  var dataValues = [];
  var radar = this;
  radar.graph.selectAll(".nodes")
      .data(data, function(axis, index){
        dataValues[index] = [
          radar.config.width / 2 * (1 - (parseFloat(Math.max(axis.value, 0)) / radar.config.maxValue) * radar.config.factor * Math.sin(index * radar.config.radians / radar.totalAxisLength)),
          radar.config.height / 2 * (1 - (parseFloat(Math.max(axis.value, 0)) / radar.config.maxValue) * radar.config.factor * Math.cos(index * radar.config.radians / radar.totalAxisLength))
        ]
      });
  return dataValues;
};

//for a data points object (bounded by the datapoints class name)
//create a new polygon object
//returns the generated polygon
RadarChart.prototype.generatePolygon = function(dataPoints) {
  var radar = this;
  var polygon = radar.graph.selectAll("area")
                     .data([dataPoints.data])
                     .enter()
                     .append("polygon")
                     .attr("class", getPolygonClassName(dataPoints.className))
                     .style("stroke-width", "2px")
                     .style("stroke", radar.config.color(0))
                     .on("mouseover", function(object){
                        element = "polygon." + d3.select(this).attr("class");
                        radar.graph.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
                        radar.graph.selectAll(element).transition(200).style("fill-opacity", 0.7);
                     })
                     .on("mouseout", function(){
                      radar.graph.selectAll("polygon").transition(200).style("fill-opacity", radar.config.opacityArea);
                     })
                     .style("fill", function(data, index){ return radar.config.color(0); })
                     .style("fill-opacity", radar.config.opacityArea);
  return polygon;
};

//for a given polygon, return a string of points generated from recalulate points
//this is the actual function that renders the polygon on top
RadarChart.prototype.renderPolygon = function(polygon) {
  polygon.attr("points", function(data){
    var string =  "";
    for(var index = 0; index < data.length; index++){
      string = string + data[index][0] + "," + data[index][1] + " ";
    }
    return string;
  });
};

RadarChart.prototype.renderNodes = function(data) {
  // body...
  var radar = this;
  radar.graph.selectAll(".nodes")
       .data(data.axes)
       .enter()
       .append("svg:circle").attr("class", getPolygonClassName(data.className))
       .attr("r", radar.config.radius)
       .attr("alt", function(axis){ 
          return Math.max(axis.value, 0); 
       })
       .attr("cx", function(axis, index){
          return radar.config.width / 2.0 * (1 - (Math.max(axis.value, 0) / radar.config.maxValue) * radar.config.factor * Math.sin(index * radar.config.radians / radar.totalAxisLength));
       })
       .attr("cy", function(axis, index){
          return radar.config.height / 2.0 * (1 - (Math.max(axis.value, 0) / radar.config.maxValue) * radar.config.factor * Math.cos(index * radar.config.radians / radar.totalAxisLength));
       })
       .attr("data-id", function(axis){
        return axis.axis;
       })
       .style("fill", radar.config.color(0))
       .style("fill-opacity", 0.9)
       .call(
          d3.behavior.drag()
                     .origin(function(d) { return [d, radar];})
                     .on("drag", radar.move)
        )
       .append("svg:title")
       .text(function (data) {
         return Math.max(data.value, 0);
       });
};

RadarChart.prototype.move = function(d) {
  // body...
  console.log(d);
  this.parentNode.appendChild(this);
  var target = d3.select(this);
  var oldData = target.data()[0];

  var oldX = parseFloat(target.attr("cx")) - 300;
  var oldY = 300 - parseFloat(target.attr("cy"));
  var newY = 0, newX = 0, newVal = 0;

  // Infinite slope special case
  if (oldX == 0) {
    newY = oldY - d3.event.dy;
    newValue = (newY / oldY) * oldData.value;
  } else {
    var slope = oldY / oldX;
    newX = d3.event.dx + parseFloat(target.attr("cx")) - 300;
    newY = newX * slope;

    //Using the concept of similar triangles to calculate the new value of the geometric
    var ratio = newX / oldX;
    newValue = ratio * oldData.value;
  }

  target.attr("cx", function(){ return newX + 300; })
        .attr("cy", function(){ return 300 - newY; });

  //after updating the CX and CY of the circle selected
  //update the value in question 
  //call the update function
  //console.log(axis);
};

RadarChart.prototype.update = function() {
  var radar_chart = this;
  _.each(radar_chart.data, function(radar){
      //generate data points
      var dataPoints = {
        className: radar.className,
        data : radar_chart.calculatePoints(radar.axes)
      };

      //render polygon
      var poly = radar_chart.generatePolygon(dataPoints);
      radar_chart.renderPolygon(poly);
      radar_chart.renderNodes(radar);
   });
};

//this function is the main driver of the application
//given a radar chart and it's options, create & render
//a multi-draggable radar chart
RadarChart.prototype.draw = function() {
  var radar_chart = this;
  radar_chart.updateConfiguration(radar_chart.options);
  radar_chart.updateScale();
  radar_chart.addAxisNames();
  radar_chart.computeRadius();

  //get rid of any remaining svgs
  d3.select(radar_chart.id).select("svg").remove();

  //create the graph
  radar_chart.graph = d3.select(radar_chart.id)
                        .append("svg")
                        .attr("width", radar_chart.config.width)
                        .attr("height", radar_chart.config.height)
                        .append("g");

  //draw the frame and the axis
  //radar_chart.drawFrame();
  radar_chart.drawAxis();

   _.each(radar_chart.data, function(radar){
      //generate data points
      var dataPoints = {
        className: radar.className,
        data : radar_chart.calculatePoints(radar.axes)
      };

      //render polygon
      var poly = radar_chart.generatePolygon(dataPoints);
      radar_chart.renderPolygon(poly);
      radar_chart.renderNodes(radar);
   });

};




