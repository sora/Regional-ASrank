/*
 * CountryRank.js v0.1
 * 20110407, Yohei Kuga, sora@sfc.wide.ad.jp
 */
function CountryRank(canvas_id, data) {
    "use strict";

    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");

    var col_tmpl = [ 'rgb(255, 100, 100)', 'rgb(60, 60, 255)', 'rgb(51, 153, 102)',
		     'rgb(128, 0, 0)', 'rgb(51, 102, 255)', 'rgb(128, 0, 128)', 
		     'rgb(0, 51, 0)', 'rgb(255, 0, 255)', 'rgb(51, 204, 204)',
		     'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(255, 0, 0)', 
		     'rgb(0, 0, 102)', 'rgb(255, 153, 0)', 'rgb(0, 204, 255)',
		     'rgb(153, 51, 102)', 'rgb(153, 204, 0)', 'rgb(255, 153, 204)',
		     'rgb(250, 220, 179)', 'rgb(179, 213, 128)', 'rgb(0, 128, 0)',
		     'rgb(0, 128, 128)', 'rgb(74, 95, 127)', 'rgb(204, 255, 102)',
		     'rgb(255, 204, 102)', 'rgb(204, 102, 255)', 'rgb(255, 102, 102)'
		   ];

    var col = new Array();
    for( var i=0; i<data.length; i++) {
	for( var j=0; j<data[i].length; j++) {
	    if( col[data[i][j][1]] == null ) {
		col[data[i][j][1]] = col_tmpl.shift();
	    }
	}
    }

    draw();

    function draw() {
	var w = canvas.width * 0.85;
	var h = canvas.height * 0.85;
	var marginX = 20;
	var marginY = 30;
	ctx.font = "bold 12px sans-serif";

	ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgb(34,34,34)";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
	ctx.restore();

	var grid = new Array(data.length);
	for( var i=0;i<data.length;i++ ) {
	    grid[i] = new Array(20);
	}
	for( var i=0; i<data.length; i++ ) {
	    for( var j=0; j<20; j++ ) {
		grid[i][j] = [(i+1)*(w/8)+marginX, ((j+1)*(h/22)-3)+marginY];
	    }
	}

	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw_bg(w, h, marginX, marginY);
	draw_lines(data, grid);
	draw_points(data, grid);
	color_legend(w, h, marginX, marginY);
	ctx.restore();
    }

    function draw_bg(w, h, marginX, marginY) {
	ctx.save();
	ctx.strokeStyle = 'white';
	ctx.fillStyle = 'white';

	ctx.beginPath();
	ctx.moveTo(marginX+50, h-10+marginY);
	ctx.lineTo(w-20, h-10+marginY);
	ctx.stroke();

	var year = 2004;
	for( var i=1; i<8; i++ ) {
	    ctx.save();
	    ctx.translate(i*(w/8)+marginX, h+5+marginY);
	    var textWidth = ctx.measureText(year);
	    ctx.fillText(year++, -textWidth.width/2, 10);
	    //ctx.beginPath();
	    //ctx.moveTo(0, -35);
	    //ctx.lineTo(0, -380);
	    //ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(0, -10);
	    ctx.lineTo(0, -20);
	    ctx.stroke();
	    ctx.restore();
	}
	for( var i=1; i<21; i++ ) {
	    ctx.save();
	    ctx.translate(marginX, i*(h/22)+marginY);
	    ctx.fillText(i, 30, 2);
	    //ctx.beginPath();
	    //ctx.moveTo((w/8), -3);
	    //ctx.lineTo(7*(w/8), -3);
	    //ctx.stroke();
	    ctx.restore();
	}
	ctx.save();
	ctx.translate(15+marginX, h/2+marginY);
	ctx.font = "bold 16px sans-serif";
	ctx.rotate(Math.PI*3/2);
	var textWidth = ctx.measureText("Rank");
	ctx.fillText("Rank", -textWidth.width/2, 0);
	ctx.restore();
	ctx.restore();
    }

    function draw_points(data, grid) {
	ctx.save();
	for( var i=0; i<data.length; i++ ) {
	    for( var j=0; j<20; j++ ) {
		ctx.save();
		ctx.translate(grid[i][j][0], grid[i][j][1]);
		ctx.fillStyle = col[data[i][j][1]];
		ctx.beginPath();
		ctx.arc(0, 0, 4, 0, Math.PI*2);
		ctx.fill();
		ctx.restore();
	    }
	}
	ctx.restore();
    }

    function draw_lines(data, grid) {
	ctx.save();
	ctx.lineWidth = 2;
	for( var i=0; i<data.length-1; i++ ) {
	    for( var j=0; j<20; j++ ) {
		ctx.save();
		var from = data[i][j][0];
		ctx.strokeStyle = col[data[i][j][1]];
		for( var k=0; k<20; k++ ) {
		    if( from == data[i+1][k][0] ) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(grid[i][j][0],grid[i][j][1]);
			ctx.lineTo(grid[i+1][k][0],grid[i+1][k][1]);
			ctx.stroke();
			ctx.restore();
		    }
		}
		ctx.restore();
	    }
	}
	ctx.restore();
    }
    function color_legend(w, h, marginX, marginY) {
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font = "Bold 11px sans-serif";
	ctx.translate(w-40+marginX, marginY);

	var rside = 0;
	for( var c in col ) {
	    if( rside == 0 ) {
		ctx.translate(0, 20);
	    } else {
		ctx.save();
		ctx.translate(50, 0);
	    }
	    ctx.fillText(c, 20, 5);
	    ctx.save();
	    ctx.fillStyle = col[c];
	    ctx.beginPath();
	    ctx.arc(5, 0, 5, 0, Math.PI*2);
	    ctx.fill();
	    ctx.restore();
	    if( rside != 0 ) {
		ctx.restore();
	    }
	    rside = ~rside;
	}
	ctx.restore();
    }
}
