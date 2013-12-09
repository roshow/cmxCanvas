define([], function(){
  var jsAnimate = {
      /* Adapted from: http://javascript.info/tutorial/animation */
      elastic: function(progress, x) {
        x = x || 1.5;
        return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress)
      },
      linear: function(progress){
      	return progress
      },
      quad: function(progress){
      	return Math.pow(progress, 2)
      },
      circ: function(progress) {
        return 1 - Math.sin(Math.acos(progress))
      },
      back: function(progress, x) {
        x = x || 1.5;
        return Math.pow(progress, 2) * ((x + 1) * progress - x)
      },
      bounce: function(progress) {
        for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
          if (progress >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
          }
        }
      },
      makeEaseInOut: function(delta) {  
        return function(progress) {
          if (progress < .5)
            return delta(2*progress) / 2
          else
            return (2 - delta(2*(1-progress))) / 2
        }
      },  
      makeEaseOut: function(delta) {  
        return function(progress) {
          return 1 - delta(1 - progress)
        }
      },
      animation: function(animObj) {

          var step = function(deltaX, deltaY){
              
              var toX = [
                  (animObj.to[0].x - animObj.from[0].x) * deltaX + animObj.from[0].x,
                  (animObj.to[1].x - animObj.from[1].x) * deltaX + animObj.from[1].x
              ];
              
              var toY = [
                  (animObj.to[0].y - animObj.from[0].y) * deltaY + animObj.from[0].y,
                  (animObj.to[1].y - animObj.from[1].y) * deltaY + animObj.from[1].y
              ];
              
              animObj.ctx.clearRect(0, 0, animObj.canvas.width, animObj.canvas.height);


              animObj.ctx.drawImage(animObj.target[0], toX[0], toY[0]);
              animObj.ctx.drawImage(animObj.target[1], toX[1], toY[1]);
          };
          
          setTimeout(function(){
              var start = new Date();   

              var id = setInterval(function(){
                  var timePassed = new Date() - start;
                  var progress = timePassed / animObj.duration;
              
                  if (progress > 1) {progress = 1;}
                  
                  var xFunction = (animObj.aFunction.x) ? animObj.aFunction.x : animObj.aFunction;
                  var deltaX = (animObj.friction) ? xFunction(progress, animObj.friction) : xFunction(progress);      
                  
                  var yFunction = (animObj.aFunction.y) ? animObj.aFunction.y : animObj.aFunction;
                  var deltaY = (animObj.friction) ? yFunction(progress, animObj.friction) : yFunction(progress);          
                  
                  step(deltaX, deltaY);
                  
                  if (progress === 1) { 
                      clearInterval(id);
                      if(animObj.onComplete){
                          animObj.onComplete();
                      }
                  }

                },animObj.interval || 100);


          },animObj.delay);   
      }
  }
  //return jsAnimate;
  
  function halfDiff(a, b) {
    return (a - b)/2;
  }
  function animatePanels(imgObj, imgObj_target, cnv, ctx, direction, cb) {
      var imgObj_x = halfDiff(cnv.width, imgObj.width),
          imgObj_y = halfDiff(cnv.height, imgObj.height),
          imgObj_target_x = halfDiff(cnv.width, imgObj_target.width),
          imgObj_target_y = halfDiff(cnv.height, imgObj_target.height);

          jsAnimate.animation({
              target: [imgObj, imgObj_target],
              from: [
                { x: imgObj_x, y: imgObj_y },
                { x: imgObj_target_x + (direction * cnv.width), y: imgObj_target_y} 
              ],
              to: [
                { x: imgObj_x - (direction * cnv.width), y: imgObj_y },
                          { x: imgObj_target_x, y: imgObj_target_y }
              ],
              canvas: cnv,
              ctx: ctx,
              duration: 400,
              interval: 25,
              aFunction: jsAnimate.makeEaseOut(jsAnimate.back),
              onComplete: function() {
                cb && cb();
              }
          });
  }
  function animatePopUp(popup, cnv, ctx){
        popup.dur = popup.dur || 100;
        popup.totalFrames = popup.totalFrames || 10;
        var _int = popup.dur/popup.totalFrames,
          _bkgPartial = ctx.getImageData(popup.x, popup.y, popup.img.width, popup.img.height),
          _frame = 0;

        switch (popup.animation) {
          case 'fadeIn':
            ctx.globalAlpha = 0;
                var _fadeIn = setInterval(function(){

              //increase globalAlpha by 1 / total frames and make it into a normal fraction
              var ga = ctx.globalAlpha + 1/popup.totalFrames;
              ctx.globalAlpha = parseFloat(ga.toFixed(1), 10);

              ctx.clearRect(popup.x, popup.y, popup.img.width, popup.img.height);
              ctx.putImageData(_bkgPartial, popup.x, popup.y);
              ctx.drawImage(popup.img, popup.x, popup.y);

              _frame++;
              if (ctx.globalAlpha === 1) {
                clearInterval(_fadeIn);
              }
              }, _int);
              break;

          case 'scaleIn':
          default:
            var _scale = 0,
                  _scaleIn = setInterval(function(){
              
              _scale += 10;
              
              var _scaledW = popup.img.width*(_scale/100),
                _scaledH = popup.img.height*(_scale/100),
                _dX = popup.x + ((popup.img.width - _scaledW)/2),
                _dY = popup.y + ((popup.img.height - _scaledH)/2);

              ctx.clearRect(popup.x, popup.y, popup.img.width, popup.img.height);
              ctx.putImageData(_bkgPartial, popup.x, popup.y);
              ctx.drawImage(popup.img, _dX, _dY, _scaledW, _scaledH);

              _frame++;
              if (_scale === 100) clearInterval(_scaleIn);
              }, _int);
              break;
          }
  }

  var Animate = {
    panels: animatePanels,
    popup: animatePopUp
  }
  return  Animate;
});