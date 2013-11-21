define([], function(){

    function ImagePreloader(imgs) {
            
        var imgpreload = {
            loadedImages: {}
        };

        var _loading = 0;
        function _loadDoneCallbacks(img, onLoadDone){
            if (!_loading) {
                if (!img.callback){
                    onLoadDone && onLoadDone();
                }
                else if (img.cbPriority && img.cbPriority === 2){
                    onLoadDone && onLoadDone();
                    img.callback();
                }
                else {
                    img.callback();
                    onLoadDone && onLoadDone();
                }
            }
            else {
                img.callback && img.callback();
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
                        //console.log(key);
                        that.loadedImages[key] = this;
                        //imgs[key].callback && imgs[key].callback();
                        that.onLoadDone && that.onLoadDone();
                        //_loadDoneCallbacks(imgs[key], that.onLoadDone);
                    };
                }(key));
                img.src  = imgs[key].src;
                _loading++;
            }
        };

        return imgpreload;
    }

    return ImagePreloader;

});