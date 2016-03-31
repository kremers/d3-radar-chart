//Radar Chart Tembot v1
//pre-requisite: underscore.js

/*
 * Prototypes and Public functions
 */


/*
var axis = new RadarChartAxis([
  {metric: "cpu", min: 0, max: 100, step: 1},
  {metric: "ram", min: 0, max: 100, step: 1},
  {metric: "network_io", min: 0, max: 1000, step: 10},
  {metric: "disk_io", min: 0, max: 10000, step: 100},
  ...
],
{
  width: 500,
  height: 500,
  factorLegend: 1,
  radians: 2 * Math.PI,
  maxValue: 20,
}
);
*/
function RadarChartAxis(paramArray, config) {
  var self = this;
  this.metricDetails = {};
  this.draw = draw;
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.xCoordToValue = xCoordToValue;
  this.yCoordToValue = yCoordToValue;
  activate();

  function activate() {
    self.axes = paramArray;
    self.config = _.extend({
      factor: 1,
      width: 500,
      height: 500,
      factorLegend: 1,
      radians: 2 * Math.PI
    }, config);
    self.numberOfAxes = paramArray.length;
    _.each(paramArray, function(param) {
      self.metricDetails[param.metric] = param;
    });
  }

  function nameToIndex(axisName) {
    return _.findIndex(self.axes, function(axis) { return axis.metric == axisName; });
  }

  function xCoord(axisName, value) {
    return this.config.width / 2.0 * (1 - (parseFloat(Math.max(value, 0)) / this.config.maxValue) * this.config.factor * Math.sin(nameToIndex(axisName) * this.config.radians / this.numberOfAxes));
  }

  function yCoord(axisName, value) {
    return this.config.height / 2 * (1 - (parseFloat(Math.max(value, 0)) / this.config.maxValue) * this.config.factor * Math.cos(nameToIndex(axisName) * this.config.radians / this.numberOfAxes));
  }

  function xCoordToValue(axisName, xCoord) {
    return this.config.maxValue * ( (1 - 2 * xCoord / this.config.width) / Math.sin(this.config.radians * nameToIndex(axisName) / this.numberOfAxes) / this.config.factor);
  }

  function yCoordToValue(axisName, yCoord) {
    return this.config.maxValue * ( (1 - 2 * yCoord / this.config.height) / Math.cos(this.config.radians * nameToIndex(axisName) / this.numberOfAxes) / this.config.factor);
  }


  /*
    Graph is a D3 SVG object

  */
  function draw(graph) {
    var axis = graph.selectAll(".axis")
                         .data(_.pluck(this.axes, "metric"))
                         .enter()
                         .append("g")
                         .attr("class", "axis");

    //add the corresponding lines for each unique axis
    axis.append("line")
        .attr("x1", self.config.width / 2.0)
        .attr("y1", self.config.height / 2.0)
        .attr("x2", function(axis, index){
          return self.xCoord(axis, self.config.maxValue);
        })
        .attr("y2", function(axis, index){
          return self.yCoord(axis, self.config.maxValue);
        })
        .attr("class", function(axis, index){
          return "line-"+index;
        })
        .style("stroke", "#7f8c8d")
        .style("stroke-width", "2px");


    // TODO: make this actually work
    //this will be used for the tooltips so that lables
    //and legends can be added to the chart for better viewing
    axis.append("text")
        .text(function(axis){return axis;})
        .style("font-family", "Helvetica")
        .style("font-size", "10px")
        .attr("transform", function (axis, index) { return "translate(0, -10)"; })
        .attr("x", function(axis, index){
          // TODO: Not sure what these do
          return self.config.width / 2.0 * (1 - self.config.factorLegend * Math.sin(index * self.config.radians / self.numberOfAxes)) - 20 * Math.sin(index * self.config.radians / self.numberOfAxes);
        })
        .attr("y", function(axis, index){
          return self.config.height / 2.0 * (1 - Math.cos(index * self.config.radians / self.numberOfAxes) + 20 * Math.cos(index * self.config.radians / self.numberOfAxes));
        });
  }
}

/*
  id: the html id of this chartSert
  axis: a RadarChartAxis object
  options: an object that contains: width, height, factorLegend, radians, maxValue
*/
function RadarChartSet(id, axis, options) {
  var self = this;
  this.addRadarChart = addRadarChart;
  activate();


  function activate() {
    self.id = id;
    self.options = options;
    self.axis = axis;

    //get rid of any remaining svgs
    d3.select(id).select("svg").remove();

    //create the graph
    self.graph = d3.select(id)
                  .append("svg")
                  .attr("width", axis.config.width)
                  .attr("height", axis.config.height);
    self.axis.draw(self.graph);
  }

  function addRadarChart(chart) {
    chart.draw(this.axis, this.graph)
  }
}

