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
			imgObj_prev = new Image(),
			img_Pop = new Image();

		imgObj.crossOrigin = "Anonymous";
		imgObj_next.crossOrigin = "Anonymous";
		imgObj_prev.crossOrigin = "Anonymous";
		img_Pop.crossOrigin = "Anonymous";

		var cmxcanvas = {
			config: {
				transitionSpeed: 100
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

						//ctx.drawImage(imgObj_target, imgObj_target_x + (direction * cnv.width), imgObj_target_y);

						jsAnimate.animation({
							target: [imgObj, imgObj_target],
							names: [cjson[thisPanel - (1 * direction)].src, cjson[thisPanel].src],
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
							duration: 200,
							interval: 10,
							friction: 100,
							aFunction: jsAnimate.makeEaseOut(jsAnimate.quad),
							onComplete: function() {
								//console.log("onComplete: " + mjson.img.url + cjson[thisPanel].src);
								imgObj.src = mjson.img.url + cjson[thisPanel].src;
								animating = false;
							}
						});
						break;
				}
			},
			popUp: function(popup) {
				var that = this;
				img_Pop.onload = function() {
					that.animatePopUp({
						img: img_Pop,
						x: popup.x || 0,
						y: popup.y || 0,
						animation: popup.animation || 'scaleIn'
					});
        		}
        		img_Pop.src = mjson.img.url + popup.src;
			},

			animatePopUp: function(popup){
				popup.dur = popup.dur || 100;
				popup.totalFrames = popup.totalFrames || 10;
				var _int = popup.dur/popup.totalFrames,
					_bkgPartial = ctx.getImageData(popup.x, popup.y, popup.img.width, popup.img.height),
					_frame = 0;
					
				var _time1 = new Date();
				function killInterval(interval) {
					clearInterval(interval);
					var _time2 = new Date();	
					var _dTime = _time2 - _time1;
					/*console.log('total frames: ', _frame);
					console.log('total milliseconds: ' + Math.ceil(_dTime));
					console.log('fps: ' + Math.ceil(_frame/(_dTime/1000)));*/
				}

				switch (popup.animation) {
					case 'fadeIn':
						ctx.globalAlpha = 0;
				        var _fadeIn = setInterval(function(){

							//increase globalAlpha by 1 / total frames and make it into a normal fraction
							var ga = ctx.globalAlpha + 1/popup.totalFrames;
							ctx.globalAlpha = parseFloat(ga.toFixed(1), 10);

							ctx.clearRect(popup.x, popup.y, popup.img.width, popup.img.height);
							ctx.putImageData(_bkgPartial, popup.x, popup.y);
							ctx.drawImage(popup.img, popup.x, popup.y);

							_frame++;
							if (ctx.globalAlpha === 1) killInterval(_fadeIn);

					    }, _int);
					    break;

					case 'scaleIn':
					default:
						var _scale = 0;
				        var _scaleIn = setInterval(function(){
							
							_scale += 10;
							
							var _scaledW = popup.img.width*(_scale/100),
							_scaledH = popup.img.height*(_scale/100),
							_dX = popup.x + ((popup.img.width - _scaledW)/2),
							_dY = popup.y + ((popup.img.height - _scaledH)/2);

							ctx.clearRect(popup.x, popup.y, popup.img.width, popup.img.height);
							ctx.putImageData(_bkgPartial, popup.x, popup.y);
							ctx.drawImage(popup.img, _dX, _dY, _scaledW, _scaledH);

							_frame++;
							if (_scale === 100) killInterval(_scaleIn);
					    }, _int);
					    break;
			    }
			},

			//methods for navigating pages
			goToNext: function(cb) {
				var that = this;
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
						that.movePanels();
					}
				}
				return thisPanel;
			},
			goToPrev: function() {
				var that = this;
				if (thisPanel > 0 && !animating) {
					thisPanel = thisPanel - 1;
					direction = -1;
					thisPopup = 0;
					switch (cjson[thisPanel].type) {
						case 'panel':
							that.movePanels();
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
			//console.log("imgObj.onload:\nx: " + halfDiff(cnv.width, this.width) + ", y: " + halfDiff(cnv.height, this.height));
			ctx.drawImage(this, halfDiff(cnv.width, this.width), halfDiff(cnv.height, this.height));
			if (thisPanel > 0) {
				imgObj_prev.src = mjson.img.url + cjson[thisPanel - 1].src;
			}
			if (thisPanel < cjson.length-1) {
				imgObj_next.src = mjson.img.url + cjson[thisPanel + 1].src;
			}
		};
		imgObj_next.onload = function() {
			//console.log("imgObj_next.onload:\nx: " + (halfDiff(cnv.width, this.width) + cnv.width) + ", y: " + halfDiff(cnv.height, this.height));
			ctx.drawImage(this, halfDiff(cnv.width, this.width) + cnv.width, halfDiff(cnv.height, this.height));
		};
		imgObj_prev.onload = function() {
			//console.log("imgObj_prev.onload:\nx: " + (halfDiff(cnv.width, this.width) - cnv.width) + ", y: " + halfDiff(cnv.height, this.height));
			ctx.drawImage(this, halfDiff(cnv.width, this.width) - cnv.width, halfDiff(cnv.height, this.height));
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