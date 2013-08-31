//cmxCanvas.js
//by Rolando Garcia, roshow.net

/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/

var cmxCanvas = (function(){

	var i, canvasId, ctx, comicJSON, imgObj_x, imgObj_y, imgObj_next_x, imgObj_next_y;
	var currentPanel = 0;
	var currentPopup = 0;
	var direction = 1;
	var imgObj = new Image();
	var imgObj_next = new Image();

	var cmxCanvasObj = {
		config: {
			transitionSpeed: null
		},
		movePanels: function() {

			var that = this;

			imgObj_x = (canvasId.width - imgObj.width) / 2;
			imgObj_y = (canvasId.height - imgObj.height) / 2;
			imgObj_next_x = (canvasId.width - imgObj_next.width) / 2;
			imgObj_next_y = (canvasId.height - imgObj_next.height) / 2;

			ctx.drawImage(imgObj_next, imgObj_next_x + (direction * canvasId.width), imgObj_next_y);

			jsAnimate({
				target: [imgObj, imgObj_next],
				from: [
	            {
					x: imgObj_x,
					y: imgObj_y
				},
	               {
					x: imgObj_next_x + (direction * canvasId.width),
					y: imgObj_next_y
				}
	            ],
				to: [
	            {
					x: imgObj_x - (direction * canvasId.width),
					y: imgObj_y
				},
	               {
					x: imgObj_next_x,
					y: imgObj_next_y
				}
	            ],
				canvas: canvasId,
				ctx: ctx,
				duration: that.config.transitionSpeed || 500,
				aInt: 20,
				friction: 0,
				aFunction: makeEaseOut(back),
				onComplete: function() {
					imgObj.src = comicJSON[currentPanel].src;
				}
			});
		},
		selectPanel: function(panel) {
			currentPanel = panel;
			currentPopup = 0;
			imgObj.src = comicJSON[currentPanel].src;
		},
		popUp: function(popup) {
			var x = popup.x || 0;
			var y = popup.y || 0;
			var img_Pop = new Image();
			img_Pop.onload = function(){
				ctx.drawImage(img_Pop, x, y);
			};
			img_Pop.src = popup.src;
		},
		goToNext: function() {
			if (currentPanel <= comicJSON.length - 1) {
				var popups = comicJSON[currentPanel].popups || null;
				if (popups && currentPopup < popups.length) {
					switch(popups[currentPopup].type) {
						case "popup":
							this.popUp(popups[currentPopup]);
							currentPopup += 1;
							break;
					}
				}
				else if (currentPanel !== comicJSON.length - 1) {
					currentPanel = currentPanel + 1;
					currentPopup = 0;
					direction = 1;
					imgObj_next.src = comicJSON[currentPanel].src;
				}
			}
			return currentPanel;
		},
		goToPrev: function() {
			if (currentPanel > 0) {
				currentPanel = currentPanel - 1;
				direction = -1;
				currentPopup = 0;
				switch (comicJSON[currentPanel].type){
					case "panel":
						imgObj_next.src = comicJSON[currentPanel].src;
						break;	
					default:
						this.goToPrev();
						break;	
				}
			}
			return currentPanel;
		},
		loadFromURL: function(comicURI, func){
			var that = this;
			$.getJSON(comicURI, function(data){
				comicJSON = data.comic;
				currentPanel = 0;
				imgObj.src = data.comic[currentPanel].src;
				if(func){
					func(data);
				}
			});
		}
	};

	imgObj.onload = function() {
		ctx.clearRect(0, 0, canvasId.width, canvasId.height);
		ctx.drawImage(imgObj, (canvasId.width - imgObj.width) / 2, (canvasId.height - imgObj.height) / 2);
	};
	imgObj_next.onload = function() {
		cmxCanvasObj.movePanels();
	};

	$(function(){
		canvasId = document.getElementById("cmxCanvas");
		ctx = canvasId.getContext("2d");
	}); 

	return cmxCanvasObj;
}());