function NewRadarChart(data, options) {
  var self = this;
  this.setOptions = setOptions;
  this.draw = draw;
  activate();

  function activate() {
    self.data = data;
    //this.options = options; // Not used, this should overwrite the config
    self.config = _.extend({
      className: "rename-me",
      radius: 8, // Radius of a Point
      width: 600,
      height: 600,
      factor: 1, // Scaling Box // TODO: remove this?
      factorLegend: 0.85,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      color: d3.scale.category10()[0],
    }, options);
  }

  function setOptions(options) {
    if(options) {
      for(var i in options){
        this.config[i] = options[i];
      }
    };
  }

  function draw(axis, graph) {
    renderNodes(this.data, axis, graph);
    update(axis, graph);
  }

  function renderNodes(data, axis, graph) {

    // closure in renderNodes
    function moveStep(dataPoint, index) {
      var target = d3.select(this);

      var segmentOrigin = {x: axis.config.width / 2, y: axis.config.width / 2}; // p0
      var segmentEnd = {x: axis.xCoord(dataPoint.metric, axis.config.maxValue), y: axis.yCoord(dataPoint.metric, axis.config.maxValue)} // p1

      // Stolen from: http://bl.ocks.org/mbostock/4281513
      var x10 = segmentEnd.x - segmentOrigin.x,
          y10 = segmentEnd.y - segmentOrigin.y,
          x20 = d3.event.x - segmentOrigin.x,
          y20 = d3.event.y - segmentOrigin.y,
          pointLineSegmentParam = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10)
          newXValue = segmentOrigin.x + pointLineSegmentParam * x10,
          newYValue = segmentOrigin.y + pointLineSegmentParam * y10;

      _.each(data, function(a) {
        if(a.metric === dataPoint.metric) {
          var valBasedOnX = axis.xCoordToValue(dataPoint.metric, newXValue),
              valBasedOnY = axis.yCoordToValue(dataPoint.metric, newYValue),
              newValue; // Final value
          // Check for crazy values and axes that overlap with our coordinate system's before accepting values
          if (!isNaN(valBasedOnX) && isFinite(valBasedOnX) && (newXValue > axis.config.width / 2 + 1 && newXValue < axis.config.width / 2 - 1)) {
            newValue = valBasedOnX;
          } else if (!isNaN(valBasedOnY) && isFinite(valBasedOnY)) {
            newValue = valBasedOnY;
          } else {
            console.log(" NEW VAL explodes: " + valBasedOnX + " - " + valBasedOnY);
          }
          console.log({d3x: d3.event.x, d3y: d3.event.y, d3dx: d3.event.dx, d3dy: d3.event.dy, x: newXValue, y: newYValue, xValue: valBasedOnX, yValue: valBasedOnY})

          //newValue = Math.max(newValue, 0);
          //newValue = Math.min(newValue, a.max);
          if (!(newValue < 0 || newValue > axis.metricDetails[dataPoint.metric].max)) {
            a.value = newValue;

            target.attr("cx", function(){ return newXValue; })
                  .attr("cy", function(){ return newYValue; });
          } else {
            console.log("Won't extend axis beyond max value: " + axis.metricDetails[dataPoint.metric].max + ", have: " + newValue);
          }
        }
      });

      update(axis, graph);

      graph.projection = d3.select('svg').append("path")
          .attr("class", "line");
      d3.select('.line').attr("d", "M" + [d3.event.x, d3.event.y] + "L" + [newXValue, newYValue]);
    }; // End moveStep


    graph.selectAll(".nodes")
         .data(data)
         .enter()
         .append("svg:circle").attr("class", self.config.className)
         .attr("r", self.config.radius)
         .attr("alt", function(dataPoint){ return Math.max(dataPoint.value, 0); })
         .attr("cx", function(dataPoint, index) {
            return axis.xCoord(dataPoint.metric, dataPoint.value);
         })
         .attr("cy", function(dataPoint, index){
            return axis.yCoord(dataPoint.metric, dataPoint.value)
         })
         .attr("data-id", function(dataPoint){ return dataPoint.metric; })
         .attr("circle-class", self.config.className)
         .style("fill", self.config.color)
         .style("fill-opacity", 0.9)
         .call(
           d3.behavior.drag().on("drag", moveStep))
         .append("svg:title")
         .text(function (dataPoint) {
           return Math.max(dataPoint.value, 0);
         });
  }

  function update(axis, graph) {
    //get rid of any remaining svgs
    d3.select("polygon." + self.config.className).remove();

    // generate polygon data
    var dataValues = [];
    graph.selectAll(".nodes")
      .data(self.data, function(dataPoint, index){
        dataValues[index] = [
          axis.xCoord(dataPoint.metric, dataPoint.value),
          axis.yCoord(dataPoint.metric, dataPoint.value)
        ];
      });
    var dataPoints = {
      className: self.config.className,
      data : dataValues
    };

    //render polygon
    var poly = generatePolygon(dataPoints, graph);
    renderPolygon(poly);
  }


  //for a data points object (bounded by the datapoints class name)
  //create a new polygon object
  //returns the generated polygon
  function generatePolygon(dataPoints, graph) {
    var polygon = graph.selectAll("area")
                       .data([dataPoints.data])
                       .enter()
                       .append("polygon")
                       .attr("class", self.config.className)
                       .style("stroke-width", "2px")
                       .style("stroke", self.config.color)
                       .on("mouseover", function(object){
                          element = "polygon." + self.config.className;
                          graph.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
                          graph.selectAll(element).transition(200).style("fill-opacity", 0.7);
                       })
                       .on("mouseout", function(){
                           graph.selectAll("polygon").transition(200).style("fill-opacity", self.config.opacityArea);
                       })
                       .style("fill", function(data, i){ return self.config.color; })
                       .style("fill-opacity", self.config.opacityArea);
    return polygon;
  };

  //for a given polygon, return a string of points generated from recalulate points
  //this is the actual function that renders the polygon on top
  function renderPolygon(polygon) {
    polygon.attr("points", function(data){
      var string =  "";
      for(var index = 0; index < data.length; index++){
        string = string + data[index][0] + "," + data[index][1] + " ";
      }
      return string;
    });
  };
}






