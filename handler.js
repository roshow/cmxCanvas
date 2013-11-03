var dbc = require('./db_cmx.js').db_cmx,
    jade = require('jade');

var i, L;

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
            res.render('layouts/basic.jade')
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
        dbtest: function(req, res) {
            var _q = {};
            function _cb(r) {
                res.send(parse_issueNames(r));
            }
            dbc.issues.get(_q, _cb);
        },

        getallcmx: function(req, res) {
            console.log('handling /getallcmx');
            var _q = {
                published: 1
            };
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
                r = r[0];
                dbc.cmxjson.get({
                    _id: r.cmxJSON
                }, function(j) {
                    j = j[0];
                    if (!r.compiledImgUrls) {
                        L = j.JSON.length;
                        for(i = 0; i < L; i++) {
                            j.JSON[i].src = r.img.url + j.JSON[i].src;
                        }
                        r.compiledImgUrls = true;
                    }
                    r.cmxJSON = j.JSON;
                    res.send(r);
                });
            });
        }
    };
    
    return handler;

}());