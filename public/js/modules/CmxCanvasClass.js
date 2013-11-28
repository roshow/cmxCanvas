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
			_imagesPanelsLoaded = {
                loading: (function(){
                    var img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = "http://roshow.net/public/images/cmxcanvas/sov01/loading.jpg"
                    return img;
                }())
            },
			panelImgLoader = new ImagePreloader(),
			popupImgLoader = new ImagePreloader();

		panelImgLoader.onLoadStart = function() {
			this.start = new Date().getTime();
			++_loading;
		};
		panelImgLoader.onLoadDone = function() {
            var res = panelImgLoader.loadedImages;
            var key;
            for (key in res) {
            	_imagesPanelsLoaded[key] = res[key];
            }
            console.log(_imagesPanelsLoaded);
            delete panelImgLoader.loadedImages;
            panelImgLoader.loadedImages = {};
            --_loading;
            this.end = new Date().getTime();
            //console.log('panels loaded in: ' + (this.end - this.start));
        };
        popupImgLoader.onLoadStart = function() {
			this.start = new Date().getTime();
			++_loading;
		};
		popupImgLoader.onLoadDone = function() {
			--_loading;
            this.end = new Date().getTime();
            //console.log('popups loaded in: ' + (this.end - this.start));
		};
        function loadpanelImgLoader(x) {
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
            //@ Image 0 always gets reset for that callback. Have to change this, someday.
        	imgd[0] = {
    			src: cmxJSON[panelCounter.curr].src,
    			callback: function(imgObj) {
    				ctx.clearRect(0, 0, cnv.width, cnv.height);
					ctx.drawImage(imgObj, halfDiff(cnv.width, imgObj.width), halfDiff(cnv.height, imgObj.height));
    			},
    			cbPriority: true
    		};

            panelImgLoader.load(imgd, true);
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
            loadpanelImgLoader(x);
        }

		//@ The Main Event
		var cmxcanvas = {

			//@ START: methods for making stuff happen on the canvas
			movePanels: function(data) {
				switch (data.transition) {
					case 'jumpcut':
                        panelCounter.goTo(data.curr);
						break;
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
				// if (!_animating && !_loading) {
				if(!_animating) {
                	if (!popupCounter.isLast) {
						popupCounter.loadNext();
						this.popUp(popupCounter.getData());
					}
					else if (!panelCounter.isLast) {
                        panelCounter.loadNext();  
                        this.movePanels({
                            imgObj: _imagesPanelsLoaded[-1], 
                            imgObj_target: _imagesPanelsLoaded[0] || _imagesPanelsLoaded.loading,
                            direction: 1,
                            transition: cmxJSON[panelCounter.curr].transition,
                            curr: panelCounter.curr
                        });
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPrev: function() {
				// if (!_animating && !_loading) {				
				if(!_animating) {
                	if (!panelCounter.isFirst){			
                        panelCounter.loadPrev();
                        this.movePanels({
                            imgObj: _imagesPanelsLoaded[1], 
                            imgObj_target: _imagesPanelsLoaded[0] || _imagesPanelsLoaded.loading,
                            direction: -1,
                            transition: cmxJSON[panelCounter.curr].transition,
                            curr: panelCounter.curr
                        });
                    }
					else {
						this.goToPanel(0);
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPanel: function(panel) {	
                if (!_animating) panelCounter.goTo(panel);
			}
		};

		function bulkPreload(Json) {
			var logtime = true;
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
			var popupArr = [];
			for (var i = 0; i < L; i++) {
				popupArr = Json[i].popups ? popupArr.concat(Json[i].popups) : popupArr;
			}
			if (logtime) { console.log("Total no. of images: " + (Json.length + popupArr.length)); }
			bigLoad.load(Json.concat(popupArr), true);
		}

		return function(data, canvasId) {
    		//@ Get Canvases and Contexts
			cnv = document.getElementById(canvasId);
			ctx = cnv.getContext('2d');
			cmxJSON = data.cmxJSON;

            //@ Set up PanelCounter and set an onchange method, to keep things streamlined.
			panelCounter = new CountManager(cmxJSON);
            panelCounter.onchange = function(i){
                popupCounter = new CountManager(panelCounter.getData().popups, -1);
                loadPanelAndPopupImages(i || false);
            };
            panelCounter.onchange();
			
			// bulkPreload(data);
			return cmxcanvas;
		};
	}());
	return CmxCanvas;
});