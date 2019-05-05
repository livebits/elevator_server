'use strict';

var app = require('../../server/server');

module.exports = function(Report) {

    /**
     * Get all reports
     */
    Report.AllReports = function (ctx, cb) {
        
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
            Report.find(innerFilter, function (err, reports) {
                if (err) {
                    return cb(err);
                }                

                let resultReports = [];
                reports.forEach((reportItem, index) => {
                    let rpt = reportItem.toJSON();
                    if(rpt.damage !== undefined && rpt.damage.appUser !== undefined) {
                        resultReports.push(rpt);
                    }
                });

                cb(err, resultReports);
            })
        });
    };
    Report.remoteMethod('AllReports', {
        description: 'Get all reports',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });
};
