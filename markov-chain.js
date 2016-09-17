$(function() {
    var data = {
        nodes: [
            {id: 'A', x: 100, y: 100},
            {id: 'B', x: 200, y: 100}
        ],
        edges: [
            {source: 0, target: 1},
            {source: 1, target: 0}
        ]
    }

    var svg = d3.select('.chart'),
        width = +svg.attr('width'),
        height = +svg.attr('height');

    var edges = svg.selectAll('path')
            .data(data.edges)
        .enter().append('path')
            .attr('class', 'edge');

    // Draw edges before nodes
    drawEdges();

    var nodes = svg.selectAll('circle')
            .data(data.nodes)
        .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 15)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
            .call(d3.drag()
                .on('drag', drag));

    function drawEdges() {
        edges.attr('d', function(d) {
            // Initial and final coordinates
            var x1 = data.nodes[d.source].x,
                y1 = data.nodes[d.source].y,
                x2 = data.nodes[d.target].x,
                y2 = data.nodes[d.target].y;

            if (x1 == x2 && y1 == y2)
                return drawBezierCurve(x1, y1);
            return drawQuadraticCurve(x1, y1, x2, y2);
        });
    }

    function drawQuadraticCurve(x1, y1, x2, y2) {
        // Angle between initial and final coordinates
        var theta = Math.atan2(y2 - y1, x2 - x1);

        // How far the curve will be from the line connecting the two nodes
        var h = 50;

        // Curve control point
        var xf = (x1 + x2)/2 + h*Math.cos(theta + Math.PI/2),
            yf = (y1 + y2)/2 + h*Math.sin(theta + Math.PI/2);

        // Creating quadratic curve
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
        return ('M' + x1 + ' ' + y1 +
               ' Q ' + xf + ' ' + yf +
               ', ' + x2 + ' ' + y2);
    }

    function drawBezierCurve(x, y) {
        return drawQuadraticCurve(x, y, x, y);
    }

    function drag(d) {
        console.log('Drag event');

        d.x = d3.event.x;
        d.y = d3.event.y;

        d3.select(this)
            .attr('cx', d.x)
            .attr('cy', d.y);

        // Redraw edges after dragging a node
        drawEdges();
    }
});
