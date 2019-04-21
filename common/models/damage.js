'use strict';
var app = require('../../server/server');

var fcm = require('../fcm');

module.exports = function(Damage) {

    
    Damage.DamagesDetail = function (ctx, damageId, cb) {

        let filter = {
            include: ['appUser', 'serviceUser', 'reports', 'factors']
        };
        Damage.findById(damageId, filter, function (err, damage) {
            if (err) {
                return cb(err);
            }
            
            cb(err, damage);
        });


    };
    Damage.remoteMethod('DamagesDetail', {
        description: 'Show damage detail',
        notes: ['Show damage detail'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {"arg": "id", "required": true, "type": "number", http: {source: 'path'}, description: 'damage id'}
        ],
        returns: {
            arg: 'res', type: 'Array', root: true
        },
        http: {path: '/DamagesDetail/:id', verb: 'get'}
    });

    /**
     * Get all damages
     */
    Damage.AllDamages = function (ctx, filter, cb) {

        let filterObject = filter.filter;
        
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

            let whereFilter = {};
            let now = new Date();
            now = now.toLocaleString();

            if(filterObject.status === undefined || filterObject.status === "all") {
                whereFilter = {
                    isEMG: null
                }
            } else if(filterObject.status === "expired") {
                whereFilter = {
                    and: [
                        {
                            visitDate: {lt: now}
                        },
                        {
                            description: ""
                        },
                        {
                            isEMG: null
                        }
                    ]
                }
            } else if(filterObject.status === "inFuture") {
                whereFilter = {
                    and: [
                        {
                            visitDate: {gt: now}
                        },
                        {
                            description: ""
                        },
                        {
                            isEMG: null
                        }
                    ]
                }
            } else if(filterObject.status === "done") {
                whereFilter = {
                    and: [
                        {
                            description: {neq: ""},
                        },
                        {
                            isEMG: null
                        }
                    ]
                }
            } else if(filterObject.status === "notAssigned") {
                whereFilter = {
                    and: [
                        {
                            serviceId: null
                        },
                        {
                            isEMG: null
                        }
                    ]
                }
            }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                where: whereFilter,
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
            console.log(JSON.stringify(innerFilter));
            
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
            {arg: 'filter', type: 'Object', http: {source: 'query'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Get all emergency damages
     */
    Damage.AllEMGDamages = function (ctx, cb) {

        // let filterObject = filter.filter;
        
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

            // let whereFilter = {};
            // let now = new Date();
            // now = now.toLocaleString();

            // if(filterObject.status === undefined || filterObject.status === "all") {
            //     whereFilter = {
            //         isEMG: null
            //     }
            // } else if(filterObject.status === "expired") {
            //     whereFilter = {
            //         and: [
            //             {
            //                 visitDate: {lt: now}
            //             },
            //             {
            //                 description: ""
            //             },
            //             {
            //                 isEMG: null
            //             }
            //         ]
            //     }
            // } else if(filterObject.status === "inFuture") {
            //     whereFilter = {
            //         and: [
            //             {
            //                 visitDate: {gt: now}
            //             },
            //             {
            //                 description: ""
            //             },
            //             {
            //                 isEMG: null
            //             }
            //         ]
            //     }
            // } else if(filterObject.status === "done") {
            //     whereFilter = {
            //         and: [
            //             {
            //                 description: {neq: ""},
            //             },
            //             {
            //                 isEMG: null
            //             }
            //         ]
            //     }
            // } else if(filterObject.status === "notAssigned") {
            //     whereFilter = {
            //         and: [
            //             {
            //                 serviceId: null
            //             },
            //             {
            //                 isEMG: null
            //             }
            //         ]
            //     }
            // }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                where: {isEMG: 1},
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
            console.log(JSON.stringify(innerFilter));
            
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
    Damage.remoteMethod('AllEMGDamages', {
        description: 'Get all emg damages',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            // {arg: 'filter', type: 'Object', http: {source: 'query'}},
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
        // let userId = ctx.req.accessToken.userId;
        // {"damageId":1, "report": "report desc...","factorItems": [{"name":"obj name", "quantity": 2, "unitPrice": 1200}]}

        let damageId = damageObject.damageId;
        let reportDesc = damageObject.report;
        let checkList = JSON.stringify(damageObject.checkList);
        let factorItems = damageObject.factorItems;
        
        //save report
        let reportObj = {damageId: damageId, body: reportDesc, checkList: checkList};
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
                let price = 0;

                myFactorItems.push({
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: 0,
                    total: 0,
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

                    //send fcm notif to customer
                    Damage.findById(damageId, {include: "appUser"}, function (err, damage) {
                        if(err) {
                            let error = {
                                error: err,
                                code: 500,
                                message: 'خطای سرور رخ داده است.'
                            }
                            return cb(error);
                        }
                        let damageObject = damage.toJSON();
                    
                        if(damageObject.appUser.fcmToken !== null && damageObject.appUser.fcmToken !== ""){
                            fcm.sendDataMessage("", "سرویس کار برای خرابی آسانسور شما گزارش ثبت کرده است", {"id": damageObject.id+""}, damageObject.appUser.fcmToken);
                        }
                              
                        
                        cb(err, factorItems);
                    })

                });
            });


        });
    };
    Damage.remoteMethod('saveReportFactor', {
        description: 'Save report and factor items of damage',
        notes: ['{"damageId":1, "report": "report desc...","factorItems": [{"name":"obj name", "quantity": 2, "unitPrice": 1200}], "checkList": [{"name": "door"}]}'],
        accepts: [
            {arg: 'damageObject', type: 'Object', http: {source: 'body'}},
            {arg: 'ctx', type: 'object', http: {source: 'context'}}
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'post'}
    });

    Damage.Update = function (ctx, data, cb) {
        
        // let userId = ctx.req.accessToken.userId;
        Damage.updateAll({id: data.id}, data, function (err, updatedDamage) {
            if(err) {
                cb(err);
            }

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

                let whereFilter = {
                    id: data.id
                };
                
                let innerFilter = {
                    where: whereFilter,
                    include: [ "factors", "reports",
                        {
                            "relation": "appUser",
                            "scope": {
                                "where": {
                                    "companyId": queriedManager.companyId
                                }
                            }
                        },
                        {
                            "relation": "serviceUser",
                            "scope": {
                                "where": {
                                    "companyId": queriedManager.companyId
                                }
                            }
                        }
                    ],
                };
                
                Damage.findOne(innerFilter, function (err, damage) {
                    if (err) {
                        return cb(err);
                    }

                    let damageObject = damage.toJSON();
                    
                    if(damageObject.appUser.fcmToken !== null && damageObject.appUser.fcmToken !== "")
                        fcm.sendDataMessage("", "برای خرابی ثبت شده توسط شما سرویس کار تعیین شده است.", {"id": damageObject.id+""}, damageObject.appUser.fcmToken);
                                        
                    if(damageObject.serviceUser !== undefined 
                        && damageObject.serviceUser.fcmToken !== undefined
                        && damageObject.serviceUser.fcmToken !== null
                        && damageObject.serviceUser.fcmToken !== "") {
                        fcm.sendDataMessage("", "خرابی جدیدی برای شما تعیین شده است.", {"id": damageObject.id + ""}, damageObject.serviceUser.fcmToken);
                    }

                    return cb(err, damage);
                })

            });

        });
    };
    Damage.remoteMethod('Update', {
        description: 'update damage',
        notes: ['update damage'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'data', type: 'object', http: {source: 'body'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: { verb: 'patch'}
    });

    Damage.sendNotification = function (data, ctx, cb) {
        fcm.sendDataMessage("onvan", "matn", data, "c_CvfPQnqFA:APA91bG48oFhdUrMA-4M9-gk-V8PqWbS94jfoqAuOuzOWZsA0tMKlUB95c7RubDxAh1NYEXP8wS7AQ-FQnRGTzEmHK_zgylVsEa40Bfm7lNKj7lo8LwLyeMJyLNWg2FgXiC0Lq0rptpA")
        return cb(null, "message sent successfully");
    };
    Damage.remoteMethod('sendNotification', {
        description: 'Send notification',
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'data', type: 'Object', http: {source: 'body'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'post'}
    });


    /**
     * Get damage detail
     */
    Damage.GetDamage = function (ctx, data, cb) {
        console.log("get detail");
        

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
            ]
        }
        
        Damage.findById(data.id, filter, function (err, damage) {
            if(err) {
                let error = {
                    error: err,
                    code: 500,
                    message: 'خطای سرور رخ داده است.'
                }
                return cb(error);
            }
           
            cb(err, damage);
        });
    };
    Damage.remoteMethod('GetDamage', {
        description: 'Get damage detail',
        notes: [''],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'data', type: 'Object', http: {source: 'body'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'post'}
    });
};
