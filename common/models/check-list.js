'use strict';

var app = require('../../server/server');

module.exports = function(CheckList) {

    CheckList.beforeRemote('create', function(ctx, unused, next) {
        
        let userId = ctx.req.accessToken.userId;
        app.models.Manager.findById(userId, function (err, queriedUser) {
            if(err) {
                cb(err);
            }

            ctx.req.body.companyId = queriedUser.companyId;

            next();
        });
        
    });

    /**
     * Get all Check Lists
     */
    CheckList.AllCheckLists = function (ctx, cb) {
        
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
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                where: {
                    companyId: queriedManager.companyId
                },
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            
            CheckList.find(innerFilter, function (err, checkLists) {
                if (err) {
                    return cb(err);
                }

                cb(err, checkLists);
            })
        });
    };
    CheckList.remoteMethod('AllCheckLists', {
        description: 'Get all check Lists',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * show all Check Lists for service user
     */
    CheckList.ShowCheckLists = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {
                "id": userId
            }
        }
        app.models.AppUser.findOne(outerFilter, function (err, queriedManager) {
            if(err) {
                cb(err);
            }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                where: {
                    companyId: queriedManager.companyId
                },
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            
            CheckList.find(innerFilter, function (err, checkLists) {
                if (err) {
                    return cb(err);
                }

                cb(err, checkLists);
            })
        });
    };
    CheckList.remoteMethod('ShowCheckLists', {
        description: 'Get all check Lists',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
