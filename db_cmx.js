var db = require('mongojs').connect(CONFIG.mongo.uri, ['comics', 'qa'])
    , env = 'qa';

exports.db_cmx = (function() {
    var db_cmx = {
        issues: {
            get: function(q, cb) {
                db[env].find(q, function(e, r) {
                    cb && cb(r);
                    return r;
                });
            }
        }
    };
    return db_cmx;
}());