//Constructor
function RadarChart(id, data, options){ // done

  //Declarations
  this.id = id;
  this.data = data;
  //this.options = options; // Not used, this should overwrite the config
  this.config = {
    className: "rename-me",
    radius: 8, // Radius Point
    width: 600,
    height: 600,
    factor: 1, // Scaling Box
    factorLegend: 0.85,
    levels: 3, // Layers Box
    maxValue: 1,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    color: d3.scale.category10()[0],
    //normalize: false // doesn't exist yet
  };
  this.tooltip;
  this.updateConfiguration(options)
}

//based on the options passed in by the user,
//update the configuration
RadarChart.prototype.updateConfiguration = function(options) { // done
  if(options)
    for(var i in options){
      this.config[i] = options[i];
    }
};

//based on the data passed in
//update the scale the radar chart will use
RadarChart.prototype.updateScale = function() { // skip
  var max_array = [];
  var result =_.max(this.data.axes, function(axis){ return axis.value; });
  max_array.push(result.value);

  this.config.maxValue = Math.max(this.config.maxValue, d3.max(max_array));
};

// binds the arrays and the number of total axes
//to the Radar chart object
RadarChart.prototype.addAxisNames = function() { // skip
  var names = [];
  _.each(this.data.axes, function(axis){ names.push(axis.axis); });

  this.axisNames = _.uniq(names, function(item){
    return item;
  });
  this.numberOfAxes = this.axisNames.length;
};

//binds the radar radius to the RadarChart
RadarChart.prototype.computeRadius = function() { // skip
  this.radarRadius = this.config.factor * Math.min(this.config.width / 2.0, this.config.height / 2.0);
};

RadarChart.prototype.drawFrame = function() { // skip
  //to be added later for visual purposes of course
};

RadarChart.prototype.xCoord = function(axisIndex, value) { // done
  return this.config.width / 2.0 * (1 - (parseFloat(Math.max(value, 0)) / this.config.maxValue) * this.config.factor * Math.sin(axisIndex * this.config.radians / this.numberOfAxes));
}

RadarChart.prototype.yCoord = function(axisIndex, value) { // done
  return this.config.height / 2 * (1 - (parseFloat(Math.max(value, 0)) / this.config.maxValue) * this.config.factor * Math.cos(axisIndex * this.config.radians / this.numberOfAxes));
}