$(function() {
	var panel, i;
	cmxCanvas.config.transitionSpeed = 700;
	function selectTOCBtn(panel){
		$(".toc_btn").css("background-color", "black");
		$(".toc_btn").css("color", "white");
		$("#toc_btn_" + panel).css("background-color", "#bbbbbb");
		$("#toc_btn_" + panel).css("color", "black");
	}
	function loadTOCCredits(comicJSON) {
		var L = comicJSON.comic.length;
		$("#toc").empty();
		for (i = 0; i < L; i++) {
			var pg = (i < 9) ? "0" + ( i + 1 ) : ( i + 1 );
			if (comicJSON.comic[i].type === "panel"){
				var innerhtml = "<li id='toc_btn_" + i + "'class='toc_btn'>" + pg + "</li>";
				$("#toc").append(innerhtml);
			}
			if (i === 0){
				$(".toc_btn").css("background-color", "#bbbbbb");
				$(".toc_btn").css("color", "black");
			}
		}
		$(".toc_btn").click(function() {
			cmxCanvas.selectPanel($(this).text()-1);
			$(".toc_btn").css("background-color", "black");
			$(".toc_btn").css("color", "white");
			$(this).css("background-color", "#bbbbbb");
			$(this).css("color", "black");
		});
		$("#creditblock").empty();
		if(comicJSON.credit){
			$("#creditblock").append(comicJSON.credit);
		}
		$("#info").hide();
		
		//reset #info_btn
		$("#info_btn").empty();
		$("#info_btn").append("more info");
		$("#info_btn").css("background-color", "black");
		$("#info_btn").css("color", "white");
	}

	cmxCanvas.loadFromURL("sovereign01/sovereign01.json", loadTOCCredits);

	$("#leftarrow").click(function(){ 
		panel = cmxCanvas.goToPrev();
		selectTOCBtn(panel);
	});
	$("#rightarrow").click(function(){ 
		panel = cmxCanvas.goToNext();
		selectTOCBtn(panel);
	});
});

	/*questionable

	$("#comic_btn_sovereign01").css("background-color", "#bbbbbb");
	$("#comic_btn_sovereign01").css("color", "black");
	
	$("#comic_btn_sovereign01").click(function(){ 
		cmxCanvas.loadFromURL("sovereign01/sovereign01.json", loadTOCCredits);
		console.log($(this)[0].id);
	});	
	$("#comic_btn_revengerOrigin").click(function(){ 
		cmxCanvas.loadFromURL("revenger_origin/revenger_origin.json", loadTOCCredits);
		console.log($(this)[0].id);
	});	
	$("#comic_btn_superboy").click(function(){ 
		cmxCanvas.loadFromURL("superboy/superboy.json", loadTOCCredits);
		console.log($(this)[0].id);
	});
	$("#nav_top > ul > li").click(function() {
		$("#nav_top > ul > li").css("background-color", "black");
		$("#nav_top > ul > li").css("color", "white");
		$(this).css("background-color", "#bbbbbb");
		$(this).css("color", "black");
	});

	$("#centertap").click(function(){
		$(".nav").slideToggle();
	});

	$("#rightarrow").mouseenter(function() {
		$(this).css("border-left-color", "#dddddd");
	});
	$("#rightarrow").mouseleave(function() {
		$(this).css("border-left-color", "#373A3E");
	});
	$("#leftarrow").mouseenter(function() {
		$(this).css("border-right-color", "#dddddd");
	});
	$("#leftarrow").mouseleave(function() {
		$(this).css("border-right-color", "#373A3E");
	});
	$("#info_btn").click(function(){
		$("#info").slideToggle(300, function(){
			$("html, body").animate({ scrollTop: $(document).height() - window.innerHeight });
		});
		if ($(this)[0].textContent.substring(0,4) === "more") {
			$(this).empty();
			$(this).append("less info");
			$(this).css("background-color", "#bbbbbb");
			$(this).css("color", "black");
		}
		else {
			$(this).empty();
			$(this).append("more info");
			$(this).css("background-color", "black");
			$(this).css("color", "white");
		}
	});*/
