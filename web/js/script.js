/* 20110506, Yohei Kuga, sora@sfc.wide.ad.jp */
$(function() {
    "use strict";

    var ccRank = new Array();

    var path   = "dat/history/";
    var target = "asia";
    var data   = [["2004", "2004-V.txt", "2004-E.txt"],
                  ["2005", "2005-V.txt", "2005-E.txt"],
                  ["2006", "2006-V.txt", "2006-E.txt"],
                  ["2007", "2007-V.txt", "2007-E.txt"],
                  ["2008", "2008-V.txt", "2008-E.txt"],
                  ["2009", "2009-V.txt", "2009-E.txt"],
                  ["2010", "2010-V.txt", "2010-E.txt"]];

    var ajaxqueue = $({});
    $.ajaxqueue = function(opts) {
	var old = opts.complete;
	ajaxqueue.queue( function(next) {
	    opts.complete = function() {
		if(old) old.apply(this, arguments);
		next();
	    };
	    $.ajax(opts);
	});
    };
    draw(target);

    function draw(target) {
	var canvas_id = 0;
	ccRank    = [];

	$('h2.loading').show();
	$('.container').hide();
	$('#contents').html('');
	$('#ccrank_wrap > h2').text('Country Ranking');
	$('#ascoremap > h2').text('AS Rank');

	$('#ccrank_wrap > h2').append(' in ' + target.toUpperCase());
	$('#ascoremap > h2').append(' in ' + target.toUpperCase());

	$.each(data, function() {
	    var canvas, title, as_data, link_data;
	    canvas    = 'sketch' + canvas_id++;
	    title     = this[0];
	    as_data   = path + target + '/' + this[1];
	    link_data = path + target + '/' + this[2];
	    getData(as_data, link_data, callback, canvas, title, 0, 1);
	});
    }

    /*
     * GET topology data
     */
    function getData(as_data, link_data, callback, canvas, title, order, is_init) {
	var ASes, Links;
  	var get_as_data = {
	    url: as_data,
	    type: 'get',
	    dataType: 'text',
	    cache: true,
	    success: function(data) {
		ASes = data.split("\n");
		$.ajaxqueue(get_link_data);
	    }
	};
  	var get_link_data = {
	    url: link_data,
	    type: 'get',
	    dataType: 'text',
	    cache: true,
	    success: function(data) {
		Links = data.split("\n");
		callback(ASes, Links, canvas, title, order, is_init);
	    }
	};
	$.ajaxqueue(get_as_data);
    }

    /* 
     * draw the map after getData()
     */
    function callback(ASes, Links, canvas, title, order, is_init) {
	if( is_init ) {
	    makeTable(ASes, canvas, title);
	}
	ASCoreMap(canvas, ASes, Links, order);
	$('canvas#'+canvas).parent().find('h2.loading').hide();
	$('canvas#'+canvas).show();
	$('body > h2.loading').append(".");
	addEvents();
	if( is_init && canvas == data[data.length-1][0]) {
	    $('body > h2.loading').html("Now loading .");
	    $('h2.loading').hide();
	    $('.container').fadeIn('slow');
	    CountryRank('ccrank', ccRank);
	    is_init = null;
	}
    }

    function makeTable(ASes, canvas, title) {
	var cc = new Array();
	var ranking = new Array();
	for( var i=0; i<20; i++ ) {
	    var p = ASes[i].split(' ');
	    ranking.push( { order: p[0], asn: p[2], asname: p[6],
			    ascc: p[7], ndegree: p[1] } );
	    cc.push([p[2], p[7]]);
	};
	ccRank.push(cc);
	var mapdata = {
	    title: title,
	    canvas: canvas,
	    rank: ranking
	}
	$('#tmpl-rank').tmpl(mapdata).appendTo('#contents');
    }

    function addEvents() {
	/* 
	 * Mouse events for hover and click
	 */
	$('.rank').hover(function() {
	    $(this).addClass('hilite');
	}, function() {
	    $(this).removeClass('hilite');
	});
	$('.rank').click(function() {
	    if( ! $(this).hasClass('clicked') ) {
		var canvas_id, order;
		$(this).siblings().each(function() {
		    $(this).removeClass('clicked');
		});
		$(this).addClass('clicked');
		canvas_id = $(this).parent().find('canvas').attr('id');
		order = $(this).children('.focus').text();

		var canvas, as_data, link_data, ASes, Links;
		var a = $('#ascoremap > h2').text().split(' ')[3].toLowerCase();
		$.each(data, function() {
		    if( this[0] == canvas_id ) {
			as_data = path + a + '/' + this[2];
			link_data = path + a + '/' + this[3];
			return false;
		    }
		});
		$('canvas#'+canvas_id).hide();
		$('canvas#'+canvas_id).parent().find('h2.loading').show();
		getData(as_data, link_data, callback, canvas_id, null, order, null);
	    }
	});

	/*
	 * Save the ASCoreMap image
	 */
	$('canvas').dblclick(function() {
	    var target_canvas = $(this).parent().parent().find('canvas').get(0);
	    var img_src = target_canvas.toDataURL("image/png");
	    var d = img_src.replace("image/png", "image/octet-stream");
	    var win = window.open(d, "save");
	    win.setTimeout( "close();", 400);
	});
    }

    $('#menu > a').click(function() {
	var target = $(this).text().toLowerCase();
	draw(target);
    });
});
