var margin = {top: 40, right: 90, bottom: 100, left: 100},
    width = 1600 - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg8 = d3.select("#scatterplotdiseases-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



//Tooltip


//Read the data
d3.csv("data/others.csv").then(function(data){

    data.forEach(function(d){
        d.Others = +d.Others;
        d.logdeaths = + d.logdeaths;
        d.Othershat = +d.Othershat;
    });

//Append new line
    var newline = d3.line()
        .x(function(d) {
            return x(d.Others);
        })
        .y(function(d) {
           return y(d.Othershat);
        });



  var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
        var text = "<strong>State:</strong> <span style='color:red'>" + d.State + "</span><br>";
        text += "<strong>% Mortality due to other diseases of the respiratory system:</strong> <span style='color:red;text-transform:capitalize'>" + d3.format(".2f")(d.Others) + "</span><br>";
        text += "<strong>log(excess deaths):</strong> <span style='color:red'>" + d3.format(".2f")(d.logdeaths) + "</span><br>";
        /*text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
        text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";*/
        return text;
    });
svg8.call(tip);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0,5])
        .range([0, width]);
  
  var xAxisGenerator = d3.axisBottom(x);
  xAxisGenerator.tickValues([0,1,2,3,4,5]);


  svg8.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisGenerator);

 


    svg8.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("% mortality in different states due to Other diseases of the respiratory system (2015-2019)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
            return d.logdeaths;
        })])
        .range([height, 0]);

  svg8.append("g")
    .call(d3.axisLeft(y));

  svg8.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Log(excess deaths due to Covid 19)");

  // Add dots
  svg8.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Others); } )
      .attr("cy", function (d) { return y(d.logdeaths); } )
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)


     svg8.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", newline);

svg8.append("text")
    .attr("x", 0.6*width)
    .attr("y", height/2)
    .attr("font-size", "26px")
    .attr("fill", "orange")
    .text("y = 1.68 + x*42.02");

})
