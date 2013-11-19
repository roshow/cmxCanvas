define([], function(){

    function _getImageData(img, canvas, context){
        //context.drawImage(img, 0, 0, img.width/img.height*450, 450);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        var _imageData = context.getImageData(0,0,img.width,img.height);
        return _imageData;
    }

    function IdImage(canvas) {
        var imgD = {};

        imgD.setCanvas = function(canvasId){
            imgD.canvas = document.getElementById(canvasId);
            imgD.context = imgD.canvas ? imgD.canvas.getContext('2d') : false;
        };
        if (canvas) {
            imgD.setCanvas(canvas);
        }
        else {
            imgD.setCanvas();
        }

        var _loading;
        imgD.isLoading = function(){
            return _loading;
        };

        imgD.load = function(src) {
            imgD.src = src;
            var newImage = new Image();
            newImage.crossOrigin = "Anonymous";
            newImage.onload = function(){
                _loading = true;
                imgD.data = _getImageData(this, imgD.canvas, imgD.context); 
                _loading = false;
                imgD.onload && imgD.onload();
            };
            newImage.src = imgD.src;
        };

        return imgD;
    }

    return IdImage;
});