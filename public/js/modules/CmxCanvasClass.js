/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/

define(['modules/jsAnimate'], function(jsAnimate){
	var CmxCanvas = (function() {

		// Begin Helpers
		function halfDiff(a, b) {
			return (a - b)/2;
		}
		//End Helpers

		var i, cnv, ctx, cjson, mjson,
			animating = false,
			thisPanel = 0,
			thisPopup = 0,
			direction = 1,
			imgObj = new Image(),
			imgObj_next = new Image(),
			imgObj_prev = new Image();;

		var cmxcanvas = {
			config: {
				transitionSpeed: 700
			},
			movePanels: function() {

				var imgObj_target = (direction === 1) ? imgObj_next : imgObj_prev;

				switch (cjson[thisPanel].transition) {

					case 'jumpcut':
						this.goToPanel(thisPanel);
						break;

					case 'elastic':
					default:
						animating = true;
						var that = this,
							imgObj_x = halfDiff(cnv.width, imgObj.width),
							imgObj_y = halfDiff(cnv.height, imgObj.height),
							imgObj_target_x = halfDiff(cnv.width, imgObj_target.width),
							imgObj_target_y = halfDiff(cnv.height, imgObj_target.height);

						ctx.drawImage(imgObj_target, imgObj_target_x + (direction * cnv.width), imgObj_target_y);

						jsAnimate.animation({
							target: [imgObj, imgObj_target],
							from: [
			                {
								x: imgObj_x,
								y: imgObj_y
							},
			                   {
								x: imgObj_target_x + (direction * cnv.width),
								y: imgObj_target_y
							}
			                ],
							to: [
			                {
								x: imgObj_x - (direction * cnv.width),
								y: imgObj_y
							},
			                   {
								x: imgObj_target_x,
								y: imgObj_target_y
							}
			                ],
							canvas: cnv,
							ctx: ctx,
							duration: that.config.transitionSpeed || 500,
							aInt: 20,
							friction: 0,
							aFunction: jsAnimate.makeEaseOut(jsAnimate.back),
							onComplete: function() {
								imgObj.src = mjson.img.url + cjson[thisPanel].src;
								if (thisPanel > 0) {
									imgObj_prev.src = mjson.img.url + cjson[thisPanel - 1].src;
								}
								if (thisPanel < cjson.length-1) {
									imgObj_next.src = mjson.img.url + cjson[thisPanel + 1].src;
								}
								animating = false;
							}
						});
						break;
				}
			},
			goToPanel: function(panel) {
				thisPanel = panel;
				thisPopup = 0;
				imgObj.src = mjson.img.url + cjson[thisPanel].src;
			},
			popUp: function(popup) {
				var x = popup.x || 0;
				var y = popup.y || 0;
				var img_Pop = new Image();
				img_Pop.onload = function() {
					ctx.drawImage(img_Pop, x, y);
				};
				img_Pop.src = mjson.img.url + cjson[thisPanel].popups[thisPopup].src;
			},
			goToNext: function(cb) {

				var _this = this;
				if (thisPanel <= cjson.length - 1 && !animating) {
					var popups = cjson[thisPanel].popups || null;
					if (popups && thisPopup < popups.length) {
						switch (popups[thisPopup].type) {
							case 'popup':
								this.popUp(popups[thisPopup]);
								thisPopup += 1;
								break;
						}
					}
					else if (thisPanel !== cjson.length - 1) {
						thisPanel = thisPanel + 1;
						thisPopup = 0;
						direction = 1;
						//imgObj_next.src = mjson.img.url + cjson[thisPanel].src;
						_this.movePanels();
					}
				}
				return thisPanel;
			},
			goToPrev: function() {
				var _this = this;
				if (thisPanel > 0 && !animating) {
					thisPanel = thisPanel - 1;
					direction = -1;
					thisPopup = 0;
					switch (cjson[thisPanel].type) {
						case 'panel':
							_this.movePanels();
							//imgObj_next.src = mjson.img.url + cjson[thisPanel].src;
							break;
						default:
							this.goToPrev();
							break;
					}
				}
				return thisPanel;
			},
			loadFromURL: function(comicURI, cb) {
				var that = this;
				$.getJSON(comicURI, function(data) {
					mjson = data;
					cjson = data.comic;
					thisPanel = 0;
					imgObj.src = mjson.img.url + cjson[thisPanel].src;
					if (cb) {
						cb(data);
					}
				});
			}
		};

		imgObj.onload = function() {
			ctx.clearRect(0, 0, cnv.width, cnv.height);
			ctx.drawImage(imgObj, halfDiff(cnv.width, imgObj.width), halfDiff(cnv.height, imgObj.height));
			if (thisPanel > 0) {
				imgObj_prev.src = mjson.img.url + cjson[thisPanel - 1].src;
			}
			if (thisPanel < cjson.length-1) {
				imgObj_next.src = mjson.img.url + cjson[thisPanel + 1].src;
			}
		};
		imgObj_next.onload = function() {
			console.log('next & prev loaded');
		};

		function init(canvasId, config) {
			cnv = document.getElementById(canvasId);
			ctx = cnv.getContext('2d');
			for (key in config) {
				cmxcanvas.config[key] = config[key];
			}
			return cmxcanvas;
		};

		return init;
	}());

	return CmxCanvas;
});