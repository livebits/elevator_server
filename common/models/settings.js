'use strict';
var app = require('../../server/server');

module.exports = function(Settings) {

    Settings.GetCompanyInfo = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {
                "id": userId
            }
        }
        app.models.Manager.findOne(outerFilter, function (err, queriedManager) {
            if(err) {
                cb(err);
            }

            let innerFilter = {
                where: {
                    companyId: queriedManager.companyId
                }
            };
            Settings.findOne(innerFilter, function (err, settings) {
                if(err) {
                    cb(err);
                }
                
                return cb(null, settings);
            })

        });
    };
    Settings.remoteMethod('GetCompanyInfo', {
        description: 'Show company info',
        notes: ['Show company info'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: { verb: 'get'}
    });
};
