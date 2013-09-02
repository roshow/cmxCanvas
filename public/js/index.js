$(function() {

    // helper

    function buildTOC(c) {
        var _l = c.comic.length,
            _html = '';
        for (i = 0; i < _l; i++) {
            _html += '<li class="btn btn-inverse" panelNum="' + i + '">' + (i + 1) + '</li>';
        }

        $('#toc').html(_html);
        $('#toc li.btn').click(function(){
            console.log($(this).attr('panelNum'));
            cmxcanvas.goToPanel(parseInt($(this).attr('panelNum'), 10));
        });
    }

    //load cmxcanvas!

    var cmxcanvas = new CmxCanvas('cmxcanvas', {
            transitionSpeed: 700
        }),
        comicUrl = "getcomic/?id=";

    //left & right buttons

    cmxcanvas.loadFromURL(comicUrl + 'sov01', buildTOC);
    
    $("#leftbutton").click(function() {
        panel = cmxcanvas.goToPrev();
    }); 
    $("#rightbutton").click(function() {
        panel = cmxcanvas.goToNext();
    });

    //nav buttons

    $('.readcomic').click(function(){
        cmxcanvas.loadFromURL(comicUrl + $(this).attr('issueId'), buildTOC);
    });
});