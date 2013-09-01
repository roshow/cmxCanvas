/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/

var CmxCanvas = (function() {

	var i, _cid, ctx, _cjson, imgObj_x, imgObj_y, imgObj_next_x, imgObj_next_y;
	var _thisPanel = 0;
	var _thisPopup = 0;
	var direction = 1;
	var imgObj = new Image();
	var imgObj_next = new Image();

	var cmxCanvasObj = {
		config: {
			transitionSpeed: null
		},
		movePanels: function() {

			var that = this;

			imgObj_x = (_cid.width - imgObj.width) / 2;
			imgObj_y = (_cid.height - imgObj.height) / 2;
			imgObj_next_x = (_cid.width - imgObj_next.width) / 2;
			imgObj_next_y = (_cid.height - imgObj_next.height) / 2;

			ctx.drawImage(imgObj_next, imgObj_next_x + (direction * _cid.width), imgObj_next_y);

			jsAnimate({
				target: [imgObj, imgObj_next],
				from: [
                {
					x: imgObj_x,
					y: imgObj_y
				},
                   {
					x: imgObj_next_x + (direction * _cid.width),
					y: imgObj_next_y
				}
                ],
				to: [
                {
					x: imgObj_x - (direction * _cid.width),
					y: imgObj_y
				},
                   {
					x: imgObj_next_x,
					y: imgObj_next_y
				}
                ],
				canvas: _cid,
				ctx: ctx,
				duration: that.config.transitionSpeed || 500,
				aInt: 20,
				friction: 0,
				aFunction: makeEaseOut(back),
				onComplete: function() {
					imgObj.src = _cjson[_thisPanel].src;
				}
			});
		},
		selectPanel: function(panel) {
			_thisPanel = panel;
			_thisPopup = 0;
			imgObj.src = _cjson[_thisPanel].src;
		},
		popUp: function(popup) {
			var x = popup.x || 0;
			var y = popup.y || 0;
			var img_Pop = new Image();
			img_Pop.onload = function() {
				ctx.drawImage(img_Pop, x, y);
			};
			img_Pop.src = popup.src;
		},
		goToNext: function() {
			if (_thisPanel <= _cjson.length - 1) {
				var popups = _cjson[_thisPanel].popups || null;
				if (popups && _thisPopup < popups.length) {
					switch (popups[_thisPopup].type) {
						case "popup":
							this.popUp(popups[_thisPopup]);
							_thisPopup += 1;
							break;
					}
				}
				else if (_thisPanel !== _cjson.length - 1) {
					_thisPanel = _thisPanel + 1;
					_thisPopup = 0;
					direction = 1;
					imgObj_next.src = _cjson[_thisPanel].src;
				}
			}
			return _thisPanel;
		},
		goToPrev: function() {
			if (_thisPanel > 0) {
				_thisPanel = _thisPanel - 1;
				direction = -1;
				_thisPopup = 0;
				switch (_cjson[_thisPanel].type) {
					case "panel":
						imgObj_next.src = _cjson[_thisPanel].src;
						break;
					default:
						this.goToPrev();
						break;
				}
			}
			return _thisPanel;
		},
		loadFromURL: function(comicURI, func) {
			var that = this;
			$.getJSON(comicURI, function(data) {
				_cjson = data.comic;
				_thisPanel = 0;
				imgObj.src = data.comic[_thisPanel].src;
				if (func) {
					func(data);
				}
			});
		}
	};

	imgObj.onload = function() {
		ctx.clearRect(0, 0, _cid.width, _cid.height);
		ctx.drawImage(imgObj, (_cid.width - imgObj.width) / 2, (_cid.height - imgObj.height) / 2);
	};
	imgObj_next.onload = function() {
		cmxCanvasObj.movePanels();
	};

	function init(canvasId) {
		_cid = document.getElementById(canvasId);
		ctx = _cid.getContext("2d");
		return cmxCanvasObj;
	};

	return init;

	
}());