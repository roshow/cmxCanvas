var db = require('mongojs').connect(CONFIG.mongo.uri, ['comics']);

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