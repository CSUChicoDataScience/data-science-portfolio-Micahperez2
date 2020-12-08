var chartDataProvider = [];
var chart = null;
var charttype = 'line';
//var colors = ['#00267F','#C69200','#9FC195','#AE482C','#CCCCCC','#AFC8FF','#F5CA59','#3D5834','#D77633','#000000'];
var colors = ['#004C97','#D86018','#2DCCD3','#F2A900','#9EA2A2','#6CACE4','#FFE9C3','#007D8A','#C1C4C5','#000000'];
var activeseries = [];
$( window ).resize(function() { resizeChart(); });

function makeChart()
{
	if( chart !== null )
		chart.clear();
		
	chartDataProvider = [];
	chart = null;

	chart = new AmCharts.makeChart("chartdiv", {
		type: "serial",
		dataProvider: chartDataProvider,
    	autoMarginOffset: 20,
		marginBottom: 100,
  		startDuration: 0,
		pathToImages: "//cdn.amcharts.com/lib/3/images/",
		mouseWheelZoomEnabled:true,
		categoryField: "TIME_PERIOD",
		categoryAxis: {
			minorGridEnabled: false,
			axisColor: "#3A8FAB",
       		dashLength: 1,
			axisThickness:10,
			axisAlpha:.4,
			gridAlpha:.1
		},
		valueAxes: [{
			axisColor: "#3A8FAB",
       		dashLength: 1,
			axisThickness:10,
			axisAlpha:.4,
			gridAlpha:.2,
			id: "v1",
			title:chartdata.YAXISLABEL
		}],
		chartCursor: {
			fullWidth:false,
			cursorAlpha:0.1,
			zoomable:true,
			valueBalloonsEnabled:false,
			bulletsEnabled:true
		},
		chartScrollbar: new ChartScrollbar(),
		titles: [{
			text: chartdata.CHARTNAME
		}],
		export: {
   			 enabled: true
  		},
		allLabels: [{
						text: "Click an item on the list to add it to the chart. \n\n Click the same item again to remove it from the chart.",
						x: 200,
						y: "40%",
						bold:true,
						id:"charthelptextlabel",
						size:20,
						color:"#CCC",
						alpha:.5
					},
					{
						text: "Source: U.S. Bureau of Economic Analysis",
						x: 20,
						y: "98%"
					}],
	  	legend: {
			useGraphSettings: false
  		}
	});
}
function addSeries(series)
{
	var seriesindex = $.inArray(series,activeseries);
	if(seriesindex === -1)
	{
		if(activeseries.length == 10)
		{
			modals.showInfoDiv('error', 'The maximum number of series on the Chart is 10. <br/> Remove one or more series from the chart to add new ones.');
			return;
		}
		
		addChartLabels(false);
		series.DATAPOINT.sort(function(a,b){
			if (a.TIME_PERIOD < b.TIME_PERIOD)
				return -1;
			if (a.TIME_PERIOD > b.TIME_PERIOD)
				return 1;
			return 0;
			})
		if(chartDataProvider.length == 0)
		{
			$(series.DATAPOINT).each(function(i, e) {
				chart.dataProvider.push(createDataPoint(series,e));
			});
		}
		else
		{
			$(series.DATAPOINT).each(function(i, e) {
				var tmp = jQuery.grep(chart.dataProvider,function(a){
					return a.TIME_PERIOD == e.TIME_PERIOD;	
				})
				if(tmp.length == 0)
					chart.dataProvider.push(createDataPoint(series,e));
				else
					$(chart.dataProvider).each(function(j, d) {
						if(d.TIME_PERIOD == e.TIME_PERIOD)
							d[series.NAME] = parseFloat(e.VALUE);	
					});
					
			});
		}
		chart.addGraph(createLineGraph(series,activeseries.length));
		activeseries.push(series);
	}
	else 
	{
		activeseries.splice(seriesindex,1);
		if(activeseries.length == 0)
			ClearAllSeries();
		$(chart.dataProvider).each(function(j, d) {
			if (typeof d[series.NAME] !== typeof undefined) {
				delete d[series.NAME];
			}
		});
		chart.graphs = [];
		$(activeseries).each(function(i, series) {
			chart.addGraph(createLineGraph(series,i));
		});
		$("ul#serieslist li[seriesid="+series.ID+"]").removeAttr('style').children(".bulletNormal").removeAttr('style').removeClass("bulletSelected");
	}
	
	chart.chartScrollbar = new ChartScrollbar();
	
	$("#clearseriesbtn").attr("disabled","disabled");
	if(activeseries.length > 0)
		$("#clearseriesbtn").attr("disabled",false);
	chart.validateData();
	chart.validateNow();
}
var ChartScrollbar = function (){
	return {
			graph: "g0",
			graphType:"line",
			scrollbarHeight: 40,
			offset:35,
			oppositeAxis:false,
			autoGridCount: true,
			
			dragIcon:"dragIconRoundBig",
			
			//graphFillColor:"#00267F",
			graphFillAlpha:1,
			
			//graphLineColor:"#00267F",
			graphLineAlpha:1,
			
			selectedGraphFillColor:"#00267F",
			selectedGraphFillAlpha:.2,
			selectedGraphLineColor:"#00267F",
			selectedGraphLineAlpha:1
		}
}
function createLineGraph(series,i)
{
	var graph = new AmCharts.AmGraph();
	graph.type = charttype;
	graph.fillAlphas = 0.9;
	if(charttype == 'line')
		graph.fillAlphas = 0;
	graph.id = "g"+i;
	graph.title = series.NAME;
	graph.lineColor = colors[i];
	graph.valueField = series.NAME;
	graph.lineThickness = 1;
	if(charttype == 'line')
		graph.bullet = "round";
	graph.bulletBorderThickness = 2;
	graph.bulletBorderColor = colors[i];
	graph.bulletBorderAlpha = 1;
	graph.bulletColor = "#ffffff";
	graph.dashLengthField = "dashLengthLine";
	$("ul#serieslist li[seriesid="+series.ID+"]").css({'background-color':colors[i],'color':"#FFF"}).children(".bulletNormal").addClass("bulletSelected");
	return graph;
}
function createDataPoint(series,e)
{
	var obj = {};
	obj.TIME_PERIOD=e.TIME_PERIOD;
	obj[series.NAME] = parseFloat(e.VALUE);	
	return obj;
}
function ClearAllSeries()
{
	chart.dataProvider = [];
	chart.graphs = [];
	activeseries = [];
	$("#clearseriesbtn").attr("disabled","disabled");
	$("ul#serieslist li[seriesid]").removeAttr('style').children(".bulletNormal").removeAttr('style').removeClass("bulletSelected");
	chart.validateData();
	chart.validateNow();
	addChartLabels(true)
}
function changeType(type,el)
{
	charttype = type;
	chart.graphs = [];
	$(activeseries).each(function(i, series) {
		chart.addGraph(createLineGraph(series,i));
	});
	chart.chartScrollbar = new ChartScrollbar();
	chart.validateData();	
	$(".chartSelectBtn").removeClass('selected');
	$(el).addClass("selected");
	chart.validateNow();
	return false; 
}
function addChartLabels(showhelp)
{
	chart.clearLabels();
	chart.addLabel(x = 20, "98%", "Source: U.S. Bureau of Economic Analysis");
	if(showhelp === true)
		chart.addLabel(x = 200, "40%", "Click an item on the list to add it to the chart. \n\n Click the same item again to remove it from the chart.", "left", 25, "#CCC", 0, .5, true);
}



function resizeChart()
{
	//alert($("#chartcontainer").width());	
	$("#chartdiv").width($("#Final_Table_wraper").width() - $("#ChartTypeBtnContainer").outerWidth() - $("#chartseriescontainer").outerWidth() - 20);
	$("#ChartTypeBtnContainer").css({"margin-left": - $("#chartdiv").outerWidth() - 62});
	$("#chartdiv").css({"margin-left": $("#ChartTypeBtnContainer").outerWidth()});
	//alert($("#chartcontainer").width());
}