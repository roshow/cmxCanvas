$(function() {
    var cmxcanvas = new CmxCanvas('cmxcanvas');

    cmxcanvas.config.transitionSpeed = 700;

    //left & right buttons

    var comicUrl = "getcomic/?id=";

    function buildTOC(c) {
        console.log('build toc');
        var _l = c.comic.length,
            _html = '';
        console.log(_l);
        for (i = 0; i < _l; i++) {
            _html += '<li class="btn btn-inverse" panelNum="' + i + '">' + (i + 1) + '</li>';
        }

        $('#toc').html(_html);
        $('#toc li.btn').click(function(){
            console.log($(this).attr('panelNum'));
            cmxcanvas.goToPanel(parseInt($(this).attr('panelNum'), 10));
        });
    }

    cmxcanvas.loadFromURL(comicUrl + 'sov01', buildTOC);
    $("#leftbutton").click(function() {
        panel = cmxcanvas.goToPrev();
    });
    $("#rightbutton").click(function() {
        panel = cmxcanvas.goToNext();
    });

    //nav buttons

    $('.btn.readcomic').click(function(){
        cmxcanvas.loadFromURL(comicUrl + $(this).attr('issueId'), buildTOC);
    });
});