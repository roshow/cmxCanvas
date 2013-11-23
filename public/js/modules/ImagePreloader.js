var Deferred = (function(){
    var cbq = [];
    var def = {
        resolve: function() {
            var L = cbq.length;
            for (i = 0; i < L; i++) {
                cbq[i]();
            }
        },
        add: function(fn) {
            cbq.push(fn);
        }
    };
    function init(){
        return def;
    }
    return init;
}());

var ImagePreloader = (function(){

// the main event.

    function ImagePreloader(imgs) {
        
        var imgpreload = {
            loadedImages: {},
            onLoadDone: function(){ return false; }
        };

        var loadingQ = 0;

        var defer = new Deferred();
        function loadImage(key, img, anon){
            var _img = new Image();
            if (anon) _img.crossOrigin = "Anonymous";
            _img.onload = function(){ 
                imgpreload.loadedImages[key] = this;
                if (img.callback) {
                    img.cbPriority ? img.callback() : defer.add(img.callback);
                }
                if (--loadingQ === 0) {
                    imgpreload.onLoadDone();
                    defer.resolve();
                }
            };
            loadingQ++;
            _img.src  = img.src;
        }

        imgpreload.load = function(imgs, anon) {
            var that = this;
            start = new Date();
            for (var key in imgs){
                loadImage(key, imgs[key], anon);
            }

        };

        return imgpreload;
    }

    return ImagePreloader;

}());