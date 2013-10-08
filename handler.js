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

exports.handler = (function() {
    
    var handler = {
        index: function(req, res) {
            console.log('handling /');
            res.render('layouts/layout.jade')
        },
        getcomic: function(req, res) {
            var _q = {
                _id: req.query.id
            };
            dbc.issues.get(_q, function(r){
                res.send(r[0]);
            })
        },
        library: function(req, res) {
            console.log('handling '+req.url);
            var _q = {};
            dbc.metadata.get(_q, function(r) {
                res.render('library.jade', {
                    issues: r
                });
            });
        },
        read: function(req, res) {
            console.log('handling /read');
            dbc.issues.get({_id: req.query.id}, function(r) {
                res.render('index.jade', {
                    issues: r,
                    Id: req.query.id
                });
            });
        },
        dbtest: function(req, res) {
            var _q = {};
            function _cb(r) {
                res.send(parse_issueNames(r));
            }
            dbc.issues.get(_q, _cb);
        },

        getcmxmetadata: function(req, res) {
            console.log('handling /get_cmx_metadata');
            var _q = {};
            dbc.metadata.get(_q, function(r) {
                res.render('library.jade', {
                    issues: r
                });
                //res.send(r);
            });
        },

        getallcmx: function(req, res) {
            console.log('handling /getallcmx');
            var _q = {};
            dbc.metadata.get(_q, function(r) {
                res.send(r);
            });
        },

        getcmxjson: function(req, res){
            console.log('handling /getcmxjson');
            var _q = {
                _id: req.params.id
            };
            console.log(_q);
            dbc.metadata.get(_q, function(r){
                var _ish = r[0];
                dbc.cmxjson.get({
                    _id: r[0].cmxJSON
                }, function(j) {
                    _ish.cmxJSON = j[0].JSON;
                    res.send(_ish);
                });
            });
        }
    };
    
    return handler;

}());