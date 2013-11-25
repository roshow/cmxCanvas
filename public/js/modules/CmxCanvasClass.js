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
			loadedImages = {},
			imgLoader = new ImagePreloader(),
			popupLoader = new ImagePreloader();

		imgLoader.onLoadStart = function() {
			console.log('============== LOADING PANELS=============');
			this.start = new Date().getTime();
			++_loading;
		};
		imgLoader.onLoadDone = function() {
			this.end = new Date().getTime();
			console.log('panels loaded in: ' + (this.end - this.start));
            loadedImages = imgLoader.loadedImages;
            --_loading;
            if(!_loading) console.log('============== DONE LOADING PANELS COMPLETELY=============');
        };
        popupLoader.onLoadStart = function() {
			console.log('============== LOADING POPUPS=============');
			this.start = new Date().getTime();
			++_loading;
		};
		popupLoader.onLoadDone = function() {
			this.end = new Date().getTime();
			console.log('popups loaded in: ' + (this.end - this.start));
			--_loading;
            if(!_loading) console.log('============== DONE LOADING POPUPS COMPLETELY=============');

		};
        function writeImgLoaderData() {
        	var imgd = {};
			if (!panelCounter.isLast) imgd.imgObj_next = { src: cmxJSON[panelCounter.next].src };
			if (!panelCounter.isFirst) imgd.imgObj_prev = { src: cmxJSON[panelCounter.prev].src };
        	imgd.imgObj = {
    			src: cmxJSON[panelCounter.curr].src,
    			callback: function(imgObj) {
    				ctx.clearRect(0, 0, cnv.width, cnv.height);
					ctx.drawImage(imgObj, halfDiff(cnv.width, imgObj.width), halfDiff(cnv.height, imgObj.height));
    			},
    			cbPriority: true
    		}
    		return imgd;
        };

		// The Main Event
		var cmxcanvas = {

			// START: methods for making stuff happen on the canvas
			movePanels: function(imgObj, imgObj_target, direction) {
				switch (cmxJSON[panelCounter.curr].transition) {
					case 'jumpcut':
						this.goToPanel(panelCounter.curr);
						break;
					//case 'elastic': //case for this transition if it's not default
					default:
						_animating = true;
						Animate.panels(imgObj, imgObj_target, cnv, ctx, direction, function(){
							imgLoader.load(writeImgLoaderData(), true);
                			_animating = false;
						});
						break;
				}
			},
			popUp: function(popup) {
				_animating = true;
				Animate.popup({
					img: popupLoader.loadedImages[popupCounter.curr],
					x: popup.x || 0,
					y: popup.y || 0,
					animation: popup.animation || 'scaleIn'
				}, cnv, ctx);
				_animating = false;
			},

			// These are really the only methods that should be public:
			goToNext: function() {
				if (!_animating && !_loading) {
					if (!popupCounter.isLast) {
						popupCounter.loadNext();
						this.popUp(popupCounter.data[popupCounter.curr]);
					}
					else if (!panelCounter.isLast) {
						panelCounter.loadNext();
						popupCounter = new CountManager(cmxJSON[panelCounter.curr].popups, -1);
						
						if (popupCounter.curr) popupLoader.load(cmxJSON[panelCounter.curr].popups, true);
						this.movePanels(loadedImages.imgObj, loadedImages.imgObj_next, 1);
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPrev: function() {
				if (!_animating && !_loading) {				
					if (!panelCounter.isFirst){
						panelCounter.loadPrev();
						popupCounter = new CountManager(cmxJSON[panelCounter.curr].popups, -1);
						if (popupCounter.curr) popupLoader.load(cmxJSON[panelCounter.curr].popups, true);
						this.movePanels(loadedImages.imgObj, loadedImages.imgObj_prev, - 1);
					}
					else {
						this.goToPanel(0);
					}
				}
				return [panelCounter, popupCounter];
			},
			goToPanel: function(panel) {
				panelCounter.goTo(panel);
				popupCounter = new CountManager(cmxJSON[panelCounter.curr].popups, -1);
				if (popupCounter.curr) popupLoader.load(cmxJSON[panelCounter.curr].popups, true);
				imgLoader.load(writeImgLoaderData(), true);
			}
		};

		var init = function(data, canvasId) {
			//// Get Canvases and Contexts
			cnv = document.getElementById(canvasId);
			ctx = cnv.getContext('2d');
			
			cmxJSON = data.cmxJSON;
			panelCounter = new CountManager(cmxJSON);
			
			popupCounter = new CountManager(cmxJSON[0].popups, -1);
			if (popupCounter.curr) popupLoader.load(cmxJSON[panelCounter.curr].popups, true);
			imgLoader.load(writeImgLoaderData(), true);
			
			return cmxcanvas;
		};

		return init;
	}());

	return CmxCanvas;
});