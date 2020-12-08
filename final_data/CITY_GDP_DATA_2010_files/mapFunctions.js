
wresize = false;
function resizeMap() {
    $('#mapContainer').css("opacity", 0);
    var screenHeight = screen.height * .6 + 'px';
    if ($('#Final_Table_wraper').width() < screen.width)
        var swidth = $('#Final_Table_wraper').width() - 10;
    else
        var swidth = screen.width - 10;
    $('#mapContainers,#mapContainer').css('width', swidth);
    $('#mapContainers,#mapContainer').css('height', screenHeight);
    loadAmMap();
}
var mapJsonObj;
function loadAmMap(obj, mapdiv) {
   // create AmMap object
    $('#mapContainer').css("opacity", 0);
    var map = new AmCharts.AmMap();

    if (!mapdiv)
        mapdiv = "mapContainer";
    if (obj)
        mapJsonObj = obj;

    var dataProvider = {
        mapVar: mapJsonObj.mapcoords,
        areas: mapJsonObj.mapdata.areas,
        getAreasFromMap: true,
        zoomLevel: 0.8
    };

    // pass data provider to the map object
    map.dataProvider = dataProvider;

    map.areasSettings = {
        autoZoom: false,
        selectedColor: "#CC0000",
        outlineColor: "#666",
        outlineThickness: 1
    };
    map.zoomControl = {
        minZoomLevel: 0.8
    }
	//mapJsonObj.mapdata.mapProps.subtitleText = "genoaoskdfj adslfj asd;flj adskjfh alskjhf asldkfh aslkdfh"
	map.titles = [
		{
			"text": mapJsonObj.mapdata.mapProps.titleText,
			"size": 15
		},
		{
			"text": mapJsonObj.mapdata.mapProps.subtitleText,
			"size": 11
		}
	];
    // disable zoomControl and panControl
    map.zoomControl.zoomControlEnabled = false;
    map.zoomControl.panControlEnabled = false;
    // disable zoomOnDoubleClick
    map.zoomOnDoubleClick = false;
    //disable draging the map
    map.dragMap = false;
	
    map.pathToImages = "/iTable/images/"
    map.amExport = {
        top: 21,
        right: 20,
        userCFG: {
            menuItems: [{
                textAlign: 'center',
                icon: 'export.png',
                iconTitle: 'Save Map',
                label: " ",
				delay:3,
                items: [{
                    title: 'JPG',
                    format: 'jpg'
                }, {
                    title: 'PNG',
                    format: 'png'
                }, {
                    title: 'PDF',
                    format: 'pdf',
                    output: 'datastring',
                    onclick: function(instance, config, event) {
                        instance.output(config, function(datastring) {
                            data = instance.canvas.toDataURL('image/jpeg'),
                                width = (instance.canvas.width * 25.4) / 150, 
                                height = (instance.canvas.height * 25.4) / 150; 

                            var pdf = new jsPDF('landscape');
                            pdf.addImage(data, 'JPEG', 10, 20, width, height);
                            pdf.save("filename.pdf");
                        });
                    }
                }]
            }],
            menuItemStyle: {
                backgroundColor: '#FFF',
                opacity: 1,
                rollOverBackgroundColor: '#EFEFEF',
                color: '#000000',
                rollOverColor: '#CC0000',
                paddingTop: '6px',
                paddingRight: '6px',
                paddingBottom: '6px',
                paddingLeft: '6px',
                marginTop: '0px',
                marginRight: '0px',
                marginBottom: '0px',
                marginLeft: '0px',
                textAlign: 'left',
                textDecoration: 'none',
                fontFamily: 'Arial', // Default: charts default
                fontSize: '12px', // Default: charts default
            },
            legendPosition: "bottom", //top,left,right
            removeImagery: true
        }
    }
	map.balloon = {
		fixedPosition: false,
		drop: true, 
		fillAlpha: .7, 
		fadeOutDuration: 0
	}
    map.write(mapdiv);

    if (wresize == false)
        map.invalidateSize();
    //map.addListener("dataUpdated",function(){alert();});
    setTimeout(function() {
           // buildTitle(mapJsonObj, mapdiv);
            buildLegend(mapJsonObj, mapdiv);
            if (wresize == false) {
                wresize = true;
                loadAmMap();

                setTimeout(function() {
                    wresize = false;
                    $('#mapContainer').animate({
                        opacity: 1
                    }, 500);
                }, 10);
            }
        },
        10);
}

