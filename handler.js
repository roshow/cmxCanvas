var dbc = require('./db_cmx.js').db_cmx,
    jade = require('jade');

function parse_issueNames(r) {
    var _l = r.length;
    var _issues = [];
    for (i = 0; i < _l; i++) {
        var _r = r[i];
        var _numtxt = _r.issue ? ' #' + _r.issue : '';
        _issues.push(_r.series.name + _numtxt + ': ' + _r.title);
    }
    return _issues;
}

exports.handler = (function(){
    
    var handler = {
        index: function(req, res){
            var _q = {};
            dbc.issues.get(_q, function(r) {
                res.render('index.jade', {
                    issues: r,
                    balls: 'balls'
                });
            });
        },
        getcomic: function(req, res) {
            var _q = {
                _id: req.query.id
            };
            dbc.issues.get(_q, function(r){
                res.send(r[0]);
            })
        },
        dbtest: function(req, res){
            var _q = {};
            function _cb(r) {
                res.send(parse_issueNames(r));
            }
            dbc.issues.get(_q, _cb);
        }
    };
    
    return handler;

}());