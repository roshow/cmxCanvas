/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/
/*global define*/

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
			imgObj_prev = new Image();

		var cmxcanvas = {
			config: {
				transitionSpeed: 700
			},

			//methods for making stuff happen on the canvas
			movePanels: function() {

				var imgObj_target = (direction === 1) ? imgObj_next : imgObj_prev;

				switch (cjson[thisPanel].transition) {

					case 'jumpcut':
						this.goToPanel(thisPanel);
						break;

					//case 'elastic': //case for this transition if it's not default
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
			popUp: function(popup) {

				var that = this
					, x = popup.x || 0
					, y = popup.y || 0;

				var img_Pop = new Image()
				img_Pop.onload = function() {
					that[popup.animation || 'popUpScale'](img_Pop, x, y);
        		}
        		img_Pop.src = mjson.img.url + cjson[thisPanel].popups[thisPopup].src;
			},
			popUpFadeIn: function(img_Pop, x, y){

					var _totalFrames = 10,
						_dur = 100,
						_frameIncrement = 1/_totalFrames,
						_int = _dur/_totalFrames;
							_bkgPartial = ctx.getImageData(x, y, img_Pop.width, img_Pop.height);
							_frame = 0,
							_time1 = new Date();

					ctx.globalAlpha = 0;

			        var _fadeIn = setInterval(function(){
						_frame++;
						
						var gA = ctx.globalAlpha;
							gA += _frameIncrement;
							gA = gA.toFixed(1);
							gA = parseFloat(gA, 10);

						ctx.globalAlpha = gA;

						ctx.clearRect(x, y, img_Pop.width, img_Pop.height);
						ctx.putImageData(_bkgPartial, x, y);
						
						ctx.drawImage(img_Pop, x, y);

						if (ctx.globalAlpha == 1) {
							
							var _time2 = new Date();
							var _dur = _time2 - _time1;
							console.log('total frames: ', _frame);
							console.log('total milliseconds: ' + Math.ceil(_dur));
							console.log('fps: ' + Math.ceil(_frame/(_dur/1000)));

							clearInterval(_fadeIn); 
						}
				    }, _int);
			},
			popUpScale: function(img_Pop, x, y){

					var _totalFrames = 10,
						_dur = 100,
						_frameIncrement = 1/_totalFrames,
						_int = _dur/_totalFrames,
						_bkgPartial = ctx.getImageData(x, y, img_Pop.width, img_Pop.height),
						_frame = 0,
						_time1 = new Date();

					var _scale = 0;

			        var _scaleIn = setInterval(function(){
						
						_frame++;
						_scale = _scale + 10;
						_scalePercent = _scale/100;

						_scaledW = img_Pop.width*_scalePercent,
						_scaledH = img_Pop.height*_scalePercent,
						_dX = x + ((img_Pop.width - _scaledW)/2),
						_dY = y + ((img_Pop.height - _scaledH)/2);

						ctx.clearRect(x, y, img_Pop.width, img_Pop.height);
						ctx.putImageData(_bkgPartial, x, y);

						ctx.drawImage(
							img_Pop,
							_dX,
							_dY,
							_scaledW,
							_scaledH
						);

						if (_scale == 100) {
							var _time2 = new Date();
							var _dur = _time2 - _time1;
							console.log('total frames: ', _frame);
							console.log('total milliseconds: ' + Math.ceil(_dur));
							console.log('fps: ' + Math.ceil(_frame/(_dur/1000)));

							clearInterval(_scaleIn); 
						}
				    }, _int);
			},

			//methods for navigating pages
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
			goToPanel: function(panel) {
				thisPanel = panel;
				thisPopup = 0;
				imgObj.src = mjson.img.url + cjson[thisPanel].src;
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
			//console.log('next & prev loaded');
		};

		var init = function(data, canvasId) {
			cnv = document.getElementById(canvasId);
			ctx = cnv.getContext('2d');
			mjson = data;
			cjson = data.cmxJSON;
			thisPanel = 0;
			imgObj.src = mjson.img.url + cjson[thisPanel].src;
			return cmxcanvas;
		};

		return init;
	}());

	return CmxCanvas;
});