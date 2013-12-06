CONFIG = {
    mongo: {
        uri: 'mongodb://you:comein@ds043348.mongolab.com:43348/cmxcanvas',
        db: 'rodb',
        host: 'ds043348.mongolab.com',
        port: 43348,
        username: 'you',
        password: 'comein'
    },
    port: process.env.PORT || 5000
}

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