RadarChart.prototype.xCoordToValue = function(axisIndex, xCoord) { // done
  return this.config.maxValue * ( (1 - 2 * xCoord / this.config.width) / Math.sin(this.config.radians * axisIndex / this.numberOfAxes) / this.config.factor);
}

RadarChart.prototype.yCoordToValue = function(axisIndex, yCoord) { // done
  return this.config.maxValue * ( (1 - 2 * yCoord / this.config.height) / Math.cos(this.config.radians * axisIndex / this.numberOfAxes) / this.config.factor);
}


//this is designed to draw all unique axes that are passed in
//even if the two radar charts have two different sets of data
RadarChart.prototype.drawAxis = function() { // done
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
      .attr("x1", radar.config.width / 2.0)
      .attr("y1", radar.config.height / 2.0)
      .attr("x2", function(axis, index){
        return radar.xCoord(index, radar.config.maxValue);
      })
      .attr("y2", function(axis, index){
        return radar.yCoord(index, radar.config.maxValue);
      })
      .attr("class", function(axis, index){
        return "line-"+index;
      })
      .style("stroke", "#7f8c8d")
      .style("stroke-width", "2px");

  //this will be used for the tooltips so that lables
  //and legends can be added to the chart for better viewing
  axis.append("text")
      .text(function(axis){return axis;})
      .style("font-family", "Helvetica")
      .style("font-size", "10px")
      .attr("transform", function (axis, index) { return "translate(0, -10)"; })
      .attr("x", function(axis, index){
        // TODO: Not sure what these do
        return radar.config.width / 2.0 * (1 - radar.config.factorLegend * Math.sin(index * radar.config.radians / radar.numberOfAxes)) - 20 * Math.sin(index * radar.config.radians / radar.numberOfAxes);
      })
      .attr("y", function(axis, index){
        return radar.config.height / 2.0 * (1 - Math.cos(index * radar.config.radians / radar.numberOfAxes) + 20 * Math.cos(index * radar.config.radians / radar.numberOfAxes));
      });
};


//for a given radar chart, this calculates the data points required
//returns a double array of the x & y coordinates
RadarChart.prototype.calculatePoints = function(data) { // done

  var dataValues = [];
  var radar = this;
  radar.graph.selectAll(".nodes")
      .data(data, function(axis, index){
        dataValues[index] = [
          radar.xCoord(index, axis.value),
          radar.yCoord(index, axis.value)
        ];
      });
  return dataValues;
};

RadarChart.prototype.baseStepScale = function () { // skip
  var baseScale = [];
  var radar = this;
  _.each(radar.data.axes, function(axis, index){
    var array = [];
    _.each(_.range(radar.config.maxValue + 1), function(value){
      var object = {
        index: index,
        value: value,
        x: radar.xCoord(index, value),
        y: radar.yCoord(index, value)
      };
      array.push(object);
    });
    var item = {
      name: axis.axis,
      points: array
    };
    baseScale.push(item);
  });
  radar.baseScale = baseScale;
};

//for a data points object (bounded by the datapoints class name)
//create a new polygon object
//returns the generated polygon
RadarChart.prototype.generatePolygon = function(dataPoints) { // done
  var radar = this;
  var polygon = radar.graph.selectAll("area")
                     .data([dataPoints.data])
                     .enter()
                     .append("polygon")
                     .attr("class", radar.config.className)
                     .style("stroke-width", "2px")
                     .style("stroke", radar.config.color)
                     .on("mouseover", function(object){
                        element = "polygon." + d3.select(this).attr("class");
                        radar.graph.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
                        radar.graph.selectAll(element).transition(200).style("fill-opacity", 0.7);
                     })
                     .on("mouseout", function(){
                      radar.graph.selectAll("polygon").transition(200).style("fill-opacity", radar.config.opacityArea);
                     })
                     .style("fill", function(data, i){ return radar.config.color; })
                     .style("fill-opacity", radar.config.opacityArea);
  return polygon;
};

//for a given polygon, return a string of points generated from recalulate points
//this is the actual function that renders the polygon on top
RadarChart.prototype.renderPolygon = function(polygon) { // done
  polygon.attr("points", function(data){
    var string =  "";
    for(var index = 0; index < data.length; index++){
      string = string + data[index][0] + "," + data[index][1] + " ";
    }
    return string;
  });
};

