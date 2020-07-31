//Setting up canvas

var width = 600,
        height = 400,
        radius = Math.min(width, height) / 2;

    //d3.scale.category20()
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    //Creating the donut chart

    var pie = d3.pie()
        .value(function(d) { return d.Count; })
        .sort(null);

    var arc = d3.arc()
        .innerRadius(radius - 80)
        .outerRadius(radius - 20);


    var svg4 = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.json('/data/conditionsbystate.json').then(function(data) {


		var conditionsByState = d3.nest()
            .key(function(d) { return d.State; })
            .entries(data)
            .reverse();

        console.log(conditionsByState);
        // Add the list of states 

        var allGroup = d3.map(data, function(d){return(d.State)}).keys()

        console.log(allGroup);
        // Add the options to the button

        d3.select("#selectButton")
    	.selectAll('myOptions')
    	.data(allGroup)
    	.enter()
    	.append('option')
    	.text(function (d) { return d; }) // text showed in the menu
    	.attr("value", function (d) { return d; }) // corresponding value returned by the button

    	//Listening to change events in the dropdown
    	d3.select("#selectButton").on("change", function(d){
    	selectedGroup = this.value
    	console.log(selectedGroup);
    	updateChart(selectedGroup);

    })

    	function updateChart(selectedGroup) {
    		 var path = svg4.selectAll("path");

            var data0 = path.data(),
                data1 = pie(Category.values);

            // JOIN elements with new data.
            path = path.data(data1, key);

            // EXIT old elements from the screen.
            path.exit()
                .datum(function(d, i) { return findNeighborArc(i, data1, data0, key) || d; })
                .transition()
                .duration(750)
                .attrTween("d", arcTween)
                .remove();
            
            // UPDATE elements still on the screen.
            path.transition()
                .duration(750)
                .attrTween("d", arcTween);

            // ENTER new elements in the array.
            path.enter()
                .append("path")
                .each(function(d, i) { this._current = findNeighborArc(i, data0, data1, key) || d; }) 
                .attr("fill", function(d) {  return color(d.data.region) })
                .transition()
                .duration(750)
                    .attrTween("d", arcTween);

        }

     function key(d) {
        return d.data.Category;
    }

    function type(d) {
        d.Count = +d.Count;
        return d;
    }

    function findNeighborArc(i, data0, data1, key) {
        var d;
        return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
            : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
            : null;
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
        this._current = i(1)
        return function(t) { return arc(i(t)); };
    }
    });//This is the brace for the json file promise 

    	
    	




   
