/*
 * ASCoreMap v0.1
 * 20110401, Yohei Kuga, sora@sfc.wide.ad.jp
 */

function ASCoreMap(canvas_id, ASes, Links, focus_as) {
    "use strict";

    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");

    var x0 = canvas.width / 2;
    var y0 = canvas.height / 2;
    var R  = Math.min(x0, y0) * 0.8;
    var font_size = Math.round(canvas.width / 50);

    draw();

    function draw() {
	ctx.save();
	
	// init
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.fillStyle = "rgb(34,34,34)";
	//ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.arc(x0, y0, R*1.2, 0, Math.PI*2, true);
	ctx.fill();
	ctx.translate(x0, y0);
	ctx.fillStyle = "white";

	// main
	drawBG();
	drawPeers(focus_as);
	drawASes(focus_as);

	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.rect(-3, -3, 6, 6);
	ctx.fill();

	// end
	ctx.restore();
    }

    function drawBG() {
	ctx.save();
	for( var i = 0; i < 360; i++ ) {
	    var airt = "";
	    var j;
	    var c = "hsl(" + i + ", 50%, 50%)";
	    ctx.strokeStyle = c;
	    ctx.lineWidth   = 2;
	    ctx.rotate(Math.PI / 180);
	    ctx.beginPath();
	    if( i % 10 != 0 ) {
		ctx.moveTo(0, x0 * 0.83);
		ctx.lineTo(0, x0 * 0.85);
		ctx.stroke();
	    } else {
		ctx.beginPath();
		ctx.moveTo(0, x0 * 0.81);
		ctx.lineTo(0, x0 * 0.85);
		ctx.stroke();
		ctx.save();
		ctx.translate(0, x0 * 0.88, 0);
		ctx.rotate(Math.PI);
		j = Math.abs(i - 90);
		if( j > 180 ) {
		    j = 180 - (j % 180);
		}
		if( j % 10 == 0) {
		    if( ( i > 90 && i <= 180 ) || ( i > 180 && i < 270 ) ) {
			airt = "E";
		    } else if( i != 90 && i != 270 ) {
			airt = "W";
		    }
		    var exp = (180 - j) + airt;
		    ctx.font = "bold " + font_size + "px sans-serif";
		    var textWidth = ctx.measureText(exp);
		    ctx.fillText(exp, textWidth.width / 2 * -1, 0);
		}
		ctx.restore();
	    }
	}
	ctx.restore();
    }

    function drawPeers(focus_as) {
	var focus_links = new Array();
	ctx.save();
	ctx.lineWidth = 0.1;
	for( var i = 0; i < Links.length; i++ ) {
	    if( ! Links[i] ) {
		continue;;
	    }
	    var p = Links[i].split(' ');
	    if( p[0] == focus_as ) {
		focus_links.push(Links[i]);
		continue;
	    }
	    var angle = Math.round(p[7]);
	    if( angle < -90 ) {
		angle = Math.abs(angle) - 90;
	    } else if( angle < 0 ) {
		angle = Math.abs(angle) + 270;
	    } else {
		angle = 270 - angle;
	    }
	    ctx.beginPath();
	    ctx.strokeStyle = "hsla(" + angle + ", 20%, 50%, 0.5)";
	    ctx.moveTo(p[1] * R, p[2] * R);
	    ctx.lineTo(p[4] * R, p[5] * R);
	    ctx.stroke();
	}

	if( focus_links.length > 0) {
	    ctx.lineWidth = 0.5;
	    for( var link in focus_links ) {
		var p = focus_links[link].split(' ');
		var angle = Math.round(p[7]);
		if( angle < -90 ) {
		    angle = Math.abs(angle) - 90;
		} else if( angle < 0 ) {
		    angle = Math.abs(angle) + 270;
		} else {
		    angle = 270 - angle;
		}
		ctx.beginPath();
		ctx.strokeStyle = "hsla(" + angle + ", 50%, 50%, 0.5)";
		ctx.moveTo(p[1] * R, p[2] * R);
		ctx.lineTo(p[4] * R, p[5] * R);
		ctx.stroke();
	    }
	}
	ctx.restore();
    }

    function drawASes(focus_as) {
	var focus;
	ctx.save();
	for( var i = 0; i < ASes.length; i++ ) {
	    if( ! ASes[i] ) {
		continue;
	    }

	    var p = ASes[i].split(' ');
	    ctx.beginPath();
	    ctx.arc(p[3] * R, p[4] * R, 2, 0, Math.PI*2, true);
	    ctx.fill();
	    if( p[2] == focus_as ) {
		focus = p;
	    }
	}
	if( focus ) {
	    ctx.fillStyle = "yellow";
	    ctx.beginPath();
	    ctx.arc(focus[3] * R, focus[4] * R, 5, 0, Math.PI*2, true);
	    ctx.fill();
	}
	ctx.restore();
    }
}
