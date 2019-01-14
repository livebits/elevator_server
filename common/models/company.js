'use strict';

var app = require('../../server/server');

module.exports = function(Company) {

    /**
     * Get company payments detail
     */
    Company.CompanyShow = function (ctx, cb) {
        
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

                let result = {};
                let sumFactorAmount = 0;
                let sumPaidAmount = 0;
                let creditorAmount = 0;
                
                queriedUsers.forEach(queriedUser => {
                    queriedUser = queriedUser.toJSON();
                    
                    queriedUser.damages.forEach((damage, index) => {
    
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
                });

                result = {
                    creditor: sumFactorAmount - sumPaidAmount,
                    factors: sumFactorAmount,
                    paid: sumPaidAmount,
                }

                cb(err, result);
            });
        });
    };
    Company.remoteMethod('CompanyShow', {
        description: 'Get company detail',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {
            arg: 'res', type: 'Array', root: true
        },
        http: {path: '/CompanyShow', verb: 'get'}
    });
};
