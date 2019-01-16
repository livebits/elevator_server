'use strict';
var app = require('../../server/server');
var csv = require('csvtojson');
const sms = require('../sms');
// const LoopBackContext = require('loopback-context');

module.exports = function(AppUser) {

    // AppUser.validatesPresenceOf('email', 'email');

    AppUser.beforeRemote('create', function(ctx, unused, next) {
        
        let userId = ctx.req.accessToken.userId;
        const filter = {
            where: {"id": userId}
        }
        app.models.Manager.findById(userId, function (err, queriedUser) {
            if(err) {
                cb(err);
            }

            ctx.req.body.companyId = queriedUser.companyId;
            ctx.req.body.username = ctx.req.body.mobile + "";
            ctx.req.body.password = ctx.req.body.mobile + "";

            next();
        });
        
    });

    // AppUser.observe('before save', function(ctx, next) {
        
    //     let userId = ctx.req.accessToken.userId;
    //     const filter = {
    //         where: {"id": userId}
    //     }
    //     AppUser.findOne(filter, function (err, queriedUser) {
    //         if(err) {
    //             cb(err);
    //         }

    //         ctx.req.body.companyId = queriedUser.companyId;
    //         ctx.req.body.username = ctx.req.body.mobile + "";
    //         ctx.req.body.password = ctx.req.body.mobile + "";

    //         return;
    //     });
    // });

    AppUser.afterRemote('create', function(ctx, AppUser, next) {
        if(ctx.req.body.role != undefined) {
            let role = ctx.req.body.role;
            setAppUserRole(role, AppUser.id, next);
        } else {
            next();
        }
    });


    
    AppUser.ImportUsers = function (ctx, options, cb) {
        const TAG = "#uploadProfilePicture: ";
        let AppUser = app.models.AppUser;
        let container = app.models.container;
        let userId;
        let companyId;

        let containerDir = "customers";
        userId = ctx.req.accessToken.userId;        

        let fileOptions = {
            container: containerDir,
            // getFilename will be called multiple times for each "part" of the form upload
            allowedContentTypes: ['application/vnd.ms-excel'],
            maxFileSize: 10000 * 1024, //10 MB
            getFilename: function (fileInfo, req, res) {
                let origFilename = fileInfo.name;
                // optimisticly get the extension
                let parts = origFilename.split('.'),
                    extension = parts[parts.length - 1];

                return 'import_users.csv';
            }
        };

        app.models.Manager.findById(userId, {}, function (error, manager) {
            if (error) {
                return cb(null, error);
            }

            companyId = manager.companyId;

            uploadCSV();
        });

        function uploadCSV() {

            container.upload(ctx.req, ctx.result, fileOptions, function (err, fileObj) {

                if (err) {
                    return cb(null, err);
                }
                if (fileObj.files === undefined) {
                    return cb(null, err);
                }

                insertDataToDb();
            });
        }

        function insertDataToDb() {
            
            const csvFilePath = process.cwd() + '/tmp/customers/import_users.csv';
            
            csv()
            .fromFile(csvFilePath)
            .then((users)=>{
                
                saveToDB(users);
            })            
        }

        function saveToDB(users) {

            let newUsers = [];

            users.forEach(user => {
                user.username = user.mobile;
                user.password = user.mobile;
                user.companyId = companyId;

                newUsers.push(user);
            });

            AppUser.create(newUsers, function(err, newCustomers) {
                if (err) {
                    return cb(err);
                }

                let usersRoles = [];

                newCustomers.forEach(customer => {
                    usersRoles.push({
                        principalType: "AppUser",
                        principalId: customer.id,
                        roleId: 1
                      });
                });  

                app.models.RoleMapping.create(usersRoles, function(err, roleMapping) {
                    if (err) {return console.log(err);}
                    
                    return cb(null, roleMapping);
                });

            });
        }

    };
    AppUser.remoteMethod(
        'ImportUsers',
        {
            description: 'import users',
            accepts: [
                {arg: 'ctx', type: 'object', http: {source: 'context'}},
                {"arg": "options", "type": "object", "http": { source: 'req' }}
            ],
            returns: {
                arg: 'object', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    );

    // AppUser.afterRemote('prototype.*', function(ctx, AppUser, next) {
        
    //     // if(ctx.req.body.roles != undefined && ctx.req.body.roles.length > 0) {
    //     //     let roles = ctx.req.body.roles;
    //     //     setAppUserRole(roles, AppUser.id, next);
    //     // } else {
    //     //     next();
    //     // }
    // });

    function setAppUserRole(role, AppUser_id, next) {

        app.models.Role.findOne({where: {'name': role}}, function (err, role) {
            if (err) {return console.log(err);}

            app.models.RoleMapping.create({
                principalType: 'AppUser',
                principalId: AppUser_id,
                roleId: role.id
            }, function(err, newRoles) {
                if (err) {return console.log(err);}
                next();
            });
        });
    }


    /**
     * Get all customers
     */
    AppUser.customers = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": userId}
        }
        app.models.Manager.findOne(outerFilter, function (err, queriedUser) {
            if(err) {
                cb(err);
            }
            
            // let paginationFilter = ctx.args.filter;
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
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            AppUser.find(innerFilter, function (err, customers) {
                if (err) {
                    return cb(err);
                }

                let resultCustomers = [];
                customers.forEach((customer, index) => {
                    customer = customer.toJSON();
                    if(customer.roles.length > 0) {
                        resultCustomers.push(customer);
                    }
                });

                cb(err, resultCustomers);
            })
        });
    };
    AppUser.remoteMethod('customers', {
        description: 'Get all customers',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Get all service users
     */
    AppUser.serviceUsers = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": userId}
        }
        app.models.Manager.findOne(outerFilter, function (err, queriedUser) {
            if(err) {
                cb(err);
            }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
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
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            AppUser.find(innerFilter, function (err, customers) {
                if (err) {
                    return cb(err);
                }

                let resultCustomers = [];
                customers.forEach((customer, index) => {
                    customer = customer.toJSON();
                    if(customer.roles.length > 0) {
                        resultCustomers.push(customer);
                    }
                });

                cb(err, resultCustomers);
            })
        });
    };
    AppUser.remoteMethod('serviceUsers', {
        description: 'Get all service users',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    /**
     * Get customer detail
     */
    AppUser.CustomerShow = function (ctx, customerId, cb) {
        
        // let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": customerId},
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
        AppUser.findOne(outerFilter, function (err, queriedUser) {
            if(err) {
                cb(err);
            }

            let result = {};
            let sumFactorAmount = 0;
            let sumPaidAmount = 0;

            queriedUser = queriedUser.toJSON();
            
            queriedUser.damages.forEach((damage, index) => {
                // damage = damage.toJSON();

                if(damage.factors !== undefined) {
                    sumFactorAmount += damage.factors.sumPrice;
                }

                if(damage.factors !== undefined && damage.factors.payments != undefined) {
                    damage.factors.payments.forEach((payment, index) => {
                        if(payment.status === 'accepted') {
                            sumPaidAmount += payment.price;
                        }
                    });
                }
            });

            result = {
                firstname: queriedUser.firstname,
                lastname: queriedUser.lastname,
                mobile: queriedUser.mobile,
                debt: sumFactorAmount - sumPaidAmount,
                paid: sumPaidAmount,
            }

            cb(err, result);
        });
    };
    AppUser.remoteMethod('CustomerShow', {
        description: 'Get customer detail',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {"arg": "id", "required": true, "type": "number", http: {source: 'path'}, description: 'customer id'}
        ],
        returns: {
            arg: 'res', type: 'Array', root: true
        },
        http: {path: '/CustomerShow/:id', verb: 'get'}
    });

    /**
     * Get all app users
     */
    AppUser.MyAppUsers = function (ctx, cb) {
        
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
            AppUser.find(innerFilter, function (err, myAppUsers) {
                if (err) {
                    return cb(err);
                }

                cb(err, myAppUsers);
            })
        });
    };
    AppUser.remoteMethod('MyAppUsers', {
        description: 'Get all app users',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    
    AppUser.loginAppUser = function (loginObject, cb) {

        var phoneNumber = loginObject.mobile;
        var credentials = {username: phoneNumber, password: phoneNumber};

        AppUser.login(credentials, null, function (error, loginInfo) {
            if (error) {
                return cb(null, error);
            }

            const userId = loginInfo.userId;
            var isRoleFound = false;
            AppUser.findById(userId, {"include": ["roles"]}, function (error, appUser) {
                var au = appUser.toJSON();
                var roles = au.roles;
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'customer' || roles[i].name === 'service') {
                        isRoleFound = true;
                        break;
                    }
                }
                if (isRoleFound) {

                    var code = Math.floor(Math.random() * (99999 - 10000)) + 10000;
                    AppUser.updateAll({id: userId}, {"verificationCode": code}, function (error, updatedAppUser) {
                        
                        let user = {};
                        user.id = appUser.id;

                        sms.sendVerificationCode(phoneNumber, code);
                        cb(null, user);
                    });

                } else {
                    //     message: "The User Hasn't Registered In " + userRole + " App!"
                    return cb(null, 'not found user');
                }
            });

        });

    };
    AppUser.remoteMethod('loginAppUser', {
            description: 'Login method that sends only userId',
            notes: ['{"mobile":"09171234567"}'],
            accepts: {arg: 'loginObject', type: 'object', required: true, http: {source: 'body'}},
            returns: {
                arg: 'accessToken', type: 'object', root: true,
                description: 'User Model'
            },
            http: {verb: 'post'}
        }
    );

    AppUser.checkVerification = function (verifyObject, cb) {
        var Role = app.models.Role;

        var AppUser = app.models.AppUser;

        var code = verifyObject.code;
        var userId = verifyObject.userId;
        var gcmId = verifyObject.gcmId;

        // var verifyFilter = {
        //     where: {
        //         appUserId: appUserId,
        //         code: code
        //     }
        // };
        // gcmInsert = {
        //     appUserId: appUserId,
        //     gcmId: gcmId,
        //     belongsToApp: belongsToApp
        // };

        // var gcmFilter = {
        //     appUserId: appUserId,
        //     belongsToApp: belongsToApp
        // };

        var response = {};
        AppUser.findOne({where: {and: [{verificationCode: code}, {id: userId}]}}, function (err, user) {
            if(err) {
                cb(err);
            }            

            if(user !== null) {

                var credentials = {username: user.mobile, password: user.mobile};
                AppUser.login(credentials, null, function (error, loginInfo) {
                    if (error) {
                        return cb(null, error);
                    }

                    cb(null, loginInfo);
                });

            } else {
                cb('wrong code');
            }
        })
        

    };

    AppUser.remoteMethod('checkVerification', {
        description: 'Check If Verification Code Is True',
        notes: ['{"appUserId":10,"code":"11111","gcmId":"sdfgdhfad"}'],
        accepts: {arg: 'verificationObject', type: 'object', http: {source: 'body'}},
        http: {verb: 'post'},
        returns: {root: true, type: 'object'}
    });


    /**
     * Get all buildings
     */
    AppUser.buildings = function (ctx, cb) {
        
        let userId = ctx.req.accessToken.userId;
        const outerFilter = {
            where: {"id": userId}
        }
        AppUser.findById(userId, function (err, queriedUser) {
            if(err) {
                cb(err);
            }
            
            // let paginationFilter = ctx.args.filter;
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
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            AppUser.find(innerFilter, function (err, customers) {
                if (err) {
                    return cb(err);
                }

                let resultCustomers = [];
                customers.forEach((customer, index) => {
                    customer = customer.toJSON();
                    if(customer.roles.length > 0) {
                        resultCustomers.push(customer);
                    }
                });

                cb(err, resultCustomers);
            })
        });
    };
    AppUser.remoteMethod('buildings', {
        description: 'Get all buildings',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });



    /**
     * Get all customer factors to pay
     */
    AppUser.customerFactorsToPay = function (ctx, cb) {
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
            }
        }
        
        app.models.Damage.find(filter, function (err, damages) {
            if(err) {
                return cb(err);
            }
            let result = [];
            damages.forEach(damage => {
                damage = damage.toJSON();
                if(damage.factors !== undefined) {
                    result.push(damage);
                }
            });

            cb(err, result);
        });
    };
    AppUser.remoteMethod('customerFactorsToPay', {
        description: 'Get all of factors of customer ready to pay',
        notes: [''],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}}
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
