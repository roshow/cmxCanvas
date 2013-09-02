$(function() {

    // begin helpers

    function selectTOCbtn(btn) {
        $('#toc li').removeClass('active');
        btn.addClass('active');
    }

    function buildTOC(c) {
        var _l = c.comic.length,
            _html = '';
        for (i = 0; i < _l; i++) {
            _html += templates.toc_panel(i);
        }

        $('#toc').html(_html);
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

    cmxcanvas.loadFromURL(comicUrl + 'sov01', buildTOC);
    
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
        cmxcanvas.loadFromURL(comicUrl + $(this).attr('issueId'), buildTOC);
    });
});