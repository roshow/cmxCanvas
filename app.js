try { CONFIG = require('./config.js'); }
catch(e){ CONFIG = {
    mongo: {
        uri: 'cmx'
    },
    port: 2000
}; }

var express = require('express'),
    app = express(),
    _port = CONFIG.port,
    exec = require('child_process').exec,
    handler = require('./handler').handler;

app.use(express.static(__dirname + '/public'));

app.listen(_port);
app.get('/library', handler.library);
app.get('/getcomic', handler.getcomic);
app.get('/getcmxjson/:id', handler.getcmxjson);
app.get('/getallcmx', handler.getallcmx);
app.get('*', handler.index);

console.log('cmxcanvas Listening on port ' + _port);
//Open Safari when cmxcanvas has begun to listen:
//exec('open -a Safari "http://localhost:5000/#comic/revorigin"');