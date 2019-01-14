'use strict';

var app = require('../../server/server');

module.exports = function(Payment) {

    /**
     * Get all factor payments
     */
    Payment.AllFactorPayments = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": userId}
        }
        app.models.Manager.findOne(outerFilter, function (err, queriedManager) {
            if(err) {
                cb(err);
            }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                include: [
                    "payments",
                    {
                        "relation": "damage",
                        "scope": {
                            "include": {
                                "relation": "appUser",
                                "scope":{
                                    "where": {
                                        "companyId": queriedManager.companyId
                                    }
                                }
                            }
                        }
                    }
                ],
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            app.models.Factor.find(innerFilter, function (err, factors) {
                if (err) {
                    return cb(err);
                }                

                let result = [];
                factors.forEach((factor, index) => {
                    factor = factor.toJSON();

                    let paymentObject = {}

                    if(factor.damage.appUser != undefined && factor.payments != undefined) {

                        factor.payments.forEach((payment, index) => {
                            
                            paymentObject = payment;
                            paymentObject.factorId = factor.id;

                            result.push(paymentObject);
                        });
                        
                    }
                });

                cb(err, result);
            });
        });
    };
    Payment.remoteMethod('AllFactorPayments', {
        description: 'Get all factor payments',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Get all company payments
     */
    Payment.AllCompanyPayments = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": userId}
        }
        app.models.Manager.findOne(outerFilter, function (err, queriedManager) {
            if(err) {
                cb(err);
            }
            
            const outerFilter = {
                where: {"companyId": queriedManager.companyId},
                include: [
                    {
                        "relation": "damages",
                        "scope": {
                            "include": {
                                "relation": "factors",
                                "scope":{
                                    "include": {
                                        "relation": "payments"
                                    }
                                }
                            }
                        }
                    }
                ]
            }
            app.models.AppUser.find(outerFilter, function (err, queriedUsers) {
                if(err) {
                    cb(err);
                }

                let result = [];
                
                queriedUsers.forEach(queriedUser => {
                    queriedUser = queriedUser.toJSON();
                    
                    queriedUser.damages.forEach((damage, index) => {
    
                        if(damage.factors !== undefined && damage.factors.payments != undefined) {
                            damage.factors.payments.forEach((payment, index) => {
                                
                                let object = {};
                                object = payment;
                                object.factorId = damage.factors.id;

                                result.push(object);
                            });
                        }
                    });
                });

                cb(err, result);
            });
        });
    };
    Payment.remoteMethod('AllCompanyPayments', {
        description: 'Get all company payments',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

};
