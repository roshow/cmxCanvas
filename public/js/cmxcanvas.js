var testy;
$(function() {

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

    //end helpers

    //load cmxcanvas!

    var cmxcanvas = new CmxCanvas('cmxcanvas', {
            transitionSpeed: 700
        }),
        comicUrl = "getcomic/?id=";

    //left & right buttons

    cmxcanvas.loadFromURL(comicUrl + 'sov01', buildDetails);
    
    $("#leftbutton").click(function() {
        panel = cmxcanvas.goToPrev();
        selectTOCbtn($('#toc' + panel));
    }); 
    $("#rightbutton").click(function() {
        panel = cmxcanvas.goToNext();
        selectTOCbtn($('#toc' + panel));
    });

    //nav buttons

    $('.readcomic').click(function(){
        cmxcanvas.loadFromURL(comicUrl + $(this).attr('issueId'), buildDetails);
    });
});