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
					that.animatePopUp({
						imgPop: img_Pop,
						x: x,
						y: y,
						animation: popup.animation || 'popUpScaleIn'
					});
        		}
        		img_Pop.src = mjson.img.url + cjson[thisPanel].popups[thisPopup].src;
			},

			animatePopUp: function(options){
					var _imgPop = options.imgPop,
						_x = options.x,
						_y = options.y;
						_totalFrames = options.frames || 10;
						_dur = options.duration || 100;

					var _time2, _dTime,
						_frameIncrement = 1/_totalFrames,
						_int = _dur/_totalFrames,
						_bkgPartial = ctx.getImageData(_x, _y, _imgPop.width, _imgPop.height),
						_frame = 0,
						_time1 = new Date();

					function killInterval(interval) {
						clearInterval(interval);
						_time2 = new Date();	
						_dTime = _time2 - _time1;
						console.log('total frames: ', _frame);
						console.log('total milliseconds: ' + Math.ceil(_dTime));
						console.log('fps: ' + Math.ceil(_frame/(_dTime/1000)));
					}

					switch (options.animation) {
						case 'popUpFadeIn':
							ctx.globalAlpha = 0;
					        var _fadeIn = setInterval(function(){

								var gA = ctx.globalAlpha;
									gA += _frameIncrement;
									gA = gA.toFixed(1);
									gA = parseFloat(gA, 10);
								ctx.globalAlpha = gA;

								ctx.clearRect(_x, _y, _imgPop.width, _imgPop.height);
								ctx.putImageData(_bkgPartial, _x, _y);
								ctx.drawImage(_imgPop, _x, _y);

								_frame++;
								if (ctx.globalAlpha === 1) killInterval(_fadeIn);

						    }, _int);
						    break;
						case 'popUpScaleIn':
						default:

							var _scale = 0;
					        var _scaleIn = setInterval(function(){

								_scale += 10;
								_scalePercent = _scale/100;

								_scaledW = _imgPop.width*_scalePercent,
								_scaledH = _imgPop.height*_scalePercent,
								_dX = _x + ((_imgPop.width - _scaledW)/2),
								_dY = _y + ((_imgPop.height - _scaledH)/2);

								ctx.clearRect(_x, _y, _imgPop.width, _imgPop.height);
								ctx.putImageData(_bkgPartial, _x, _y);
								ctx.drawImage(_imgPop, _dX, _dY, _scaledW, _scaledH);

								_frame++;
								if (_scale === 100) killInterval(_scaleIn);
						    }, _int);
						    break;
				    }
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