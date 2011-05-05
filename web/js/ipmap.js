/*
 * IPMap v0.1
 * 20110425, Yohei Kuga, sora@sfc.wide.ad.jp
 */

function IPMap(canvas_id, addr_data, o1) {
    "use strict";
    console.log(o1);
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");

    draw(addr_data);

    function draw(addrs) {
	var ipmap = new Array(4096);
	for( var a=0;a<4096;a++ ) {
	    ipmap[a] = new Array(4096);
	}
	
	ctx.save();
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();

	for( var i=0;i<addrs.length-1;i++ ) {
	    var oct = addrs[i].split('.');

	    if( oct[0] != o1 ) {
		continue;
	    }
	    var o2 = Number(oct[1]).toString(2);
	    var o3 = ("00000000" + Number(oct[2]).toString(2)).slice(-8);
	    var o4 = ("00000000" + Number(oct[3]).toString(2)).slice(-8);
	    var y = Math.floor(parseInt(o2+o3+o4, 2) / 4096);
	    var x = parseInt(o2+o3+o4, 2) % 4096;

	    if( ! ipmap[x][y] ) {
		ipmap[x][y] = 0;
	    }
	    ipmap[x][y] += 1;
	}

	ctx.fillStyle = "black";
	for( var x=0;x<4096;x++ ) {
	    for( var y=0;y<4096;y++ ) {
		if( ipmap[x][y] ) {
		    ctx.beginPath();
		    ctx.rect(x,y,1,1);
		    ctx.fill();
		}
	    }
	}
	ctx.restore();
    }
}