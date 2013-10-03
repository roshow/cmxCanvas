try { CONFIG = require('./config.js'); }
catch(e){ CONFIG = {
    mongo: {
        uri: 'cmx'
    },
    port: 2000
}; }

var express = require('express'),
    app = express(),
    _port = CONFIG.port;

var handler = require('./handler').handler;

app.use(express.static(__dirname + '/public'));

app.listen(_port);
app.get('/library', handler.library);
app.get('/getcomic', handler.getcomic);
app.get('/getcmxmetadata', handler.getcmxmetadata);
app.get('/getcmxjson/:id', handler.getcmxjson);
app.get('*', handler.index);

app.get('/read', handler.read);
app.get('/db', handler.dbtest);
console.log('cmxcanvas Listening on port ' + _port);