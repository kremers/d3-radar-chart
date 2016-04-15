//Radar Chart v2

var tip = d3.tip()
            .attr('class', 'd3-tooltip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span style='color:white'>" + d.metric + ": " + d.value.toFixed(2) + " " + d.unit + "</span>";
            });

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
      radians: 2 * Math.PI,
      normalizedMax: 10000 //for better precision
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
    return this.config.width / 2.0 * (1 - (parseFloat(Math.max(value, 0)) / this.config.normalizedMax) * this.config.factor * Math.sin(nameToIndex(axisName) * this.config.radians / this.numberOfAxes));
  }

  function yCoord(axisName, value) {
    return this.config.height / 2 * (1 - (parseFloat(Math.max(value, 0)) / this.config.normalizedMax) * this.config.factor * Math.cos(nameToIndex(axisName) * this.config.radians / this.numberOfAxes));
  }

  function xCoordToValue(axisName, xCoord) {
    return this.config.normalizedMax * ( (1 - 2 * xCoord / this.config.width) / Math.sin(this.config.radians * nameToIndex(axisName) / this.numberOfAxes) / this.config.factor);
  }

  function yCoordToValue(axisName, yCoord) {
    return this.config.normalizedMax * ( (1 - 2 * yCoord / this.config.height) / Math.cos(this.config.radians * nameToIndex(axisName) / this.numberOfAxes) / this.config.factor);
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
          return self.xCoord(axis, self.config.normalizedMax);
        })
        .attr("y2", function(axis, index){
          return self.yCoord(axis, self.config.normalizedMax);
        })
        .attr("class", function(axis, index){
          return "line-"+index;
        })
        .style("stroke", "rgb(138, 138, 138)")
        .style("z-index", 0)
        .style("stroke-width", "1.5px");

    //adds a label for each axis based on the axis title
    axis.append("text")
        .attr("class", "axis-label")
        .text(function(item){return item;})
        .style("font-family", "Helvetica")
        .style("font-size", "12px")
        .attr("transform", function(d, i) {return "translate(5, 4)";})
        .attr("x", function(axis, index){
          return self.xCoord(axis, self.config.normalizedMax - 400);
        })
        .attr("y", function(axis, index){
          return self.yCoord(axis, self.config.normalizedMax - 400);
        });
  }
}

/*
 * Prototypes and Public functions
  id: the html id of this chartSert
  axis: a RadarChartAxis object
  options: an object that contains: width, height, factorLegend, radians, maxValue
*/
function RadarChartSet(id, axis, options) {
  var self = this;
  this.addRadarChart = addRadarChart;
  this.draw = draw;
  this.normalize = normalize;
  this.denormalize = denormalize;
  this.getChart = getChart
  var radarCharts = [];
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
                  .attr("height", axis.config.height)
                  .call(tip);
  }

  function addRadarChart(chart) {
    radarCharts.push(chart);
  }

  function getChart(className){
    return _.find(radarCharts, function(chart){
      return chart.config.className === className;
    });
  }

  function normalize(){
    _.each(radarCharts, function(chart){
      _.each(chart.data, function(axis){

        var key = _.find(self.axis.axes, function(key_val){
          return key_val.metric === axis.metric;
        });
        axis.normalizedVal = self.axis.config.normalizedMax * (axis.value / key.max);
        key.normalizedMax = self.axis.config.normalizedMax * (key.max / key.max);
        key.normalizedMin = self.axis.config.normalizedMin * (key.min / key.max) || 0;
        axis.normalizedStep = self.axis.config.normalizedMax * (key.step / key.max);
        axis.step = key.step;
        axis.key_max = key.max;
        axis.normalizedMax =  key.normalizedMax;
      });
    });
  }

  function getChartData(){
    return radarCharts;
  }

  function denormalize(){ //maybe have it accept a param
    _.each(radarCharts, function(chart){
      _.each(chart.data, function(axis){
        var key = _.find(self.axis.axes, function(key_val){
          return key_val.metric === axis.metric;
        });
        axis.value = key.max * (axis.normalizedVal / self.axis.config.normalizedMax);
      });
    });
  }

  function draw() {
    normalize();
    _.each(radarCharts, function(chart) {
      chart.renderPolygon(self.axis, self.graph);
    })
    self.axis.draw(self.graph);
    _.each(radarCharts, function(chart) {
      if(chart.config.draggable === true)
        chart.renderNodes(self.axis, self.graph);
    })
  }
}

