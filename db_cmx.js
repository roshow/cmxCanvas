var dbconfig = require('./config.js').mongo,
    db = require('mongojs').connect(dbconfig.uri, ['comics']);

exports.db_cmx = (function() {
    var db_cmx = {
        issues: {
            get: function(q, cb) {
                db.comics.find(q, function(e, r) {
                    cb && cb(r);
                    return r;
                });
            }
        }
    };
    return db_cmx;
}());