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
			imgObj_next = new Image();

		function _imgurl() {
			var u = mjson.img && mjson.img.url ? mjson.img.url + cjson[thisPanel].src : cjson[thisPanel].src;
			return u;
		}

		function _popUrl() {
			var u = cjson[thisPanel].popups[thisPopup].src;
			u = mjson.img && mjson.img.url ? mjson.img.url + u : u;
			return u;
		}

		var cmxcanvas = {
			config: {
				transitionSpeed: 700
			},
			movePanels: function() {

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
							imgObj_next_x = halfDiff(cnv.width, imgObj_next.width),
							imgObj_next_y = halfDiff(cnv.height, imgObj_next.height);

						ctx.drawImage(imgObj_next, imgObj_next_x + (direction * cnv.width), imgObj_next_y);

						jsAnimate.animation({
							target: [imgObj, imgObj_next],
							from: [
			                {
								x: imgObj_x,
								y: imgObj_y
							},
			                   {
								x: imgObj_next_x + (direction * cnv.width),
								y: imgObj_next_y
							}
			                ],
							to: [
			                {
								x: imgObj_x - (direction * cnv.width),
								y: imgObj_y
							},
			                   {
								x: imgObj_next_x,
								y: imgObj_next_y
							}
			                ],
							canvas: cnv,
							ctx: ctx,
							duration: that.config.transitionSpeed || 500,
							aInt: 20,
							friction: 0,
							aFunction: jsAnimate.makeEaseOut(jsAnimate.back),
							onComplete: function() {
								imgObj.src = _imgurl();
								animating = false;
							}
						});
						break;
				}
			},
			goToPanel: function(panel) {
				thisPanel = panel;
				thisPopup = 0;
				imgObj.src = _imgurl();
			},
			popUp: function(popup) {
				var x = popup.x || 0;
				var y = popup.y || 0;
				var img_Pop = new Image();
				img_Pop.onload = function() {
					ctx.drawImage(img_Pop, x, y);
				};
				img_Pop.src = _popUrl(popup.src);
			},
			goToNext: function(cb) {
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
						imgObj_next.src = _imgurl();
					}
				}
				return thisPanel;
			},
			goToPrev: function() {
				if (thisPanel > 0 && !animating) {
					thisPanel = thisPanel - 1;
					direction = -1;
					thisPopup = 0;
					switch (cjson[thisPanel].type) {
						case 'panel':
							imgObj_next.src = _imgurl();
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
					imgObj.src = _imgurl();
					if (cb) {
						cb(data);
					}
				});
			}
		};

		imgObj.onload = function() {
			ctx.clearRect(0, 0, cnv.width, cnv.height);
			ctx.drawImage(imgObj, halfDiff(cnv.width, imgObj.width), halfDiff(cnv.height, imgObj.height));
		};
		imgObj_next.onload = function() {
			cmxcanvas.movePanels();
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