//public/js/app.frontend.js

require.config({
    paths: {
        jquery: 'libs/jquery-2.0.3.min',
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        bootstrap: 'libs/bootstrap.min',
        jade: 'templates/tmp.cmxcanvas'
    },
    shim: {
        jade: {
            exports: 'jade'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        "underscore": {
          exports: '_'
        }
    }
});

require(['boot'], function(boot){
    boot.initialize();
});