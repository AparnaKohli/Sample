var width = 1200,
        height = 400,
        radius = Math.min(width, height) / 2;


var color = d3.scaleOrdinal(d3.schemeCategory10);


var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);

var arc = d3.arc()
        .innerRadius(radius - 80)
        .outerRadius(radius - 20);


var donutWidth = 100;
var timeDuration = 600;

var svg5 = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

//Setting up lists for future data
var categoryByState = [];
var currentData = [];

//Legend parameters 
var legendRectSize = 25;
var legendSpacing = 6;

//Tooltip
var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
        var text = "<strong>State:</strong> <span style='color:red'>" + d.data.State + "</span><br>";
        text += "<strong>Condition:</strong> <span style='color:red;text-transform:capitalize'>" + d.data.Category + "</span><br>";
        text += "<strong>Percentage of deaths:</strong> <span style='color:red'>" + d3.format(".2f")(d.data.count) + "</span><br>";
        /*text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
        text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";*/
        return text;
    });
svg5.call(tip);

//Load the data

d3.json('/data/conditionsbystate.json').then(function(data) {


categoryByState = d3.nest()
        .key(function (d) {
            return d.State;
        })
        .entries(data);
console.log(categoryByState);

categoryByState.forEach(function (object) {
        object.values.forEach(function (d) {
            d.count = +d.count;
            d.enabled = true;
        });
    });

//generateOptions();
change('Alabama');

var allGroup = d3.map(data, function(d){return(d.State)}).keys()

d3.select("#selection")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button



//Function generate Options 
function change(option) {
    // --> Get current data.
    if (typeof option === 'string') {
        // --> Get current data.
        currentData = JSON.parse(
          JSON.stringify(
            categoryByState.filter(function (e) {
              return e.key === option;
            })[0]
          ));
    // --> Set colour domain.
    var domain = [];
        currentData.values.forEach(function (d) {
            if (d.State === option) {
                domain.push(d.Category);
            }
        });
        color.domain(domain);    

    };//type of option bracket
    
	var path = svg5.selectAll("path");
    var pieData = currentData.values.filter(function (e) { return e.enabled; });

	var data0 = path.data(),
        data1 = pie(pieData);

    path = path.data(data1, key);
    path
        .transition()
        .duration(timeDuration)
        .attrTween("d", arcTween);
    path
        .enter()
        .append("path")
        .each(function (d, i) {
            var narc = findNeighborArc(i, data0, data1, key);
            if (narc) {
                this._current = narc;
                this._previous = narc;
            } else {
                this._current = d;
            }
        })
        .attr("fill", function(d) {
        	return color(d.data.Category);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .transition()
        .duration(timeDuration)
        .attrTween("d", arcTween);

        path
        .exit()
        .transition()
        .duration(timeDuration)
        .attrTween("d", function (d, index) {
            if (typeof this._previous !== 'undefined') {
                var currentIndex = this._previous.data.Category;
                var i = d3.interpolateObject(d, this._previous);
                return function (t) {
                    return arc(i(t))
                }
            } else {
                return null;
            }
        })
        .remove();

         // --> Create/remove legend.
    d3.selectAll('g').filter('.legend').remove();

    var legend = svg5.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = 9 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });
        legend.append('rect')
            .attr('class', 'enabled')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)
            .on('click', function (d) {
              var totalEnabled = d3.sum(currentData.values, function (e) { 
                return (e.enabled) ? 1 : 0;
              });
              var currentStatus = currentData.values.filter(function (e) { 
                return (e.category === d);
              })[0].enabled;
              
              if (totalEnabled > 1 || !currentStatus) {
                currentData.values.forEach(function (e) { 
                  if (e.category === d) {
                    e.enabled = !e.enabled;
                  }
                });
                change();
              }
            })
           /* .each(function(d) { 
              var currentStatus = currentData.values.filter(function (e) { 
                return (e.category === d);
              })[0].enabled;
          
              if (!currentStatus) {
                d3.select(this).attr('class', 'disabled');
              }
            });*/
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) {
                return d;
            });



}//change function bracket

d3.selectAll('#selection').on('change', function (d) {
	selectedGroup = this.value;
	change(selectedGroup);

	//console.log(d3.select(this).node().value);
    //change(d3.select(this).node().value);
});

function key(d) {
    return d.data.region;
}

function type(d) {
    d.count = +d.count;
    return d;
}

function findNeighborArc(i, data0, data1, key) {
    var d;
    if(d = findPreceding(i, data0, data1, key)) {
        var obj = cloneObj(d);
        obj.startAngle = d.endAngle;
        return obj;
    } else if(d = findFollowing(i, data0, data1, key)) {
        var obj = cloneObj(d);
        obj.endAngle = d.startAngle;
        return obj;
    }
    return null
}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
    var m = data0.length;
    while (--i >= 0) {
        var k = key(data1[i]);
        for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
        }
    }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
    var n = data1.length, m = data0.length;
    while (++i < n) {
        var k = key(data1[i]);
        for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
        }
    }
}

function arcTween(d) {
    var i = d3.interpolate(this._current, d);
    this._current = i(0);
    return function(t) {
        return arc(i(t))
    }
}


function cloneObj(obj) {
    var o = {};
    for(var i in obj) {
        o[i] = obj[i];
    }
    return o;
}


        



})//data bracket





    
