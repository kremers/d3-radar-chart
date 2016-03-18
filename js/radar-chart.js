$(document).ready(function(){
  var d = [
   {axis: "strength", value: 12, order: 0},
   {axis: "intelligence", value: 10, order: 1},
   {axis: "charisma", value: 10, order: 2},
   {axis: "dexterity", value: 12, order: 3},
   {axis: "luck", value: 9, order: 4},
   {axis: "agility", value: 8, order: 5}
  ];

  var lol = [
      {axis: "strength", value: 6, order: 0},
     {axis: "intelligence", value: 2, order: 1},
     {axis: "charisma", value: 4, order: 2},
     {axis: "dexterity", value: 4, order: 3},
     {axis: "luck", value: 4, order: 4},
     {axis: "agility", value: 4, order: 5}
  ];

  var RadarChart = {

    //main function: takes in the id of the dom element,
    //the data as d, and any extra option
    draw: function(id, d, options) {

      var config = {
        radius: 6, // Radius Point
        w: 600,
        h: 600,
        factor: 1, // Scaling Box
        factorLegend: 0.85,
        levels: 3, // Layers Box
        maxValue: 15,
        radians: 2 * Math.PI,
        opacityArea: 0.5,
        color: d3.scale.category10()
      };

      // if a user passes in some option, update the base config 
      // to use them
      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) {
            config[i] = options[i];
          }
        }
      }

      //set the axis max length to either the default config or the max 
      //value from the data passed in
      config.maxValue = Math.max(config.maxValue, d3.max(d.map(function(o) {
        return o.value
      })));

      //keep track of all the axis elements in question
      var allAxis = (d.map(function(i, j) {
        return i.axis
      }));

      var total = allAxis.length;
      var radius = config.factor * Math.min(config.w / 2, config.h / 2);

      // If an svg already exists in the dom, drop it
      d3.select(id).select("svg").remove();

      //create a new svg element with the passed in width and height props
      //g should be somewhat accesible by RadarChart (could prove useful for extracting data)
      var g = d3.select(id).append("svg").attr("width", config.w).attr("height", config.h).append("g");

      //for on hover actions
      var tooltip;
      drawFrame();

      // The axis of maximum values x, y
      var maxAxisValues = []; 
      var minAxisValues = []; 
      drawAxis();

      // where the data iself sits. this is burried inside of draw which i hate since
      // it makes it non-accessible. this should be a property of 
      var dataValues = [];
      reCalculatePoints();
      
      //this should also be accessible
      var areagg = initPolygon();

      drawPoly();
      drawnode();

      //this needs an init function that collects all the functions and data
      //binds them to the radar chart object, and runs the required methods
      //init();

      //this is repsonsible for drawing the frame of the box [X] like the hexagon
      //that we see (we'll keep this optional)
      function drawFrame() {
        for (var j = 0; j < config.levels; j++) {
          var levelFactor = config.factor * radius * ((j + 1) / config.levels);
          g.selectAll(".levels").data(allAxis).enter().append("svg:line")
            .attr("x1", function(d, i) {
              return levelFactor * (1 - config.factor * Math.sin(i * config.radians / total));
            })
            .attr("y1", function(d, i) {
              return levelFactor * (1 - config.factor * Math.cos(i * config.radians / total));
            })
            .attr("x2", function(d, i) {
              return levelFactor * (1 - config.factor * Math.sin((i + 1) * config.radians / total));
            })
            .attr("y2", function(d, i) {
              return levelFactor * (1 - config.factor * Math.cos((i + 1) * config.radians / total));
            })
            .attr("class", "line").style("stroke", "grey").style("stroke-width", "0.5px").attr("transform", "translate(" + (config.w / 2 - levelFactor) + ", " + (config.h / 2 - levelFactor) + ")");;
        }
      }

      // these draw and bind the axis elements for the data in use. 
      function drawAxis() {
        var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

        axis.append("line")
          .attr("x1", config.w / 2)
          .attr("y1", config.h / 2)
          .attr("x2", function(j, i) {
            maxAxisValues[i] = {
              x: config.w / 2 * (1 - config.factor * Math.sin(i * config.radians / total)),
              y: 0
            };
            return maxAxisValues[i].x;
          })
          .attr("y2", function(j, i) {
            maxAxisValues[i].y = config.h / 2 * (1 - config.factor * Math.cos(i * config.radians / total));
            return maxAxisValues[i].y;
          })
          .attr("class", "line").style("stroke", "grey").style("stroke-width", "1px");

        axis.append("text").attr("class", "legend")
          .text(function(d) {
            return d
          }).style("font-family", "sans-serif").style("font-size", "10px").attr("transform", function(d, i) {
            return "translate(0, -10)";
          })
          .attr("x", function(d, i) {
            return config.w / 2 * (1 - config.factorLegend * Math.sin(i * config.radians / total)) - 20 * Math.sin(i * config.radians / total);
          })
          .attr("y", function(d, i) {
            return config.h / 2 * (1 - Math.cos(i * config.radians / total)) + 20 * Math.cos(i * config.radians / total);
          });
      }

      // Calculated based on the input data points to draw a polygon
      function reCalculatePoints() {
        g.selectAll(".nodes")
          .data(d, function(j, i) {
            dataValues[i] = [
              config.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.sin(i * config.radians / total)),
              config.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.cos(i * config.radians / total)),
            ];
          });
        dataValues[d[0].length] = dataValues[0];
      }

      // Initialization polygon
      function initPolygon() {
        var polygon = g.selectAll("area").data([dataValues])
          .enter()
          .append("polygon")
          .attr("class", "radar-chart-serie0")
          .style("stroke-width", "2px")
          .style("stroke", config.color(0))
          .on('mouseover', function(d) {
            z = "polygon." + d3.select(this).attr("class");
            g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
            g.selectAll(z).transition(200).style("fill-opacity", 0.7);
          })
          .on('mouseout', function() {
            g.selectAll("polygon").transition(200).style("fill-opacity", config.opacityArea);
          })
          .style("fill", function(j, i) {
            return config.color(0);
          })
          .style("fill-opacity", config.opacityArea);

          return polygon;
      }

      // animate polygon
      function drawPoly() {
        areagg.attr("points", function(de) {
          var str = "";
          for (var pti = 0; pti < de.length; pti++) {
            str = str + de[pti][0] + "," + de[pti][1] + " ";
          }
          return str;
        });
      }

      // draw node
      function drawnode() {
        g.selectAll(".nodes")
          .data(d).enter()
          .append("svg:circle").attr("class", "radar-chart-serie0")
          .attr('r', config.radius)
          .attr("alt", function(j) {
            return Math.max(j.value, 0);
          })
          .attr("cx", function(j, i) {
            return config.w / 2 * (1 - (Math.max(j.value, 0) / config.maxValue) * config.factor * Math.sin(i * config.radians / total));
          })
          .attr("cy", function(j, i) {
            return config.h / 2 * (1 - (Math.max(j.value, 0) / config.maxValue) * config.factor * Math.cos(i * config.radians / total));
          })
          .attr("data-id", function(j) {
            return j.axis;
          })
          .style("fill", config.color(0)).style("fill-opacity", 0.9)
          .on('mouseover', function(d) {
            newX = parseFloat(d3.select(this).attr('cx')) - 10;
            newY = parseFloat(d3.select(this).attr('cy')) - 5;
            tooltip.attr('x', newX).attr('y', newY).text(d.value).transition(200).style('opacity', 1);
            z = "polygon." + d3.select(this).attr("class");
            g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
            g.selectAll(z).transition(200).style("fill-opacity", 0.7);
          })
          .on('mouseout', function() {
            tooltip.transition(200).style('opacity', 0);
            g.selectAll("polygon").transition(200).style("fill-opacity", config.opacityArea);
          })
          .call(d3.behavior.drag().on("drag", move)) // for drag & drop
          .append("svg:title")
          .text(function(j) {
            return Math.max(j.value, 0)
          });
      }

      //Tooltip
      tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', 13);

      //moves the point along the axis
      //dobj returns the entire axis data element, so it might be worth to try and reformat the data ot
      function move(dobj, i) {
        this.parentNode.appendChild(this);
        var dragTarget = d3.select(this);

        var oldData = dragTarget.data()[0];
        // Displacement coordinates are zero, in order to facilitate the calculation of the slope
        var oldX = parseFloat(dragTarget.attr("cx")) - 300;
        var oldY = 300 - parseFloat(dragTarget.attr("cy"));
        var newY = 0,
          newX = 0,
          newValue = 0;
        var maxX = maxAxisValues[i].x - 300;
        var maxY = 300 - maxAxisValues[i].y;

        // Infinite slope special case
        if (oldX == 0) {
          newY = oldY - d3.event.dy;
          // Check exceeds the range
          if (Math.abs(newY) > Math.abs(maxY)) {
            newY = maxY;
          }
          newValue = (newY / oldY) * oldData.value;
        } else {
          var slope = oldY / oldX; // 斜率
          newX = d3.event.dx + parseFloat(dragTarget.attr("cx")) - 300;
          // Check exceeds the range
          if (Math.abs(newX) > Math.abs(maxX)) {
            newX = maxX;
          }
          newY = newX * slope;

          //Using the concept of similar triangles to calculate the new value of the geometric
          var ratio = newX / oldX;
          newValue = ratio * oldData.value;
        }

        // Reset coordinate point
        dragTarget
          .attr("cx", function() {
            return newX + 300;
          })
          .attr("cy", function() {
            return 300 - newY;
          });
        // Re-set point value
        d[oldData.order].value = newValue;
        // Recalculation polygon turning point
        reCalculatePoints();
        // Redraw polygon
        drawPoly();
      }

    }
  };

  RadarChart.draw("#chart", d);

  var RadarChart_alt = {
    draw: function(id, d, options) {
      var config = {
        radius: 6, // Radius Point
        w: 600,
        h: 600,
        factor: 1, // Scaling Box
        factorLegend: 0.85,
        levels: 3, // Layers Box
        maxValue: 15,
        radians: 2 * Math.PI,
        opacityArea: 0.5,
        color: d3.scale.category10()
      };
      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) {
            config[i] = options[i];
          }
        }
      }

      config.maxValue = Math.max(config.maxValue, d3.max(d.map(function(o) {
        return o.value
      })));
      var allAxis = (d.map(function(i, j) {
        return i.axis
      }));
      var total = allAxis.length;
      var radius = config.factor * Math.min(config.w / 2, config.h / 2);

      // Initialization canvas
      d3.select(id).select("svg").remove();
      var g = d3.select(id).append("svg").attr("width", config.w).attr("height", config.h).append("g");

      var tooltip;

      drawFrame();
      var maxAxisValues = []; // The axis of maximum values x, y
      var minAxisValues = []; // need to figure this out
      drawAxis();

      var dataValues = [];
      reCalculatePoints();
      var areagg = initPolygon();
      drawPoly();
      drawnode();

      // box
      function drawFrame() {
        for (var j = 0; j < config.levels; j++) {
          var levelFactor = config.factor * radius * ((j + 1) / config.levels);
          g.selectAll(".levels").data(allAxis).enter().append("svg:line")
            .attr("x1", function(d, i) {
              return levelFactor * (1 - config.factor * Math.sin(i * config.radians / total));
            })
            .attr("y1", function(d, i) {
              return levelFactor * (1 - config.factor * Math.cos(i * config.radians / total));
            })
            .attr("x2", function(d, i) {
              return levelFactor * (1 - config.factor * Math.sin((i + 1) * config.radians / total));
            })
            .attr("y2", function(d, i) {
              return levelFactor * (1 - config.factor * Math.cos((i + 1) * config.radians / total));
            })
            .attr("class", "line").style("stroke", "grey").style("stroke-width", "0.5px").attr("transform", "translate(" + (config.w / 2 - levelFactor) + ", " + (config.h / 2 - levelFactor) + ")");;
        }
      }

      // Axis
      function drawAxis() {
        var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

        axis.append("line")
          .attr("x1", config.w / 2)
          .attr("y1", config.h / 2)
          .attr("x2", function(j, i) {
            maxAxisValues[i] = {
              x: config.w / 2 * (1 - config.factor * Math.sin(i * config.radians / total)),
              y: 0
            };
            return maxAxisValues[i].x;
          })
          .attr("y2", function(j, i) {
            maxAxisValues[i].y = config.h / 2 * (1 - config.factor * Math.cos(i * config.radians / total));
            return maxAxisValues[i].y;
          })
          .attr("class", "line").style("stroke", "grey").style("stroke-width", "1px");
      }

      // Calculated based on the input data points to draw a polygon
      function reCalculatePoints() {
        var obj = []
        g.selectAll(".nodes")
          .data(d, function(j, i) {
            dataValues[i] = [
              config.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.sin(i * config.radians / total)),
              config.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.cos(i * config.radians / total)),
            ];
          });
        dataValues[d[0].length] = dataValues[0];
      }

      // Initialization polygon
      function initPolygon() {
        var polygon = g.selectAll("area").data([dataValues])
          .enter()
          .append("polygon")
          .attr("class", "radar-chart-serie1")
          .style("stroke-width", "2px")
          .style("stroke", config.color(0))
          .on('mouseover', function(d) {
            z = "polygon." + d3.select(this).attr("class");
            g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
            g.selectAll(z).transition(200).style("fill-opacity", 0.7);
          })
          .on('mouseout', function() {
            g.selectAll("polygon").transition(200).style("fill-opacity", config.opacityArea);
          })
          .style("fill", function(j, i) {
            return config.color(1);
          })
          .style("fill-opacity", config.opacityArea);

          return polygon;
      }

      // animate polygon
      function drawPoly() {
        areagg.attr("points", function(de) {
          var str = "";
          for (var pti = 0; pti < de.length; pti++) {
            str = str + de[pti][0] + "," + de[pti][1] + " ";
          }
          return str;
        });
      }

      // draw node
      function drawnode() {
        g.selectAll(".nodes")
          .data(d).enter()
          .append("svg:circle").attr("class", "radar-chart-serie0")
          .attr('r', config.radius)
          .attr("alt", function(j) {
            return Math.max(j.value, 0);
          })
          .attr("cx", function(j, i) {
            return config.w / 2 * (1 - (Math.max(j.value, 0) / config.maxValue) * config.factor * Math.sin(i * config.radians / total));
          })
          .attr("cy", function(j, i) {
            return config.h / 2 * (1 - (Math.max(j.value, 0) / config.maxValue) * config.factor * Math.cos(i * config.radians / total));
          })
          .attr("data-id", function(j) {
            return j.axis;
          })
          .style("fill", config.color(0)).style("fill-opacity", 0.9)
          .on('mouseover', function(d) {
            newX = parseFloat(d3.select(this).attr('cx')) - 10;
            newY = parseFloat(d3.select(this).attr('cy')) - 5;
            tooltip.attr('x', newX).attr('y', newY).text(d.value).transition(200).style('opacity', 1);
            z = "polygon." + d3.select(this).attr("class");
            g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
            g.selectAll(z).transition(200).style("fill-opacity", 0.7);
          })
          .on('mouseout', function() {
            tooltip.transition(200).style('opacity', 0);
            g.selectAll("polygon").transition(200).style("fill-opacity", config.opacityArea);
          })
          .call(d3.behavior.drag().on("drag", move)) // for drag & drop
          .append("svg:title")
          .text(function(j) {
            return Math.max(j.value, 0)
          });
      }

      //Tooltip
      tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', 13);

      //moves the point along the axis
      //dobj returns the entire axis data element, so it might be worth to try and reformat the data ot
      function move(dobj, i) {
        this.parentNode.appendChild(this);
        var dragTarget = d3.select(this);

        var oldData = dragTarget.data()[0];
        // Displacement coordinates are zero, in order to facilitate the calculation of the slope
        var oldX = parseFloat(dragTarget.attr("cx")) - 300;
        var oldY = 300 - parseFloat(dragTarget.attr("cy"));
        var newY = 0,
          newX = 0,
          newValue = 0;
        var maxX = maxAxisValues[i].x - 300;
        var maxY = 300 - maxAxisValues[i].y;

        // Infinite slope special case
        if (oldX == 0) {
          newY = oldY - d3.event.dy;
          // Check exceeds the range
          if (Math.abs(newY) > Math.abs(maxY)) {
            newY = maxY;
          }
          newValue = (newY / oldY) * oldData.value;
        } else {
          var slope = oldY / oldX; // 斜率
          newX = d3.event.dx + parseFloat(dragTarget.attr("cx")) - 300;
          // Check exceeds the range
          if (Math.abs(newX) > Math.abs(maxX)) {
            newX = maxX;
          }
          newY = newX * slope;

          //Using the concept of similar triangles to calculate the new value of the geometric
          var ratio = newX / oldX;
          newValue = ratio * oldData.value;
        }

        // Reset coordinate point
        dragTarget
          .attr("cx", function() {
            return newX + 300;
          })
          .attr("cy", function() {
            return 300 - newY;
          });
        // Re-set point value
        d[oldData.order].value = newValue;
        // Recalculation polygon turning point
        reCalculatePoints();
        // Redraw polygon
        drawPoly();
      }

    }
  };

  RadarChart_alt.draw("#chartalt", lol);

  $("#toggle").click(function(){

    if($("#chart").css('zIndex') === "0"){
      $("#chart").css('zIndex', "1");
      $("#chartalt").css('zIndex', "0");
      $("#log").html("Max is Active");
    }else{
      $("#chart").css('zIndex', "0");
      $("#chartalt").css('zIndex', "1");
      $("#log").html("Min is Active");
    }

  });
});
