var db = require('mongojs').connect(CONFIG.mongo.uri, ['cmxMetaData', 'cmxJSON', 'comics']);

exports.db_cmx = (function() {
    var db_cmx = {
        issues: {
            get: function(q, cb) {
                db.comics.find(q, function(e, r) {
                    cb && cb(r);
                    return r;
                });
            }
        },

        metadata: {
            get: function(q, cb) {
                db.cmxMetaData.find(q, function(e, r) {
                    cb && cb(r);
                    return r;
                });
            }
        },

        cmxjson: {
            get: function(q, cb) {
                db.cmxJSON.find(q, function(e, r) {
                    cb && cb(r);
                    return r;
                });
            }
        }
    };
    return db_cmx;
}());