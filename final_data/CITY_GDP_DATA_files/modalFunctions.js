// JavaScript Document

// JavaScript Document

$(function () {
	modals.init();
});
var modals = new (function (window, $) {
	"use strict";
	var obj = this;
	//var pleaseWaitDiv = $('#pleaseWaitDialog');
	this.pleaseWaitDiv;
	this.infoDiv;
	var confirmDialog = $("#confirmDialog");
	var largeDialog = $("#windowDialog");
	this.tmpl = null;
	this.timeoutobj;
	this.init = function()
	{
		obj.makdePleaseWaitDiv();
		
		$(document).ajaxStart(function () {
			obj.showPleaseWait();
		});
		$(document).ajaxStop(function () {
			clearTimeout(obj.timeoutobj);
			obj.timeoutobj = null;
			obj.hidePleaseWait();
		});
		obj.makdeInfoDiv();
	}
	this.show
	this.makdePleaseWaitDiv = function(){
		var o = new obj.ModalObj();
		o.title = 'Please Wait';
		o.size = "modal-md";
		o.buttons = [];
		o.bodyid = 'PleaseWaitBody';
		o.id = 'PleaseWaitDiv';
		obj.pleaseWaitDiv = modals.MakeModal(o).modal;
		$("#PleaseWaitBody").html('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:100%; height:2em;"> Processing... </div>')
	}
	this.makdeInfoDiv = function(){
		var o = new obj.ModalObj();
		o.title = 'Info';
		o.size = "modal-md";
		o.id = 'InfoDiv-modal';
		o.bodyid = 'InfoDiv-body';
		obj.infoDiv = modals.MakeModal(o).modal;
	}

	this.showPleaseWait = function (isRecursive) {
		if (!isRecursive)
			obj.timeoutobj = setTimeout(function(){
				if($(".modal-backdrop").length != 0)
					return obj.showPleaseWait();
				else {
					obj.timeoutobj = null;
					obj.showPleaseWait(true);
				}
			},10);
			if(obj.timeoutobj != null) return;
			obj.pleaseWaitDiv.modal('show');
			obj.pleaseWaitDiv.modal().on('show.bs.modal', function () {
				$('.modal-backdrop:eq(1)').css('z-index', "1070");
				obj.tmpl = setTimeout(function () {
					clearTimeout(obj.tmpl);
					$('#pleaseWaitDialog .modal-header button').hide();
					if ($('#pleaseWaitDialog').hasClass('in'))
						$('#pleaseWaitDialog .modal-header button').show();
				}, 5000);
			});
			obj.pleaseWaitDiv.modal().on('hide.bs.modal', function (e) {
				$('.modal-backdrop').css('z-index', "1000");
				clearTimeout(obj.tmpl);
			})
		};
		this.hidePleaseWait = function () {
			setTimeout(function () {
				obj.pleaseWaitDiv.modal('hide');
			}, 1);
		};
		this.showConfirmDiv = function (text, title, yescallback, nocallback) {
			$(confirmDialog).find("p").css("word-wrap", "break-word").html(text);
			if (!title) title = "Confirm Action";
			$(confirmDialog).find("h4.modal-title span.modal-title").html(title);
			confirmDialog.modal('show');
			$(confirmDialog).find(".modal-footer button.btn-success").unbind("click").one("click", function (e) {
				if (typeof yescallback === "function") yescallback.apply();
			});
			$(confirmDialog).find(".modal-footer button.btn-danger").unbind("click").one("click", function (e) {
				if (typeof nocallback === "function") nocallback.apply();
			});
		};
	this.showInfoDiv = function (type, text, title, callbackshow, callbackhide) {
		$("#InfoDiv-body").html(text);
		var title = !title ? "Info" : title;
		$(obj.infoDiv).find("h4.modal-title span.modal-title").html(title);
		var styles = {
			"#infoDialog h4": "modal-title text-info",
			"#infoDialog h4 span.fa": "fa fa-info-circle",
			"#infoDialog .modal-body .alert": "alert alert-info",
			"#infoDialog .btn": "btn btn-info"
		}
		if (type == "error")
			styles = {
				"#infoDialog h4": "modal-title text-danger",
				"#infoDialog h4 span.fa": "fa fa-warning",
				"#infoDialog .modal-body .alert": "alert alert-danger",
				"#infoDialog .btn": "btn btn-danger"
			}
		$.each(styles, function (key, value) {
			$(key).removeClass().addClass(value);
		});
		obj.infoDiv.off("on").modal('show').on('shown.bs.modal', function (e) {
			if (typeof callbackshow === "function") callbackshow.apply();
		}).on('hidden.bs.modal', function (e) {
			if (typeof callbackhide === "function") callbackhide.apply();
		});
	};
	this.hideInfoDiv = function () {
		obj.infoDiv.modal('hide');
	};
		
	this.resizeModal = function (modal, size) {
		this.w = 1200;
		var o = this;
		var maxHeight = $(window).height() * .95;
		if (!size)
			this.w = $(window).width() * .75;
		if (size === "full")
			this.w = $(window).width() * .99;
		else
			this.w = $(window).width() >= size ? size : $(window).width() * .95;
		if ($(modal).hasClass('show') || $(modal).hasClass('in')) {
			var tmp = $(modal).find('.modal-body');
			
			var dif =  parseInt(tmp.get(0).scrollHeight) - parseInt(tmp.innerHeight());
			var tmph = $(modal).find('.modal-content').height() + dif;
			var mh = maxHeight;
			if(tmph <= maxHeight)
				mh =  tmph;
			$(modal).find('.modal-content').css({
					width: o.w + 'px',
					height: mh + 20 + 'px',
					'max-height': mh + 20 + 'px',
					overflow: 'auto'
				});
			var nh = $(modal).find('.modal-content').height() - $(modal).find('.modal-header').outerHeight() - $(modal).find('.modal-footer').outerHeight() + 20 ;
			$(modal).find('.modal-body').css({
				height: 'auto',
				'max-height': 400 + 'px',
				overflow: 'auto'
			});
			$(modal).find('.modal-content').css({ height: 'auto' });
		} else {
			$(modal).on('show.bs.modal', function () {
				var mw = ($(window).width() - o.w) / 2;
				if (mw < 0) mw = 0;
				$(this).find('.modal-content').css({
					width: o.w + 'px',
					height: 'auto',
					'max-height': maxHeight + 'px',
					overflow: 'auto'
				});
				$(this).find('.modal-dialog').css({
					margin: '30px ' + mw + 'px'
				});
			}).on('shown.bs.modal', function () {
				$(this).find('.modal-body').css({
					'max-height': ($(this).find('.modal-content').height() - $(this).find('.modal-header').outerHeight() - $(this).find('.modal-footer').outerHeight()) + 50+ 'px',
					overflow: 'auto'
				});
			}).on('hidden.bs.modal', function () {
				$(this).removeData();
				$(this).css({
					left: 0,
					top: 0
				})
				$(this).find('.modal-body,.modal-content').removeAttr('style');
				//$(this).find('.modal-content').removeAttr('style')
			});
		}
		return modal;
	}
	/*this.resizeModal = function (modal, ws, hs) {
		var w = 1200;
		if (!ws)
			w = $(window).width() >= w ? w : $(window).width() * .95;
		if (ws === "full")
			w = $(window).width() * .99;
		else
			w = $(window).width() >= ws ? ws : $(window).width() * .95;

		$(modal).on('show.bs.modal', function () {
			var mw = ($(window).width() - w) / 2;
			if (mw < 0) mw = 0;
			$(this).find('.modal-content').css({
				//width: w + 'px', //probably not needed
				height: 'auto', //probably not needed 
				'max-height': ($(window).height()*.9) + 'px'
			});
			
			$(this).find('.modal-dialog').css({
				//margin: '30px ' + mw + 'px'
			});
		}).on('shown.bs.modal', function () {
			$(this).draggable({
				handle: ".modal-header"
			});
			$(this).find('.modal-body').css({
				'max-height': ($(this).find('.modal-content').height() - $(this).find('.modal-header').outerHeight() - $(this).find('.modal-footer').outerHeight()) + 'px',
				overflow: 'auto'});
		}).on('hidden.bs.modal', function () {
			$(this).removeData();
			$(this).css({
				left: 0,
				top: 0
			})
		});
		return modal;
	};*/
	this.ModalObj = function () {
		this.id = "Dynamic-Modal";
		this.bodyid = "Dynamic-Modal-Body";
		this.title = "Info";
		this.icon = "fa-info-circle";
		this.size = "modal-lg";
		this.color = "info";
		this.buttons = [{
			class: "btn-info",
			dismiss: true,
			text: "Close",
			action: function () {
			}
		}];
	};

	this.MakeModal = function (o) {
		if (!o) var o = new obj.ModalObj();
		var mod = this;
		$("#" + o.id).remove();
		this.modal = $('<div class="modal fade" role="dialog"></div>').attr("id", o.id).appendTo("body");
		var dialog = $('<div class="modal-dialog"></div>').addClass(o.size);
		var content = $('<div class="modal-content"></div>');
		var header = $('<div class="modal-header"></div>');
		var title = $('<h4 class="modal-title text-' + o.color + '"> <span class="fa '+o.icon+'" aria-hidden="true"></span>' + o.title + ' </h4>');
		var close = $('<button type="button" class="close text-danger" data-dismiss="modal">&times;</button>');
		this.body = $('<div class="modal-body"></div>').attr("id", o.bodyid);
		this.footer = $('<div class="modal-footer"></div>');
		$(o.buttons).each(function (i, e) {
			$(mod.footer).append(
				$('<button type="button" class="btn">' + this.text + '</button>').addClass(this.class || "btn-" + o.color).attr("data-dismiss",function(){
					if(e.dismiss)return "modal";
					return "";
				}).click(function () { if (typeof e.action === "function") e.action.apply(null)})
			);
		});																											
		mod.modal.append(dialog.append(content.append(header.append(close).append(title)).append(mod.body).append(mod.footer)));
		return this;
	};
})(window, jQuery);





