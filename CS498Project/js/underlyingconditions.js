var margin = { left:100, right:10, top:10, bottom:150 };

var width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var g = d3.select("#underlyingconditions-area")
    	.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    	.append("g")
        .attr("transform", "translate(" + margin.left 
            + ", " + margin.top + ")");
 // X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("% mortality contributed by Other diseases of the respiratory system in different states")
// Y Label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Log(Excess deaths due to Covid 19 in different states)");


d3.csv("data/others.csv").then(function(data){

    data.forEach(function(d){
    
        d.others = +d.others;
        d.othershat = +d.othershat;
        d.logdeaths = +d.logdeaths;
    
    });

    console.log(data);

var line = d3.line()
        .x(function(d) {
            return x(d.others);
        })
        .y(function(d) {
            return y(d.othershat);
        });     

    var x = d3.scaleBand()
        .domain(data.map(function(d){ return d.others; }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
            return d.logdeaths;
        })])
        .range([height, 0]);


    var xAxisCall = d3.axisBottom(x).ticks(5);
    
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")
            .style("font-size", "14px");
    
    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(function(d){
            return d;
        });
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall)
        .selectAll("text")
        .style("font-size", "20px");

    var circles = g.selectAll("circle")
        .data(data);
    
    circles.enter()
        .append("circle")
            .attr("cy", function(d){ return y(d.logdeaths); })
            .attr("cx", function(d){ return x(d.others); })
            .attr("r", 5)
            .attr("fill", "blue");  


        g.append("line")
      .attr("x1", 0)
      .attr("x2", 3.56)
      .attr("y1", 1.72)
      .attr("y2", 5);  
})

