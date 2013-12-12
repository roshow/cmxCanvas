define(['jquery', 'underscore', 'modules/jsAnimate', 'modules/PanelCounter', 'modules/imageAsData'], function($, _, Animate, CountManager, ImageAsData){

	function halfDiff(a, b) {
		return (a - b)/2;
	}

    var loadpanelimgs = (function(){
        var loadReadyAction = function() {
            // console.log('loadReadyAction');
        };
        function loadpanelimgs(arg, id, fn){
            var popupimgs;
            var popupL = (arg.popups && arg.popups.length > 0) ? arg.popups.length : 0;
            var loading = 1 + popupL;
            
            var panelimg = new Image();
            panelimg.crossOrigin = "Anonymous";
            panelimg.onload = function(){
                /* Remove a loading token and, if none left, run callback */
                if (!--loading) {
                    fn({
                        img: panelimg,
                        id: id || false,
                        popups: popupimgs || false
                    });
                }
            } 
            panelimg.src = arg.src
            
            /* If any popups, load the Images */
            if (popupL) {
                popupimgs = [];
                for (var i = 0; i < popupL; i++) {
                    popupimgs[i] = new Image();
                    popupimgs[i].crossOrigin = "Anonymous";
                    popupimgs[i].onload = function(){
                        /* Remove a loading token and, if none left, run callback */
                        if (!--loading) {
                            fn({
                                img: panelimg,
                                id: id || false,
                                popups: popupimgs || false
                            });
                        }
                    }
                    popupimgs[i].src = arg.popups[i].src;
                }
            }
        }
        return loadpanelimgs;
    }());

    function _loadAll(imgs2load, fn) {
        var keys = Object.keys(imgs2load);
        var L = keys.length;
        var loadingAll = L;
        var loadedImgs = [];
        for (var i = 0; i < L; i++) {
            loadpanelimgs(imgs2load[keys[i]], keys[i], function(imgs){
                loadedImgs[imgs.id] = imgs;
                if (!--loadingAll) {
                    fn && fn(loadedImgs);
                }
            });
        }
    }

    /* crazy recursive function to load images staggered-like in the background */
    function throttledLoadArray(imgs2load){
        _loadAll(imgs2load.splice(0,10), function(imgs) {
            imgs = null;
            if (imgs2load.length > 0) {
                throttledLoadArray(imgs2load);
            }
            else {
                return false;
            }
        });
    }

	var CmxCanvas = (function() {
		
		var _cnv, _ctx, _panelCounter, _popupCounter;
		var _animating = false;
        var _loadingHold = false;
        var _loadedPanels = {
            loading: (function(){
                var img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = "http://roshow.net/public/images/cmxcanvas/sov01/loading.jpg";
                return {
                    img: img
                };
            }())
        };

        function movePanels(data) {
            switch (data.transition) {
                case 'jumpcut':
                    _panelCounter.goTo(data.curr);
                    break;
                default:
                    _animating = true;
                    Animate.panels(data.imgObj, data.imgObj_target, _cnv, _ctx, data.direction, function(){
                        _animating = false;
                    });
                    break;
            }
        }
        function popPopup(popup) {
            _animating = true;
            Animate.popup({
                img: _loadedPanels[_panelCounter.curr].popups[_popupCounter.curr],
                x: popup.x || 0,
                y: popup.y || 0,
                animation: popup.animation || 'scaleIn'
            }, _cnv, _ctx);
            _animating = false;
        }

		/* The Main Event */
		var cmxcanvas = {

			goToNext: function() {
                if (!_loadedPanels[_panelCounter.curr]) { _loadingHold = true; }
				if(!_animating && !_loadingHold) {
                	if (!_popupCounter.isLast) {
						_popupCounter.loadNext();
						popPopup(_popupCounter.getData());
					}
					else if (!_panelCounter.isLast) {
                        _panelCounter.loadNext();
                        var _target = (_loadedPanels[_panelCounter.curr] && _loadedPanels[_panelCounter.curr].img) ? _loadedPanels[_panelCounter.curr].img : _loadedPanels.loading.img;
                        movePanels({
                            imgObj: _loadedPanels[_panelCounter.prev].img, 
                            imgObj_target: _target,
                            direction: 1,
                            transition: _panelCounter.getData().transition,
                            curr: _panelCounter.curr
                        });
					}
                    return [_panelCounter, _popupCounter];
				}
                else {
                    // console.log('CANNOT MOVE');
                    return false;
                }
			},
			goToPrev: function() {				
				if(!_animating) {
                	if (!_panelCounter.isFirst) {			
                        _panelCounter.loadPrev();
                        movePanels({
                            imgObj: _loadedPanels[_panelCounter.next].img,
                            imgObj_target: _loadedPanels[_panelCounter.curr].img,
                            direction: -1,
                            transition: _panelCounter.getData().transition,
                            curr: _panelCounter.curr
                        });
                    }
					else {
						this.goToPanel(0);
					}
                    return [_panelCounter, _popupCounter];
				}
                else {
                    // console.log('CANNOT MOVE');
                    return false;
                }
			},
			goToPanel: function(panel) {	
                if (!_animating) { 
                    _panelCounter.goTo(panel);
                    imgObj = _loadedPanels[_panelCounter.curr].img || _loadedPanels.loading.img
                    _ctx.clearRect(0, 0, _cnv.width, _cnv.height);
                    _ctx.drawImage(imgObj, halfDiff(_cnv.width, imgObj.width), halfDiff(_cnv.height, imgObj.height));
                }
			}
		};

		function __init(data, cnvId) {
    		/* Get Canvases and Contexts */
			_cnv = document.getElementById(cnvId);
			_ctx = _cnv.getContext('2d');

            /** Loading placeholder **/
            _ctx.clearRect(0, 0, _cnv.width, _cnv.height);
            _ctx.drawImage(_loadedPanels.loading.img, halfDiff(_cnv.width, _loadedPanels.loading.img.width), halfDiff(_cnv.height, _loadedPanels.loading.img.height));

            /**
            *   Overriding _panelCounter after this point will BREAK EVERYTHING.
            **/
            _panelCounter = new CountManager(data.cmxJSON);
            _panelCounter.onchange = function(){
                _popupCounter = new CountManager(_panelCounter.getData().popups, -1);
                var dataset = _panelCounter.getDataSet(-2, 2);
                var panelsToKeep = {};
                panelsToKeep.loading = _loadedPanels.loading;
                for (var key in dataset) {
                    if (_loadedPanels[key]) {
                        delete dataset[key];
                    }
                    else {
                        _loadedPanels[key] = 'loading';
                    }
                    panelsToKeep[key] = _loadedPanels[key];
                }
                _loadedPanels = panelsToKeep;
                panelsToKeep = null;
                _loadAll(dataset, function(imgs){
                    for (key in imgs) {
                        _loadedPanels[key] = imgs[key];
                        if (parseInt(key, 10) === _panelCounter.curr) {
                            imgObj = _loadedPanels[key].img;
                            _ctx.clearRect(0, 0, _cnv.width, _cnv.height);
                            _ctx.drawImage(imgObj, halfDiff(_cnv.width, imgObj.width), halfDiff(_cnv.height, imgObj.height));
                        }
                    }
                    // console.log(_loadedPanels);
                    _loadingHold = false;
                });
            };
            _panelCounter.onchange(0,4);

            /* warm up the local browser's cache */
            var start = new Date();
            throttledLoadArray(_panelCounter.data.slice(2), start);

            console.log('CmxCanvas Loaded');
			return cmxcanvas;
		}

        return __init;
	}());

	return CmxCanvas;
});