function showDefinitions(title, minh, content)
{
	var o = new modals.ModalObj();
	o.title = title  != "Link to query..." ? 'What is "' + title + '"?' : title;
	o.size = "modal-lg";
	o.bodyid = 'definitions-modal-body';
	o.id = 'definitions-modal';
	var defmod = modals.MakeModal(o).modal;
	$("#definitions-modal-body").html(content);
	new modals.resizeModal(defmod, 900, $(window).height());
	defmod.modal("show");
	//alert($(defmod).height()+"---"+$(window).height() * .85);
	return; 
}
	
function showMessage(type, text, title, callbackshow, callbackhide)
	{
		return modals.showInfoDiv(type,text, title, callbackshow, callbackhide);
		
		
		$( "#dialog:ui-dialog" ).dialog( "destroy" );
		var elem = $('#alertBody').empty().append(txt).css({"padding-top":"30px","height":"100%"});
		//elem.css("background-image","url(images/status_icons/information_64.png)");

		if(type && type == 'warning')
		{
			elem.css({"background-image":"url(images/status_icons/warning_64.png)","background-position": "0px 20px"});
		}
		
		if(!w)w=500;
		if(!h)h=220;
		
		if(!bts)
			bts = {Close: function() {$( this ).dialog( "close" )}};
		/*position:{my:"center top", at:"center top+20%"},
			position:{"center"},*/
		$( "#alert-modal" ).dialog({
			height: h,
			width:w,
			
			modal: true,
			buttons: bts, 
			close:cls
		});
	}
	
	var loadModalContainerIteration;
		
	function loadModalContainer(txt)
	{
		var xmlForm = document.getElementById('txtXMLForm');
		var txtXML = document.getElementById('txtXML');
		
		//var frame = document.getElementById("statusFrame");frameDoc = frame.contentDocument || frame.contentWindow.document; 
		//if(frameDoc.documentElement)frameDoc.removeChild(frameDoc.documentElement);
		
		if(txt.xml)
			txtXML.value = txt.xml;
		else if(window.XMLSerializer)
		{
			var serial = new XMLSerializer();
			txtXML.value = serial.serializeToString (txt);	
		}
		else
			txtXML.value = txt.innerHTML
		
		// this is here to make sure that xml loads the first time the modal container is open. without it it will not display the first time...
		if(!loadModalContainerIteration)
		{
			loadModalContainerIteration = true;
			loadModalContainer(txt);
		}
		
		xmlForm.submit();
		showContainer();
	}
	
	function showContainer()
	{
		$( "#dialog:ui-dialog" ).dialog( "destroy" );
		
		$( "#container-modal" ).dialog({
			height: 400,
			width:600,
			position:'center',
			modal: false,
			buttons: {
				Expand: function() {
					expandCollapseToggle($( this ));
				},
				Close: function() {
					modalState='normal';
					$( this ).dialog( "close" );
				}
			}
		});
	}
	var modalState='normal';
	function expandCollapseToggle(elem)
	{
		var h =document.documentElement.clientHeight - 20;
		var w = document.documentElement.clientWidth - 20;
		var l = (w - 400)/2;
		var t = (h-600)/2;
		if(modalState == 'normal')
		{
			modalState = 'max';
			$( elem ).dialog({
				buttons: {
					Collapse: function() {
						expandCollapseToggle($( this ));
					},
					Close: function() {
						modalState='normal';
						$( this ).dialog( "close" );
					}
				}				
				});
			return $( elem ).dialog( {width:w, height:h,  position:[0,0]} );	
		}
		else
		{
			modalState = 'normal';
			showContainer();
			return $( elem ).dialog( {width:600, height:400,  position:'center'} );
			
		}
	}