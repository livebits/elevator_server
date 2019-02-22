'use strict';
var app = require('../../server/server');

module.exports = function(Settings) {

    Settings.UpdateSettings = function (ctx, info, cb) {
        
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
            info.companyId = queriedManager.companyId;
            Settings.upsertWithWhere({companyId: queriedManager.companyId}, info, function (err, updatedSettings) {
                if(err) {
                    cb(err);
                }
                
                return cb(null, updatedSettings);
            })

        });
    };
    Settings.remoteMethod('UpdateSettings', {
        description: 'update company info',
        notes: ['update company info'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'info', type: 'object', http: {source: 'body'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: { verb: 'patch'}
    });

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

    Settings.GetMyCompanyInfo = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {
                "id": userId
            }
        }
        app.models.AppUser.findOne(outerFilter, function (err, queriedUser) {
            if(err) {
                cb(err);
            }

            let innerFilter = {
                where: {
                    companyId: queriedUser.companyId
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
    Settings.remoteMethod('GetMyCompanyInfo', {
        description: 'Show user company info',
        notes: ['Show user company info'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: { verb: 'get'}
    });
};
