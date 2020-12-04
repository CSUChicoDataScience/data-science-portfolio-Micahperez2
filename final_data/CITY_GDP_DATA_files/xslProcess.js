// JavaScript Document

var masterObj = {};

function loadXMLDoc(dname)
	{
		if (window.XMLHttpRequest)
			{
				xhttp=new XMLHttpRequest();
			}
		else
			{
				xhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
		xhttp.open("GET",dname,false);
		xhttp.send("");
		return xhttp.responseXML;
	}
function getTimeString()
{
	return new Date().getTime();	
}
function applyXsltToXML(objName,xsl,docid,callBackFunction,params)
	{	
		var t = 0;
		var xslParams;
		
		if(params)
			t = params.length;
			
		xslTemplate = xsl.getElementsByTagName("xsl:template")[0]
		if(!xslTemplate || xslTemplate == null){xslTemplate = xsl.getElementsByTagName("template")[0];}
		
		
		xslParams = xslTemplate.getElementsByTagName("xsl:param");
		if(!xslParams || xslParams == null || xslParams.length == 0){xslParams = xslTemplate.getElementsByTagName("param");}
		
		var g = xslParams.length;
		if(t > 0 && g > 0)
		{
			for (var i = 0; i < t; i++)
			{
				$(xslParams).each(function(){
											if(params[i].name == this.getAttributeNode('name').value)
											{
												this.setAttribute('select', '"'+params[i].value+'"');
											}});
			}
		}
		
		
	
		var xml = masterObj[objName];
		var ex,resultDocument;
		// code for IE
		if(window.ActiveXObject) {       
		   var xslt = new ActiveXObject("Msxml2.XSLTemplate"); 
		   var xmlDoc = new ActiveXObject("Msxml2.DOMDocument"); 
		   var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument"); 
		   xmlDoc.loadXML(xml); 
		   xslDoc.loadXML(xsl.xml); 
		   xslt.stylesheet = xslDoc; 
		   var xslProc = xslt.createProcessor(); 
		   xslProc.input = xmlDoc; 
		   xslProc.transform(); 
		   ex=xslProc.output;
		   document.getElementById(docid).innerHTML=ex;
		  
		} 
		// code for Mozilla, Firefox, Opera, etc.
		else if (document.implementation && document.implementation.createDocument)
		  {
		  xsltProcessor=new XSLTProcessor();
		  xsltProcessor.importStylesheet(xsl);
		  ex = xsltProcessor.transformToFragment($.parseXML(xml),document);
		  document.getElementById(docid).innerHTML = '';
		  document.getElementById(docid).appendChild(ex);
		  }
		if(callBackFunction)
		{	
			var exHolder = {'ex':ex};
			callBackFunction = callBackFunction+"(arguments,exHolder)";
			eval(callBackFunction);
		}
	}
	
	
	
	function callPeService(method,data,xmlelem,xslfilename,elemid,callBackFunction,params)
	{
		jQuery.ajax({ 
				type: "POST", 
				url: method, 
				data:data,
				cache: false,
				dataType: "XML",
				success:function(data, textStatus, jqXHR){
						masterObj[xmlelem] = jqXHR.responseText;
						var d=new Date(); 
						var xsl=loadXMLDoc("xsl/"+xslfilename+".xsl?"+d.getTime());
						applyXsltToXML(xmlelem,xsl,elemid,callBackFunction,params);
						},
				complete:function(jqXHR, textStatus)
				{
				},
				error:function(jqXHR, textStatus, errorThrown)
				{
					modals.showInfoDiv(error, 'Error ocourred!<br>'+textStatus );

				}
			});
	}