function NewRadarChart(data, options) {
  var self = this;
  this.setOptions = setOptions;
  this.draw = draw;
  this.getData = getData;
  this.renderNodes = renderNodes;
  this.renderPolygon = renderPolygon;
  activate();

  function activate() {
    self.data = data;
    //this.options = options; // Not used, this should overwrite the config
    self.config = _.extend({
      className: "rename-me",
      radius: 5, // Radius of a Point
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
    renderPolygon(axis, graph);
    renderNodes(axis, graph);
  }

  function getData(metric){
    return _.find(self.data, function(item){
      return item.metric === metric;
    });
  }

  function renderNodes(axis, graph) {
    var tooltip;
    //set min and max constraints for the function
    var minConstraint = this.config.minBoundingFn;
    var maxConstraint = this.config.maxBoundingFn;

    // closure in renderNodes
    function moveStep(dataPoint, index) {
      var target = d3.select(this);

      var segmentOrigin = {x: axis.config.width / 2, y: axis.config.width / 2}; // p0
      var segmentEnd = {x: axis.xCoord(dataPoint.metric, axis.config.normalizedMax), y: axis.yCoord(dataPoint.metric, axis.config.normalizedMax)} // p1

      // Stolen from: http://bl.ocks.org/mbostock/4281513
      var x10 = segmentEnd.x - segmentOrigin.x,
          y10 = segmentEnd.y - segmentOrigin.y,
          x20 = d3.event.x - segmentOrigin.x,
          y20 = d3.event.y - segmentOrigin.y,
          pointLineSegmentParam = (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10)
          newXValue = segmentOrigin.x + pointLineSegmentParam * x10,
          newYValue = segmentOrigin.y + pointLineSegmentParam * y10;

      _.each(self.data, function(a) {
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
          //console.log({d3x: d3.event.x, d3y: d3.event.y, d3dx: d3.event.dx, d3dy: d3.event.dy, x: newXValue, y: newYValue, xValue: valBasedOnX, yValue: valBasedOnY})

          //newValue = Math.max(newValue, 0);
          //newValue = Math.min(newValue, a.max);

          if (!(newValue < minConstraint(dataPoint.metric) || newValue > maxConstraint(dataPoint.metric))) {
            //console.log(newValue - a.normalizedVal);
            //a.normalizedVal = newValue;
            var multiple = Math.abs(newValue - a.normalizedVal) / a.normalizedStep;
            var res = roundToNearest(newValue, multiple);
            console.log(res);
            if(newValue - a.normalizedVal > 0 && Math.abs(newValue - a.normalizedVal) > a.normalizedStep){
              a.normalizedVal = a.normalizedVal + a.normalizedStep;
            }else if(newValue -  a.normalizedVal < 0 && Math.abs(newValue - a.normalizedVal) > a.normalizedStep ){
              a.normalizedVal = a.normalizedVal - a.normalizedStep;
            }else{
              a.normalizedVal = a.normalizedVal;
            }


            a.value = a.key_max * (a.normalizedVal / a.normalizedMax); //denormalization auto computed here

            target.attr("cx", function(){ return newXValue; })
                  .attr("cy", function(){ return newYValue; });
          } else {
            console.log("Won't extend axis beyond max value: " + axis.metricDetails[dataPoint.metric].max + ", have: " + newValue);
          }
        }
      });

      renderPolygon(axis, graph);

      //graph.projection = d3.select('svg').append("path").attr("class", "line");
      //d3.select('.line').attr("d", "M" + [d3.event.x, d3.event.y] + "L" + [newXValue, newYValue]);
    }; // End moveStep

    graph.selectAll(".nodes")
         .data(self.data)
         .enter()
         .append("svg:circle").attr("class", function(d){
           return self.config.className + "-" + d.metric;
         })
         .attr("r", self.config.radius * 1.5)
         .attr("alt", function(dataPoint){ return Math.max(dataPoint.normalizedVal, 0); })
         .attr("cx", function(dataPoint, index) {
            return axis.xCoord(dataPoint.metric, dataPoint.normalizedVal);
         })
         .attr("cy", function(dataPoint, index){
            return axis.yCoord(dataPoint.metric, dataPoint.normalizedVal)
         })
         .attr("data-id", function(dataPoint){ return dataPoint.metric; })
         .attr("circle-class", self.config.className)
         .attr("title", function(d){return d.metric;})
         .style("fill", self.config.stroke)
         .style("fill-opacity", 0.9)
         .call(d3.behavior.drag().on("drag", moveStep))
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide);
  }

  function roundToNearest(number, multiple){
   var half = multiple / 2.0;
   return number + half - (number + half) % multiple;
  }

  function renderPolygon(axis, graph) {
    // generate polygon data
    var dataValues = [];
    graph.selectAll(".nodes")
      .data(self.data, function(dataPoint, index){
        dataValues[index] = [
          axis.xCoord(dataPoint.metric, dataPoint.normalizedVal),
          axis.yCoord(dataPoint.metric, dataPoint.normalizedVal)
        ];
      });
    var dataPoints = {
      className: self.config.className,
      data : dataValues
    };
    if (!self.polygon) {
      self.polygon = graph.selectAll("area")
                         .data([dataPoints.data]);
      self.polygon.enter()
                   .append("polygon")
                   .attr("class", self.config.className)
                   .style("stroke-width", "1.5px")
                   .style("stroke", self.config.stroke)
                   .style("fill", function(data, i){ return self.config.color; })
                   .style("z-index", 10)
                   .style("fill-opacity", self.config.opacityArea);
      self.polygon.exit();
    } else {
      self.polygon = self.polygon.data([dataPoints.data]); // ditto above point
    }

    self.polygon.attr("points", function(data){
      var string =  "";
      for(var index = 0; index < data.length; index++){
        string = string + data[index][0] + "," + data[index][1] + " ";
      }
      return string;
    });
    //self.polygon.exit();

    return self.polygon;
  };
}