RadarChart.prototype.renderNodes = function(data) { // done
  var radar = this;

  function moveStep(axis, index) {
    var target = d3.select(this);

    var segmentOrigin = {x: radar.config.width / 2, y: radar.config.width / 2}; // p0
    var segmentEnd = {x: radar.xCoord(index, radar.config.maxValue), y: radar.yCoord(index, radar.config.maxValue)} // p1

    // Stolen from: http://bl.ocks.org/mbostock/4281513
    var x10 = segmentEnd.x - segmentOrigin.x,
        y10 = segmentEnd.y - segmentOrigin.y,
        x20 = d3.event.x - segmentOrigin.x,
        y20 = d3.event.y - segmentOrigin.y,
        pointLineSegmentParam = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10)
        newXValue = segmentOrigin.x + pointLineSegmentParam * x10,
        newYValue = segmentOrigin.y + pointLineSegmentParam * y10;

    _.each(radar.data.axes, function(a){ // TODO: Assign the relevant axis as an attribute on the circle element
      if(a.axis === axis.axis) {
        var valBasedOnX = radar.xCoordToValue(index, newXValue),
            valBasedOnY = radar.yCoordToValue(index, newYValue),
            newValue; // Final value
        // Check for crazy values and axes that overlap with our coordinate system's before accepting values
        if (!isNaN(valBasedOnX) && isFinite(valBasedOnX) && (newXValue > radar.config.width / 2 + 1 && newXValue < radar.config.width / 2 - 1)) {
          newValue = valBasedOnX;
        } else if (!isNaN(valBasedOnY) && isFinite(valBasedOnY)) {
          newValue = valBasedOnY;
        } else {
          console.log(" NEW VAL explodes: " + valBasedOnX + " - " + valBasedOnY);
        }
        console.log({d3x: d3.event.x, d3y: d3.event.y, d3dx: d3.event.dx, d3dy: d3.event.dy, x: newXValue, y: newYValue, xValue: valBasedOnX, yValue: valBasedOnY})

        //newValue = Math.max(newValue, 0);
        //newValue = Math.min(newValue, a.max);
        if (!(newValue < 0 || newValue > a.max)) {
          a.value = newValue;

          target.attr("cx", function(){ return newXValue; })
                .attr("cy", function(){ return newYValue; });
        } else {
          console.log("Won't extend axis beyond max value: " + a.max + ", have: " + newValue);
        }
      }
    });
    radar.update();

    radar.projection = d3.select('svg').append("path")
        .attr("class", "line");
    d3.select('.line').attr("d", "M" + [d3.event.x, d3.event.y] + "L" + [newXValue, newYValue]);
    console.log("end x: " + d3.event.x)
  };

  radar.graph.selectAll(".nodes")
       .data(data.axes)
       .enter()
       .append("svg:circle").attr("class", radar.config.className)
       .attr("r", radar.config.radius)
       .attr("alt", function(axis){ return Math.max(axis.value, 0); })
       .attr("cx", function(axis, index) {
          return radar.xCoord(index, axis.value);
       })
       .attr("cy", function(axis, index){
          return radar.yCoord(index, axis.value)
       })
       .attr("data-id", function(axis){ return axis.axis; })
       .attr("circle-class", data.className)
       .style("fill", radar.config.color)
       .style("fill-opacity", 0.9)
       .call(
         d3.behavior.drag().on("drag", moveStep))
       .append("svg:title")
       .text(function (data) {
         return Math.max(data.value, 0);
       });
};

RadarChart.prototype.update = function() { // done
  var radar_chart = this;
  //get rid of any remaining svgs
  d3.select(radar_chart.id).select("polygon." + radar_chart.config.className).remove();


  //generate data points
  var dataPoints = {
    className: radar_chart.className,
    data : radar_chart.calculatePoints(radar_chart.data.axes)
  };

  //render polygon
  var poly = radar_chart.generatePolygon(dataPoints);
  radar_chart.renderPolygon(poly);
  //radar_chart.renderNodes(radar_chart.data);

};

//this function is the main driver of the application
//given a radar chart and it's options, create & render
//a multi-draggable radar chart
RadarChart.prototype.draw = function() { // done
  var radar_chart = this;
  radar_chart.updateScale();
  radar_chart.addAxisNames();
  radar_chart.computeRadius();
  radar_chart.baseStepScale();

  //get rid of any remaining svgs
  d3.select(radar_chart.id).select("svg").remove();

  //create the graph
  radar_chart.graph = d3.select(radar_chart.id)
                        .append("svg")
                        .attr("width", radar_chart.config.width)
                        .attr("height", radar_chart.config.height)

  radar_chart.drawAxis();
  radar_chart.renderNodes(radar_chart.data);
  this.update();

};
