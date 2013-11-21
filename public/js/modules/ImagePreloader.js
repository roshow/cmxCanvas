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
            for (key in imgs){
                this.loadedImages[key] = new Image();
                if (anon) newImage.crossOrigin = "Anonymous";
                this.loadedImages[key].onload = function(){
                    _loading--;
                    this.onLoadDone && this.onLoadDone();
                    //_loadDoneCallbacks(imgs[key], this);
                };
                this.loadedImages[key].src  = imgs[key].src;
                _loading++;
            }
        };

        return imgpreload;
    }

    return ImagePreloader;

});