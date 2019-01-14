'use strict';
var app = require('../../server/server');

module.exports = function(Manager) {

    Manager.DashboardStats = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": userId}
        }

        let customersCount = 0;
        let servicesCount = 0;
        let damagesCount = 0;
        let companiesCount = 0;

        Manager.findOne(outerFilter, function (err, queriedUser) {
            if(err) {
                return cb(err);
            }
            
            let innerFilter = {
                where: {companyId: queriedUser.companyId},
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
            app.models.AppUser.find(innerFilter, function (err, customers) {
                if (err) {
                    return cb(err);
                }                

                customers.forEach(user => {
                    user = user.toJSON();
                    if(user.roles.length > 0) {
                        customersCount++;
                    }
                });

                let serviceFilter = {
                    where: {companyId: queriedUser.companyId},
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
                app.models.AppUser.find(serviceFilter, function (err, services) {
                    if (err) {
                        return cb(err);
                    }

                    services.forEach(user => {
                        user = user.toJSON();
                        if(user.roles.length > 0) {
                            servicesCount++;
                        }
                    });

                    const damageFilter = {
                        include: [
                            {
                                "relation": "appUser",
                                "scope": {
                                    "where" : {
                                        "companyId": queriedUser.companyId
                                    }
                                }
                            }
                        ]
                    }
                    app.models.Damage.find(damageFilter, function (err, damages) {
                        if(err) {
                            return cb(err);
                        }

                        damages.forEach(damage => {
                            damage = damage.toJSON();
                            if(damage.appUser !== undefined) {
                                damagesCount++;
                            }
                        });

                        app.models.Company.count({}, function (err, companiesCount) {

                            let result = {
                                "customers" : customersCount,
                                "services" : servicesCount,
                                "damages" : damagesCount,
                                "companies" : companiesCount,
                            }                        

                            return cb(null, result);
                        });
                        
                    });

                });
                
            })
        });
    };
    Manager.remoteMethod('DashboardStats', {
        description: 'Get manager dashboard stats',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'object'},
        http: {verb: 'get'}
    });

    Manager.afterRemote('login', function(ctx, manager, next) {
        
        Manager.findById(manager.userId, {"include": ["roles"]}, function (err, _manager) {
            
            if(_manager.companyId !== null) {
                ctx.result.role = "company";
            } else {
                ctx.result.role = "admin";
            }
            
            next();
        });
    });

    /**
     * Get all Company Managers
     */
    Manager.CompanyManagers = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {'companyId': {"neq": null}}
        }
        Manager.find(outerFilter, function (err, managers) {
            if(err) {
                cb(err);
            }
            
            cb(err, managers);
        });
    };
    Manager.remoteMethod('CompanyManagers', {
        description: 'Get all company managers',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Get all admin Managers
     */
    Manager.AdminManagers = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {'companyId': null}
        }
        Manager.find(outerFilter, function (err, managers) {
            if(err) {
                cb(err);
            }
            
            cb(err, managers);
        });
    };
    Manager.remoteMethod('AdminManagers', {
        description: 'Get all admin managers',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
