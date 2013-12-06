/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/
/*global define*/

define(['jquery', 'modules/jsAnimate', 'modules/PanelCounter', 'modules/imageAsData', 'ImagePreloader'], function($, Animate, CountManager, ImageAsData, ImagePreloader){

	function halfDiff(a, b) {
		return (a - b)/2;
	}

	var CmxCanvas = (function() {
		
		var _cnv, _ctx, _panelCounter, _popupCounter;
		var _animating = false;
        var _loading = 0;
        var _loadingHold = false;

        var _loadedPopups = {}
        var _loadedPanels = {
            loading: (function(){
                var img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = "http://roshow.net/public/images/cmxcanvas/sov01/loading.jpg"
                return img;
            }())
        };
		var _panelImgPreloader = new ImagePreloader({
            onLoadStart: function() {
                this.start = new Date().getTime();
                ++_loading;
            },
            onLoadDone: function() {
                var key;
                for (key in _panelImgPreloader.loadedImages) {
                    _loadedPanels[key] = _panelImgPreloader.loadedImages[key];
                }
                delete _panelImgPreloader.loadedImages;
                _panelImgPreloader.loadedImages = {};
                --_loading;
                if (_loading === 0) _loadingHold = false;
                
                this.end = new Date().getTime();
                //console.log('panels loaded in: ' + (this.end - this.start));
            }
        });
		var _popupImgLoader = new ImagePreloader({
            onLoadStart: function() {
                this.start = new Date().getTime();
                ++_loading;
            },
            onLoadDone: function() {
                --_loading;
                if (_loading === 0) _loadingHold = false;
                this.end = new Date().getTime();
                //console.log('popups loaded in: ' + (this.end - this.start));
            }
        });

        function _helper_ConstructLoadData(panel) {
            return {
                src: _panelCounter.data[panel].src,
                callback: function(imgObj) {
                    if (panel === _panelCounter.curr){
                        _ctx.clearRect(0, 0, _cnv.width, _cnv.height);
                        _ctx.drawImage(imgObj, halfDiff(_cnv.width, imgObj.width), halfDiff(_cnv.height, imgObj.height));
                        //_loadingHold = false;
                    }
                },
                cbPriority: true
            };
        }
        function _helper_popupCBOverride(panel) {
            //@ Similar to the _panelImgPreloader.onLoadDone method but needs the panel variable from loadPanelAndPopups
            return function(){
                _loadedPopups[panel] = _popupImgLoader.loadedImages;
                delete _panelImgPreloader.loadedImages;
                _panelImgPreloader.loadedImages = {};
                --_loading;
                if (_loading === 0) _loadingHold = false;
                this.end = new Date().getTime();
                //console.log('popups loaded in: ' + (this.end - this.start));*/
            }
        }
        function loadPanelAndPopups() {
            var imgd = {},
                keys = _panelCounter.getCurr(-2, 2),
                L = keys.length,
                i;
            for (i = 0; i < L; i++) {
                var panel = keys[i];
                if (!_loadedPanels[panel]) {
                    imgd[panel] = _helper_ConstructLoadData(panel);
                    var popups = _panelCounter.data[panel].popups || false;
                    if (popups && popups.length > 0) {
                        console.log('#' + panel + ' popups: load-start.');
                        _popupImgLoader.load(popups, true, _helper_popupCBOverride(panel));
                    }
                    //@ this runs if the panel has no popups. Could be useful.
                    else {
                        console.log('#' + panel + ' popups: doesn\'t have any.');
                    }
                }
            };
            _panelImgPreloader.load(imgd, true);
        }
        function movePanels(data) {
            switch (data.transition) {
                case 'jumpcut':
                    _panelCounter.goTo(data.curr);
                    break;
                default:
                    _animating = true;
                    Animate.panels(data.imgObj, data.imgObj_target, _cnv, _ctx, data.direction, function(){
                        console.log('elastic move done');
                        _animating = false;
                    });
                    break;
            }
        }
        function popPopup(popup) {
            _animating = true;
            Animate.popup({
                img: _loadedPopups[_panelCounter.curr][_popupCounter.curr],
                x: popup.x || 0,
                y: popup.y || 0,
                animation: popup.animation || 'scaleIn'
            }, _cnv, _ctx);
            _animating = false;
        }

		//@ The Main Event
		var cmxcanvas = {

			goToNext: function() {
				// if (!_animating && !_loading) {
				if(!_animating) {
                    if (!_loadedPanels[_panelCounter.curr]) _loadingHold = true;
                	if (!_popupCounter.isLast) {
						_popupCounter.loadNext();
						popPopup(_popupCounter.getData());
					}
					else if (!_panelCounter.isLast) {
                        _panelCounter.loadNext();  
                        movePanels({
                            imgObj: _loadedPanels[_panelCounter.prev], 
                            imgObj_target: _loadedPanels[_panelCounter.curr] || _loadedPanels.loading,
                            direction: 1,
                            transition: _panelCounter.getData().transition,
                            curr: _panelCounter.curr
                        });
					}
                    return [_panelCounter, _popupCounter];
				}
                else {
                    console.log('cannot move');
                    console.log('_loadingHold: '+ _loadingHold);
                    console.log('_animating: ' + _animating);
                    return false;
                }
			},
			goToPrev: function() {
				// if (!_animating && !_loading) {				
				if(!_animating) {
                	if (!_panelCounter.isFirst) {			
                        _panelCounter.loadPrev();
                        movePanels({
                            imgObj: _loadedPanels[_panelCounter.next], 
                            imgObj_target: _loadedPanels[_panelCounter.curr],
                            direction: -1,
                            transition: _panelCounter.getData().transition,
                            curr: _panelCounter.curr
                        });
                    }
					else {
						this.goToPanel(0);
					}
				}
                else {
                    console.log('animating, cannot move');
                }
				return [_panelCounter, _popupCounter];
			},
			goToPanel: function(panel) {	
                if (!_animating) _panelCounter.goTo(panel);
			}
		};

		function init(data, cnvId) {
    		//@ Get Canvases and Contexts
			_cnv = document.getElementById(cnvId);
			_ctx = _cnv.getContext('2d');

            //@ Set up PanelCounter and set an onchange method, to keep things streamlined.
            //@ This is where _panelCounter because REALLY important. It's managing the entire 
            //@ cmxJSON file for all of CmxCanvas. It can only be accessed through _panelCounter.data
            //@ and a few other methods. Overriding _panelCounter after this point will BREAK EVERYTHING.
			_panelCounter = new CountManager(data.cmxJSON);
            _panelCounter.onchange = function(){
                _popupCounter = new CountManager(_panelCounter.getData().popups, -1);
                loadPanelAndPopups();
            };
            _panelCounter.onchange();

			return cmxcanvas;
		};
        return init;
	}());

	return CmxCanvas;
});