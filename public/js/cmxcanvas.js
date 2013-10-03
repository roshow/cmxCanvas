define(['bootstrap', 'Backbone', 'jade', 'modules/CmxCanvasClass'], function($, Backbone, jade, CmxCanvas) {

    function() {

        // begin helpers

        function selectTOCbtn(btn) {
            $('#toc li').removeClass('active');
            btn.addClass('active');
        }

        function buildDetails(c) {
            $('#footerContent').html(jade.templates['toc'](c));

            $('.moreinfoBtn').click(function(){
                if ($('#moreinfo').hasClass('open')) {
                    $('#moreinfo').removeClass('open');
                    $('.moreinfoBtn > span.caret').removeClass('reverse');
                }
                else {
                    $('#moreinfo').addClass('open');
                    $('.moreinfoBtn > span.caret').addClass('reverse');
                }
            });

            $('#toc li').click(function(){
                console.log($(this).attr('panelNum'));
                cmxcanvas.goToPanel(parseInt($(this).attr('panelNum'), 10));
                selectTOCbtn($(this));
            });
            selectTOCbtn($('#toc0'));
        }

        function goForward() {
            var panel = cmxcanvas.goToPrev();
            selectTOCbtn($('#toc' + panel));
        }

        function goBack() {
            var panel = cmxcanvas.goToNext();
            selectTOCbtn($('#toc' + panel));
        }

        //end helpers

        //load cmxcanvas!

        var cmxcanvas = new CmxCanvas('cmxcanvas', {
                transitionSpeed: 700
            }),
            comicUrl = "getcomic/?id=";

        //left & right buttons

        cmxcanvas.loadFromURL(comicUrl + ID, buildDetails);
        
        $("#leftbutton").click(function() {
            goForward();
        }); 
        $("#rightbutton").click(function() {
            goBack();
        });
        var _keydown = false;
        $(document).keydown(function(e) {
            if (!_keydown) {
                if (e.keyCode === 37) {
                    _keydown = true;
                    goForward();
                }
                else if (e.keyCode === 39) {
                    _keydown = true;
                    goBack();
                }
            }
        });
        $(document).keyup(function(e){
            if(_keydown && e.keyCode === 37 || e.keyCode === 39) {
                _keydown = false;
            }
        });

        //nav buttons

        $('.readcomic').click(function(){
            cmxcanvas.loadFromURL(comicUrl + $(this).attr('issueId'), buildDetails);
        });

        console.log('backboned');
    });
});