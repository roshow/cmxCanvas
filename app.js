var express = require('express'),
    app = express(),
    _port = '5000';

var handler = require('./handler').handler;

app.use(express.static(__dirname + '/public'));

app.listen(_port);
app.get('/', handler.index);
app.get('/getcomic', handler.getcomic);
app.get('/db', handler.dbtest);
console.log('cmxcanvas Listening on port ' + _port);