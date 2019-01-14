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
};
