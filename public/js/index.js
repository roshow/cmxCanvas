$(function() {
    var cmxcanvas = new CmxCanvas('cmxcanvas');

    cmxcanvas.config.transitionSpeed = 700;

    //left & right buttons

    cmxcanvas.loadFromURL("getcomic/?id=sov01");
    $("#leftbutton").click(function() {
        panel = cmxcanvas.goToPrev();
    });
    $("#rightbutton").click(function() {
        panel = cmxcanvas.goToNext();
    });

    //nav buttons

    $('.btn.readcomic').click(function(){
        cmxcanvas.loadFromURL('getcomic/?id=' + $(this).attr('issueId'));
    });
});