function buildTitle(masterObj, elem) {
    el = $("#" + elem);
    x = 0;
    y = 5;
    tit = masterObj.mapdata.mapProps.titleText;
    subtit = masterObj.mapdata.mapProps.subtitleText + "";
	if(subtit == "")y=20;
    titX = (el.width() / 2) - (tit.length * 4);
    subtitX = (el.width() / 2) - (subtit.length * 3.5);
    if (subtitX < 0) subtitX = 10;

    g = jQuery('<g id="mapTitle" transform="translate(' + x + ' ' + y + ')"></g>');

    /*	<text xmlns="http://www.w3.org/2000/svg" x="10" y="25" style="width:150px; font-size:20px; font-family:Georgia, serif; fill:green;">
    Wrapping text in SVG is easy!
    <tspan x="10" dy="2em">And fun, too!</tspan>
    </text>*/

    txt = $('<text font-family="Verdana" font-size="11" fill="#000000" transform="translate(0 0)" y="0"></text>');
    var row = 1;
    if (titX < 0)
        for (i = 0; i < tit.length; i = i + parseInt(el.width() / 9)) {
            var txta = tit.substring(i, parseInt(el.width() / 9) + i);
            titX = (el.width() / 2) - (txta.length * 4);
            if (titX < 0) titX = 10;
            txt.append($('<tspan x="' + titX + '" y="' + (row * 16) + '" style="font-weight:bold;font-size:14;color:#FF0000;">' + txta + '</tspan>'));
            row++;
        } else {
        txt.append($('<tspan x="' + titX + '" y="15" style="font-weight:bold;font-size:14;color:#FF0000;">' + tit + '</tspan>'));
    }
    subtitsp = $('<tspan x="' + subtitX + '" y="35" style="font-style:italic;">' + subtit + '</tspan>');
    g.append(txt.append(subtitsp));
    svg = jQuery('<svg>' + g[0].outerHTML + '</svg>');
    //svg.append(g);
    pi = jQuery("#" + elem + " svg g g")[0];

    var piX = (el.width() - pi.getBoundingClientRect().width) / 2;
    piX = piX > 5 ? piX : el.width() * .1;
    //$(pi).attr("transform","translate("+piX+" 50) scale(.80)");
    $("#" + elem + " svg").append(svg.children());
}

function buildLegend(masterObj, elem) {
    el = jQuery("#" + elem);
    var maplen = 0;
    var legData = masterObj.mapdata.mapProps.legendInfo;

    $(legData).each(function(i, e) {
        if (e.maxVal != "" && e.minVal != "") con = " to ";
        str = e.minVal + con + e.maxVal;
        maplen += ((str.length * 7) + 25);
    });

    x = (el.width() - maplen) / 2 > 0 ? (el.width() - maplen) / 2 : 5;
	var pi = jQuery("#" + elem + " svg g g g")[0];
	var pib = pi.getBBox();
    y = Number($("#" + elem ).height()) - 60;

    g = jQuery('<g transform="translate(' + x + ' ' + y + ')"></g>');

    lt = jQuery('<text font-family="Verdana" font-size="11" fill="#000000" transform="translate(0 5)"></text>');
    ltsp = jQuery('<tspan x="5" y="0">' + masterObj.mapdata.mapProps.legendText + '</tspan>');
    lt.append(ltsp);
    g.append(lt);

    startx = 5;
    starty = 20;
    $(legData).each(function(i, e) {
        recw = 20;
        recx = startx;
        txtx = recw + recx + 5;
        con = " ";
        if (e.maxVal != "" && e.minVal != "") con = " to ";
        str = e.minVal + con + e.maxVal;
        startx = txtx + (str.length * 7);
        if (startx + 30 > el.width()) {
            starty += 20;
            recx = 5;
            txtx = recw + recx + 5;
            startx = txtx + (str.length * 7);
        }
        rect = jQuery('<rect id="r1" fill="' + e.color + '" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="translate(' + (txtx - recw - 5) + ' ' + starty + ')" width="' + recw + '"  height="12" rx="0" ry="0" />');
        txt = jQuery('<text font-family="Verdana" font-size="11" fill="#000000" transform="translate(' + txtx + ' ' + (starty + 10) + ')" >' + str + '</text>');

        g.append(rect);
        g.append(txt);
    });

    svg = jQuery('<svg class="geno">' + g[0].outerHTML + '</svg>');
    //svg.append(g);
    jQuery("#" + elem + " svg").append(svg);
}