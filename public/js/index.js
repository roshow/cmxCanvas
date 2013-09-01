$(function() {
    var cmxcanvas = new CmxCanvas('cmxcanvas');

    cmxcanvas.config.transitionSpeed = 700;

    cmxcanvas.loadFromURL("getcomic/?id=sov01");
    $("#leftarrow").click(function() {
        panel = cmxcanvas.goToPrev();
    });
    $("#rightarrow").click(function() {
        panel = cmxcanvas.goToNext();
    });

    //nav buttons

    $('.btn.readcomic').click(function(){
        cmxcanvas.loadFromURL('getcomic/?id=' + $(this).attr('issueId'));
    });
});