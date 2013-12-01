var Deferred = (function(){
    var cbq = [];
    var def = {
        resolve: function() {
            var L = cbq.length;
            for (i = 0; i < L; i++) {
                cbq.splice(0,1)[0]();
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

    function ImagePreloader(req) {
        req = req || {};
        var imgpreload = {
            loadedImages: {},
            onLoadStart: req.onLoadStart || function() { return false; },
            onLoadDone: req.onLoadDone || function(){ return false; },
            onload: function(fn){
                fn && fn();
            }
        };

        var loadingQ = 0;
        var defer = new Deferred();
        function loadImage(key, img, anon, cb){
            var _img = new Image();
            if (anon) _img.crossOrigin = "Anonymous";
            _img.onload = function(){ 
                imgpreload.loadedImages[key] = this;
                if (img.callback) {
                    img.cbPriority ? img.callback(this) : defer.add(img.callback);
                }
                if (--loadingQ === 0) {
                    cb ? cb() : imgpreload.onLoadDone();
                    defer.resolve();
                }
            };
            loadingQ++;
            _img.src  = img.src;
        }
        imgpreload.load = function(imgs, anon, cb) {
            if (!loadingQ) {
                imgpreload.loadedImages = {};
                this.onLoadStart();
                var keys = Object.keys(imgs);
                var L = keys.length;
                start = new Date();
                for (var i = 0; i < L; i++){
                    var key = keys[i];
                    loadImage(key, imgs[key], anon, cb);
                }
            }
            else {
                defer.add(function(){
                    imgpreload.load(imgs, anon, cb);
                });
            }
        };
        imgpreload.onload = function(fn){
            this.onLoadDone = fn;
            return this;
        };

        return imgpreload;
    }
    return ImagePreloader;

}());