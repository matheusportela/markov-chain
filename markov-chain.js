$(function() {
    class MarkovChain {
        constructor(transitionMatrix) {
            this.transitionMatrix = transitionMatrix;
            this.state = 0;
        }

        transition() {
            var sampledProb = Math.random();
            var nextState = 0;
            var requiredProb;

            console.log('Sample prob:', sampledProb);

            for (var i = 0; i < this.transitionMatrix.length; i++) {
                requiredProb = this.transitionMatrix[this.state][i];
                nextState = i;

                console.log('Required prob:', requiredProb);

                if (sampledProb < requiredProb) {
                    break;
                } else {
                    sampledProb -= requiredProb;
                }
            }

            console.log('Next state:', nextState);
            this.state = nextState;
        }
    }

    var data = {
        nodes: [
            {id: 'A', x: 100, y: 100},
            {id: 'B', x: 200, y: 100}
        ],
        edges: [
            {source: 0, target: 0, probability: 0.5},
            {source: 0, target: 1, probability: 0.5},
            {source: 1, target: 0, probability: 0.9},
            {source: 1, target: 1, probability: 0.1}
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
            .attr('id', function(d, i) { return 'node_' + i })
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
        // Creating Bézier curve with fixed size and orientation
        var d = 50;
        return ('M' + x + ' ' + y +
                ' C ' + (x + d) + ' ' + (y + d) +
                ', ' + (x - d) + ' ' + (y + d) +
                ', ' + x + ' ' + y);
    }

    function drag(d) {
        d.x = d3.event.x;
        d.y = d3.event.y;

        d3.select(this)
            .attr('cx', d.x)
            .attr('cy', d.y);

        // Redraw edges after dragging a node
        drawEdges();
    }

    function simulate() {
        markov = new MarkovChain(
            [[0.5, 0.5],
             [0.9, 0.1]]
        );

        window.setInterval(function() {
            $('#node_' + markov.state).removeClass('current-node');
            markov.transition();
            $('#node_' + markov.state).addClass('current-node');
        }, 1000);
    }

    simulate();
});
