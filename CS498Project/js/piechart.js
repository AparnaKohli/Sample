d3.csv("data/file.csv"). then(
    function(data) {
      data.forEach(function(d) {
            d.percentageofdeathscontributed = +d.percentageofdeathscontributed
            console.log(data);

        });

var width = 920
    height = 800,
    radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal()
    .range(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

var pie = d3.pie()
    .value(function(d) { return d.percentageofdeathscontributed; })(data);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var svg = d3.select("#piechart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 +")"); 

var g = svg.selectAll("arc")
    .data(pie)
    .enter().append("g")
    .attr("class", "arc");

g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.Conditions);
    });

})

