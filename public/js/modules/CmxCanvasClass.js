/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/
/*global define*/

define(['modules/jsAnimate', 'modules/PanelCounter'], function(jsAnimate, CountManager){

	var CmxCanvas = (function() {

		// START Helpers
		function halfDiff(a, b) {
			return (a - b)/2;
		}

		var loadingFlag = (function(){
			var flag = 0;
			var lflag = {
				add: function(x){
					flag++;
				},
				remove: function(x){
					flag--;
				},
				hasFlag: function(){
					return (flag === 0) ? false: true;
				}
			};
			return lflag
		}());
		//END Helpers

		var i, cnv, ctx, cjson, mjson, panelCounter, popupCounter,
			_animating = false,
			imgObj = new Image(),
			imgObj_next = new Image(),
			imgObj_prev = new Image(),
			img_Pop = new Image();

		// Deal with cross origin nonsense
		imgObj.crossOrigin = "Anonymous";
		imgObj_next.crossOrigin = "Anonymous";
		imgObj_prev.crossOrigin = "Anonymous";
		img_Pop.crossOrigin = "Anonymous";

		var TESTARRAY = [];

		// The Main Event
		var cmxcanvas = {

			// START: methods for making stuff happen on the canvas
			movePanels: function(imgObj_target, direction) {
				switch (cjson[panelCounter.curr].transition) {

					case 'jumpcut':
						this.goToPanel(panelCounter.curr);
						break;

					//case 'elastic': //case for this transition if it's not default
					default:
						_animating = true;
						var that = this,
							imgObj_x = halfDiff(cnv.width, imgObj.width),
							imgObj_y = halfDiff(cnv.height, imgObj.height),
							imgObj_target_x = halfDiff(cnv.width, imgObj_target.width),
							imgObj_target_y = halfDiff(cnv.height, imgObj_target.height);

						jsAnimate.animation({
							target: [imgObj, imgObj_target],
							names: [cjson[panelCounter.curr - (1 * direction)].src, cjson[panelCounter.curr].src],
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
							duration: 400,
							interval: 25,
							friction: 1,
							aFunction: jsAnimate.makeEaseOut(jsAnimate.back),
							onComplete: function() {
								imgObj.src = mjson.img.url + cjson[panelCounter.curr].src;
								_animating = false;
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
					loadingFlag.remove();
        		}
        		console.log(popup);
        		img_Pop.src = mjson.img.url + popup.src;
        		loadingFlag.add();
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

			// These are really the only methods that should be public:
			goToNext: function() {
				var that = this;
				if (!_animating && !loadingFlag.hasFlag()) {
					//check for popups and load those first
					var popups = cjson[panelCounter.curr].popups || null;
					/*if (popupCounter.curr !== false) {
						if (!popupCounter.isLast) {
							this.popUp(popups[popupCounter.curr]);
							popupCounter.getNext();
							console.log(popupCounter);
						}
						else {
							this.popUp(popups[popupCounter.curr]);
							popupCounter.curr = false;
							console.log(popupCounter);
						}
					}*/
					if (!popupCounter.isLast) {
						popupCounter.getNext();
						this.popUp(popups[popupCounter.curr]);
					}
					//otherwise, load the next panel
					else if (!panelCounter.isLast) {
						panelCounter.getNext();
						//var popupCounter = new CountManager(cjson[panelCounter.curr].popups);
						//console.log(popupCounter);
						popupCounter = new CountManager(cjson[panelCounter.curr].popups, -1);
						that.movePanels(imgObj_next, 1);
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPrev: function() {
				var that = this;
				if (!_animating && !loadingFlag.hasFlag()) {
					if (!panelCounter.isFirst){
						panelCounter.getPrev();
						popupCounter = new CountManager(cjson[panelCounter.curr].popups, -1);
						that.movePanels(imgObj_prev, - 1);
					}
					else {
						this.goToPanel(0);
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPanel: function(panel) {
				panelCounter.goTo(panel);
				popupCounter = new CountManager(cjson[panelCounter.curr].popups, -1);
				imgObj.src = mjson.img.url + cjson[panelCounter.curr].src;
			}
		};
		imgObj_next.onload = function() {
			ctx.drawImage(this, halfDiff(cnv.width, this.width) + cnv.width, halfDiff(cnv.height, this.height));
			loadingFlag.remove("imgObj_next " + imgObj_next.src);
		};
		imgObj_prev.onload = function() {
			ctx.drawImage(this, halfDiff(cnv.width, this.width) - cnv.width, halfDiff(cnv.height, this.height));
			loadingFlag.remove("imgObj_prev " + imgObj_prev.src);
		};
		imgObj.onload = function() {
			ctx.clearRect(0, 0, cnv.width, cnv.height);
			ctx.drawImage(this, halfDiff(cnv.width, this.width), halfDiff(cnv.height, this.height));
			if (!panelCounter.isLast) {
				if (imgObj_next.src !== mjson.img.url + cjson[panelCounter.next].src) loadingFlag.add("imgObj_next " + imgObj_prev.src);
				imgObj_next.src = mjson.img.url + cjson[panelCounter.next].src;
			}
			if (!panelCounter.isFirst) {
				if (imgObj_prev.src !== mjson.img.url + cjson[panelCounter.prev].src) loadingFlag.add("imgObj_prev " + imgObj_prev.src);
				imgObj_prev.src = mjson.img.url + cjson[panelCounter.prev].src;
			}
			//loadingFlag.remove("imgObj " + imgObj.src);
		};

		var init = function(data, canvasId) {
			console.log('initalize this data:');
			console.log(data);
			cnv = document.getElementById(canvasId);
			ctx = cnv.getContext('2d');
			mjson = data;
			cjson = data.cmxJSON;
			var L = cjson.length;
			var cmxSequence = [];
			var totes = L;
			for(i = 0; i < L; i++ ){
				var _L = cjson[i].popups ? cjson[i].popups.length : 0;
					for (j=0; j <= _L; j++) {
						cmxSequence.push([i, j-1]);
					}
			}
			panelCounter = new CountManager(cjson);
			popupCounter = new CountManager(cjson[0].popups, -1);
			imgObj.src = mjson.img.url + cjson[panelCounter.curr].src;
			//loadingFlag.add("imgObj init " + imgObj.src);
			return cmxcanvas;
		};

		return init;
	}());

	return CmxCanvas;
});