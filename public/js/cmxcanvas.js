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
	
	cmxCanvas.loadFromURL("sovereign01/sovereign01.json");
	
	$("#leftarrow").click(function(){ 
		panel = cmxCanvas.goToPrev();
	});
	$("#rightarrow").click(function(){ 
		panel = cmxCanvas.goToNext();
	});
});