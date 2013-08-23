var express = require('express'),
    app = express(),
    _port = '5000';

app.use(express.static(__dirname + '/public'));

app.listen(_port);
console.log('cmxcanvas Listening on port ' + _port);