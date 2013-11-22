define([], function(){

    var promises = [];
    function runPromises() {
        var L = promises.length;
        for (i = 0; i < L; i++) {
            promises[i]();
        }
    }
    function addPromise(func) {
        promises.push(func);
    }

    function ImagePreloader(imgs) {
        
        var imgpreload = {
            loadedImages: {}
        };

        var _loading = 0;
        function _onImageLoad(img, onLoadDone){
                if (_loading >= 0) {
                if (img.cbPriority && img.callback) {
                     img.callback();
                }
                else if (img.callback){
                    addPromise(img.callback);
                }
            }
            if (_loading === 0) {
                onLoadDone && onLoadDone();
                runPromises();
            }
        }

        imgpreload.load = function(imgs, anon) {
            var that = this;
            for (key in imgs){
                img = new Image();
                if (anon) img.crossOrigin = "Anonymous";
                img.onload = (function(key){
                    return function(){ 
                        _loading--;
                        that.loadedImages[key] = this;
                        //imgs[key].callback && imgs[key].callback();
                        //that.onLoadDone && that.onLoadDone();
                        _onImageLoad(imgs[key], that.onLoadDone);
                    };
                }(key));
                _loading++;
                img.src  = imgs[key].src;
            }
        };

        return imgpreload;
    }

    return ImagePreloader;

});