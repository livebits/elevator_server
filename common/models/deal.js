'use strict';

var app = require('../../server/server');

module.exports = function(Deal) {

    /**
     * Get all customers
     */
    Deal.AllDeals = function (ctx, cb) {
        
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
            Deal.find(innerFilter, function (err, deals) {
                if (err) {
                    return cb(err);
                }

                let resultDeals = [];
                deals.forEach((deal, index) => {
                    deal = deal.toJSON();
                    if(deal.appUser != undefined) {
                        resultDeals.push(deal);
                    }
                });

                cb(err, resultDeals);
            })
        });
    };
    Deal.remoteMethod('AllDeals', {
        description: 'Get all deals',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
