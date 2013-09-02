var templates = (function(){
    var templates = {
        toc_panel: function(i){
            return [
                '<li id="toc' + i + '" panelNum="' + i + '">',
                    '<a>' + (i + 1) + '</a>',
                '</li>'
            ].join('');
        }
    }
    return templates;
}());
