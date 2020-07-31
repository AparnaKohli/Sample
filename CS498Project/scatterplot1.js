var margin = {top: 10, right: 30, bottom: 100, left: 100},
    width = 1300 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatterplot-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/hospitalbeds.csv").then(function(data){
    console.log(data);

    data.forEach(function(d){
        d.hospitalbeds = +d.hospitalbeds;
        d.logdeaths = + d.logdeaths;
        d.yhat = +d.yhat;
    });

//Append new line
    var newline = d3.line()
        .x(function(d) {
            return x(d.hospitalbeds);
        })
        .y(function(d) {
            return y(d.yhat);
        });

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0,5])
        .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("font-size", "18px")
    .attr("text-anchor", "middle")
    .text("Hospital beds per 1000 people");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
            return d.logdeaths;
        })])
        .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Log(excess deaths due to Covid 19)");

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.hospitalbeds); } )
      .attr("cy", function (d) { return y(d.logdeaths); } )
      .attr("r", 5)
      .style("fill", "#69b3a2")


      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", newline);
    svg.append("text")
    .attr("x", 0.75*width)
    .attr("y", height/2)
    .attr("font-size", "26px")
    .attr("fill", "orange")
    .text("y = 0.129 + x*6.52e-07");

    /*var d = document.getElementsByClassName("equation");
    d.style.position = "absolute";
    d.style.left = 650 +'px';
    d.style.top = 990+'px';*/

    //document.getElementsByClassName("equation")[0].innerHTML = "y = " + 0.129 + "x + " + 6.52e-07;


})
