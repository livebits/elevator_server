'use strict';
var app = require('../../server/server');
const sms = require('../sms');

module.exports = function(Message) {

    Message.beforeRemote('create', function(ctx, unused, next) {
        
        let userId = ctx.req.accessToken.userId;
        app.models.Manager.findById(userId, function (err, queriedUser) {
            if(err) {
                cb(err);
            }

            ctx.req.body.companyId = queriedUser.companyId;

            next();
        });
        
    });

    Message.afterRemote('create', function(ctx, message, next) {
        
        let managerId = ctx.req.accessToken.userId;

        app.models.Manager.findById(managerId, function (err, manager) {
            if(err){
                console.log(err);
            }

            let mobiles = [];
            if(message.userType === 'all') {
                let filter = {
                    where: {companyId: manager.companyId}
                };
                app.models.AppUser.find(filter, function (err, users) {
                    if(err){
                        console.log(err);
                    }

                    users.forEach(user => {
                        mobiles.push(user.mobile);
                    });

                    sms.sendMessage(mobiles, message.body);
                });

            } else if(message.userType === 'customers') {
                let filter = {
                    where: {companyId: manager.companyId},
                    include: [
                        {
                            "relation": "roles",
                            "scope": {
                                "where": {
                                    "name": "customer"
                                }
                            }
                        }
                    ],
                };
                app.models.AppUser.find(filter, function (err, customers) {
                    if(err){
                        console.log(err);
                    }

                    customers.forEach(user => {
                        user = user.toJSON();
                        if(user.roles.length > 0) {
                            mobiles.push(user.mobile);
                        }
                    });

                    sms.sendMessage(mobiles, message.body);
                });

            } else if(message.userType === 'serviceUsers') {
                let filter = {
                    where: {companyId: manager.companyId},
                    include: [
                        {
                            "relation": "roles",
                            "scope": {
                                "where": {
                                    "name": "service"
                                }
                            }
                        }
                    ],
                };
                app.models.AppUser.find(filter, function (err, serviceUsers) {
                    if(err){
                        console.log(err);
                    }

                    serviceUsers.forEach(user => {
                        user = user.toJSON();
                        if(user.roles.length > 0) {
                            mobiles.push(user.mobile);
                        }
                    });

                    sms.sendMessage(mobiles, message.body);
                });

            } else if(message.userType === 'user') {

                app.models.AppUser.findById(message.appUserId, function (err, user) {
                    if(err){
                        console.log(err);
                    }

                    mobiles.push(user.mobile);
                    sms.sendMessage(mobiles, message.body);
                });
            }
            
        });

        next();
        
    });

    /**
     * Get all company messages
     */
    Message.CompanyMessages = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        
        app.models.Manager.findById(userId, function (err, queriedUser) {
            if(err) {
                cb(err);
            }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                where: {companyId: queriedUser.companyId},
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            Message.find(innerFilter, function (err, messages) {
                if (err) {
                    return cb(err);
                }

                cb(err, messages);
            })
        });
    };
    Message.remoteMethod('CompanyMessages', {
        description: 'Get all company messages',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
