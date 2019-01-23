'use strict';
var app = require('../../server/server');

module.exports = function(Damage) {

    /**
     * Get all damages
     */
    Damage.AllDamages = function (ctx, cb) {
        
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
                include: [ "factors", "reports",
                    {
                        "relation": "appUser",
                        "scope": {
                            "where": {
                                "companyId": queriedManager.companyId
                            }
                        }
                    }
                ],
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            Damage.find(innerFilter, function (err, damages) {
                if (err) {
                    return cb(err);
                }

                let resultDamages = [];
                damages.forEach((damage, index) => {
                    damage = damage.toJSON();
                    if(damage.appUser != undefined) {
                        resultDamages.push(damage);
                    }
                });

                cb(err, resultDamages);
            })
        });
    };
    Damage.remoteMethod('AllDamages', {
        description: 'Get all damages',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Get all service user damages
     */
    Damage.serviceDamages = function (serviceObject, ctx, cb) {
        let userId = ctx.req.accessToken.userId;

        let where = {};

        if(serviceObject.customerId !== undefined && serviceObject.customerId !== "") {
            if(serviceObject.showAll === 1) {
                where = {
                    "appUserId": serviceObject.customerId
                };
            } else {
                where = {
                    and: [
                        {"appUserId": serviceObject.customerId},
                        {"serviceId": userId}
                    ]
                };
            }
        } else {
            if(serviceObject.showAll === 1) {
                where = {};
            } else {
                where = {
                    "serviceId": userId
                };
            }
        }

        const filter = {
            include: [
                "appUser",
                "serviceUser",
                "reports",
                {
                    "relation": "factors",
                    "scope":{
                        "include": ["payments", "factorItems"]
                    }
                }
            ],
            where: where,
            order: 'id DESC',
        }
        
        Damage.find(filter, function (err, damages) {
            if(err) {
                let error = {
                    error: err,
                    code: 500,
                    message: 'خطای سرور رخ داده است.'
                }
                return cb(error);
            }
           
            cb(err, damages);
        });
    };
    Damage.remoteMethod('serviceDamages', {
        description: 'Get damages',
        notes: ['{"showAll": false,"customerId":"1"}'],
        accepts: [
            {arg: 'filter', type: 'Object', http: {source: 'query'}},
            {arg: 'ctx', type: 'object', http: {source: 'context'}}
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });


    /**
     * Get all customer damages
     */
    Damage.customerDamages = function (ctx, cb) {
        let userId = ctx.req.accessToken.userId;

        const filter = {
            include: [
                "appUser",
                "serviceUser",
                "reports",
                {
                    "relation": "factors",
                    "scope":{
                        "include": ["payments", "factorItems"]
                    }
                }
            ],
            where: {
                "appUserId": userId
            },
            order: 'id DESC',
        }
        
        Damage.find(filter, function (err, damages) {
            if(err) {
                let error = {
                    error: err,
                    code: 500,
                    message: 'خطای سرور رخ داده است.'
                }
                return cb(error);
            }
           
            cb(err, damages);
        });
    };
    Damage.remoteMethod('customerDamages', {
        description: 'Get damages',
        notes: [''],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}}
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Save report and factor items for damage
     */
    Damage.saveReportFactor = function (damageObject, ctx, cb) {
        let userId = ctx.req.accessToken.userId;
        // {"damageId":1, "report": "report desc...","factorItems": [{"name":"obj name", "quantity": 2, "unitPrice": 1200}]}

        let damageId = damageObject.damageId;
        let reportDesc = damageObject.report;
        let factorItems = damageObject.factorItems;
        
        //save report
        let reportObj = {damageId: damageId, body: reportDesc};
        app.models.Report.create(reportObj, function (err, report) {
            if(err) {
                let error = {
                    error: err,
                    code: 500,
                    message: 'خطای سرور رخ داده است.'
                }
                return cb(error);
            }
           
            let sumFactor = 0;
            let myFactorItems = [];
            factorItems.forEach(item => {
                let price = item.quantity * item.unitPrice;

                myFactorItems.push({
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: price,
                });

                sumFactor += price;
            });

            //save factor
            let factorObject = {damageId: damageId, status: 'notpaid', paymentStatus: 'online', sumPrice: sumFactor};
            app.models.Factor.create(factorObject, function (err, factor) {
                if(err) {
                    let error = {
                        error: err,
                        code: 500,
                        message: 'خطای سرور رخ داده است.'
                    }
                    return cb(error);
                }

                let finalFactorItems = [];
                myFactorItems.forEach(item => {
    
                    item.factorId = factor.id;
                    finalFactorItems.push(item);
                });

                //save factor items
                app.models.FactorItem.create(finalFactorItems, function (err, factorItems) {
                    if(err) {
                        let error = {
                            error: err,
                            code: 500,
                            message: 'خطای سرور رخ داده است.'
                        }
                        return cb(error);
                    }

                    cb(err, factorItems);
                });
            });


        });
    };
    Damage.remoteMethod('saveReportFactor', {
        description: 'Save report and factor items of damage',
        notes: ['{"damageId":1, "report": "report desc...","factorItems": [{"name":"obj name", "quantity": 2, "unitPrice": 1200}]}'],
        accepts: [
            {arg: 'damageObject', type: 'Object', http: {source: 'body'}},
            {arg: 'ctx', type: 'object', http: {source: 'context'}}
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'post'}
    });
};
