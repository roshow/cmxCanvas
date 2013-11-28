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
			LOADEDPANELS = {
                loading: (function(){
                    var img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = "http://roshow.net/public/images/cmxcanvas/sov01/loading.jpg"
                    return img;
                }())
            },
            LOADEDPOPUPS = {},
			panelImgPreloader = new ImagePreloader(),
			popupImgLoader = new ImagePreloader();

		panelImgPreloader.onLoadStart = function() {
			this.start = new Date().getTime();
			++_loading;
		};
		panelImgPreloader.onLoadDone = function() {
            var res = panelImgPreloader.loadedImages;
            var key;
            for (key in res) {
            	LOADEDPANELS[key] = res[key];
            }
            delete panelImgPreloader.loadedImages;
            panelImgPreloader.loadedImages = {};
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
        function _helper_ConstructLoadData(panel) {
            return {
                src: panelCounter.data[panel].src,
                callback: function(imgObj) {
                    if (panel === panelCounter.curr){
                        ctx.clearRect(0, 0, cnv.width, cnv.height);
                        ctx.drawImage(imgObj, halfDiff(cnv.width, imgObj.width), halfDiff(cnv.height, imgObj.height));
                    }
                },
                cbPriority: true
            };
        }
        function _helper_popupCBOverride(panel) {
            return function(){
                LOADEDPOPUPS[panel] = popupImgLoader.loadedImages;
                delete panelImgPreloader.loadedImages;
                panelImgPreloader.loadedImages = {};
                --_loading;
                this.end = new Date().getTime();
                //console.log('popups loaded in: ' + (this.end - this.start));*/
            }
        }
        function loadPanelAndPopupImages() {
            var imgd = {},
                keys = panelCounter.getCurr(-2, 2),
                L = keys.length;

            for (var i = 0; i < L; i++) {
                var panel = keys[i];
                if (!LOADEDPANELS[panel]) {
                    imgd[panel] = _helper_ConstructLoadData(panel);
                    var popups = panelCounter.data[panel].popups || false;
                    if (popups && popups.length > 0) {
                        popupImgLoader.load(popups, true, _helper_popupCBOverride(panel));
                    }
                }
            };

            panelImgPreloader.load(imgd, true);
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
			popPopup: function(popup) {
				_animating = true;
				Animate.popup({
					img: LOADEDPOPUPS[panelCounter.curr][popupCounter.curr],
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
						this.popPopup(popupCounter.getData());
					}
					else if (!panelCounter.isLast) {
                        panelCounter.loadNext();  
                        this.movePanels({
                            imgObj: LOADEDPANELS[panelCounter.prev], 
                            imgObj_target: LOADEDPANELS[panelCounter.curr] || LOADEDPANELS.loading(),
                            direction: 1,
                            transition: panelCounter.getData().transition,
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
                            imgObj: LOADEDPANELS[panelCounter.next], 
                            imgObj_target: LOADEDPANELS[panelCounter.curr] || LOADEDPANELS.loading(),
                            direction: -1,
                            transition: panelCounter.getData().transition,
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
                loadPanelAndPopupImages();
            };
            panelCounter.onchange();
			
			// bulkPreload(data);
			return cmxcanvas;
		};
	}());
	return CmxCanvas;
});