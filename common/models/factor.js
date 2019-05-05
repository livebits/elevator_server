'use strict';

var app = require('../../server/server');

module.exports = function(Factor) {

    /**
     * Get all reports
     */
    Factor.AllFactors = function (ctx, cb) {
        
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
            Factor.find(innerFilter, function (err, factors) {
                if (err) {
                    return cb(err);
                }                

                let resultFactors = [];
                factors.forEach((factorItem, index) => {
                    let fctr = factorItem.toJSON();
                    if(fctr.damage !== undefined && fctr.damage.appUser !== undefined) {
                        resultFactors.push(fctr);
                    }
                });

                cb(err, resultFactors);
            })
        });
    };
    Factor.remoteMethod('AllFactors', {
        description: 'Get all factors',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
