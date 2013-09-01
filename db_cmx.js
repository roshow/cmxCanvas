var db = require('mongojs').connect({
        uri: 'cmx',
        db: 'cmx'
    }, ['comics']);

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