/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/
/*global define*/

define(['jquery', 'modules/jsAnimate', 'modules/PanelCounter', 'modules/imageAsData', 'ImagePreloader'], function($, Animate, CountManager, ImageAsData, ImagePreloader){

	function halfDiff(a, b) {
		return (a - b)/2;
	}

	var CmxCanvas = (function() {
		
		var i, cnv, ctx, cmxJSON, panelCounter, popupCounter,
			_animating = false;

		var _loading = 0,
			_imagesPanelsLoaded = {},
			panelImgLoader = new ImagePreloader(),
			popupImgLoader = new ImagePreloader();

		panelImgLoader.onLoadStart = function() {
			this.start = new Date().getTime();
			++_loading;
		};
		panelImgLoader.onLoadDone = function() {
			this.end = new Date().getTime();
			//console.log('panels loaded in: ' + (this.end - this.start));
            var res = panelImgLoader.loadedImages;
            var key;
            for (key in res) {
            	_imagesPanelsLoaded[key] = res[key];
            }
            panelImgLoader.loadedImages = {};
            --_loading;
        };
        popupImgLoader.onLoadStart = function() {
			this.start = new Date().getTime();
			++_loading;
		};
		popupImgLoader.onLoadDone = function() {
			this.end = new Date().getTime();
			//console.log('popups loaded in: ' + (this.end - this.start));
			--_loading;
		};
        function writePanelImageLoaderData(x) {
        	var imgd = {};
            //@ x = direction and that's important for the math.
        	if (x && _imagesPanelsLoaded[0]) {
        		for(i = -2*x; Math.abs(i) < 3; i+=x) {
                    if (i === 2*x || !_imagesPanelsLoaded[i + x]) {
                         _imagesPanelsLoaded[i] = null;
                         if(panelCounter.curr + i >= 0 && panelCounter.curr + i < panelCounter.last) {
                             imgd[i] = { src: cmxJSON[panelCounter.curr + i].src };
                         }
                    }
                    else {
                     _imagesPanelsLoaded[i] =  _imagesPanelsLoaded[i + x];
                    }
                }
            } 
            //@ no direction? no problem. Load it and its buffer images.
        	else {
				if (!panelCounter.isLast) {
					imgd[1] = { src: cmxJSON[panelCounter.next].src };
					if (panelCounter.next + 1 < panelCounter.last) { imgd[2] = { src: cmxJSON[panelCounter.next + 1].src }; }
				}
				if (!panelCounter.isFirst) {
					imgd[-1] = { src: cmxJSON[panelCounter.prev].src };
					if (panelCounter.prev - 1 >= 0) { imgd[-2] = { src: cmxJSON[panelCounter.prev - 1].src }; }
				}
			}
        	imgd[0] = {
    			src: cmxJSON[panelCounter.curr].src,
    			callback: function(imgObj) {
    				ctx.clearRect(0, 0, cnv.width, cnv.height);
					ctx.drawImage(imgObj, halfDiff(cnv.width, imgObj.width), halfDiff(cnv.height, imgObj.height));
    			},
    			cbPriority: true
    		};

    		return imgd;
        }
        function loadPanelAndPopupImages(x) {
        	if (popupCounter.curr) {
        		var _popups = panelCounter.getData().popups;
        		var _next = panelCounter.getData(1);
        		var _prev = panelCounter.getData(-1);
        		_popups = _next && _next.popups ? _popups.concat(_next && _next.popups) : _popups;
        		_popups = _prev && _prev.popups ? _popups.concat(_prev && _prev.popups) : _popups;
        		popupImgLoader.load(panelCounter.getData().popups, true);
        	}
        	panelImgLoader.load(writePanelImageLoaderData(x), true);
        }

		//@ The Main Event
		var cmxcanvas = {

			//@ START: methods for making stuff happen on the canvas
			movePanels: function(data) {
				switch (data.transition) {
					case 'jumpcut':
                       /* panelCounter.loadNext();
						this.goToPanel(panelCounter.curr);*/
                        this.goToPanel(data.curr);
						break;
					//case 'elastic': //@ case for this transition if it's not default
					default:
						_animating = true;
						Animate.panels(data.imgObj, data.imgObj_target, cnv, ctx, data.direction, function(){
                			_animating = false;
						});
						break;
				}
			},
			popUp: function(popup) {
				_animating = true;
				Animate.popup({
					img: popupImgLoader.loadedImages[popupCounter.curr],
					x: popup.x || 0,
					y: popup.y || 0,
					animation: popup.animation || 'scaleIn'
				}, cnv, ctx);
				_animating = false;
			},

			//@ These are really the only methods that should be public:
			goToNext: function() {
				if (!_animating && !_loading) {
					if (!popupCounter.isLast) {
						popupCounter.loadNext();
						this.popUp(popupCounter.data[popupCounter.curr]);
					}
					else if (!panelCounter.isLast) {
						
                        panelCounter.loadNext();
	
                        
                        var D = 1;
						this.movePanels({
                            imgObj: _imagesPanelsLoaded[-1], 
                            imgObj_target: _imagesPanelsLoaded[0],
                            direction: D,
                            transition: cmxJSON[panelCounter.curr].transition,
                            curr: panelCounter.curr
                        });
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPrev: function() {
				if (!_animating && !_loading) {				
					if (!panelCounter.isFirst){
						
                        panelCounter.loadPrev();
	
                        
                        var D = -1;
                        this.movePanels({
                            imgObj: _imagesPanelsLoaded[1], 
                            imgObj_target: _imagesPanelsLoaded[0],
                            direction: D,
                            transition: cmxJSON[panelCounter.curr].transition,
                            curr: cmxJSON[panelCounter.curr].transition
                        });
                    }
					else {
						this.goToPanel(0);
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPanel: function(panel) {
				
                panelCounter.goTo(panel);
			}
		};

		function bulkPreload(Json, logtime) {
			logtime = false;
			Json = Json.cmxJSON;
			var bigLoad = new ImagePreloader();
			bigLoad.onLoadStart = function(){
				if (logtime) { console.log('loading every image'); }
				this.start = new Date().getTime();
			};
			bigLoad.onLoadDone = function(){
				if (logtime) { this.end = new Date().getTime(); }
				if (logtime) { console.log('duration for every damn image load: ' + (this.end - this.start)); }
				delete bigLoad.loadedImages;
			};
			var L = Json.length;
			var _popupArr = [];
            var i;
			for (i = 0; i < L; i++) {
				_popupArr = Json[i].popups ? _popupArr.concat(Json[i].popups) : _popupArr;
			}
			if (logtime) { console.log("Total no. of images: " + (Json.length + _popupArr.length)); }
			bigLoad.load(Json.concat(_popupArr), true);
		}

		return function(data, canvasId) {
			//@ Get Canvases and Contexts
			cnv = document.getElementById(canvasId);
			ctx = cnv.getContext('2d');
			cmxJSON = data.cmxJSON;

			panelCounter = new CountManager(cmxJSON);
            panelCounter.onchange = function(i){
                popupCounter = new CountManager(cmxJSON[panelCounter.curr].popups, -1);
                loadPanelAndPopupImages(i || false);
            };
            panelCounter.onchange();
			
			//bulkPreload(data);
			return cmxcanvas;
		};
	}());

	return CmxCanvas;
});