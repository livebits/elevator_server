'use strict';
var moment = require('moment-jalaali');

module.exports = function(Inspection) {

    Inspection.show = function (ctx, filter, cb) {

        let filterObject = filter.filter;

            let whereFilter = {};
            let now = new Date();
            now = now.toLocaleString();

            if(filterObject.status === "expired") {
                whereFilter = {
                    and: [
                        {
                            serviceId: null
                        },
                        {
                            customerId: filterObject.customerId
                        }
                    ]
                }
            } else {
                whereFilter = {
                    and: [
                        {
                            serviceId: {neq: null},
                        },
                        {
                            customerId: filterObject.customerId
                        }
                    ]
                }
            }
            
            // let paginationFilter = ctx.args.filter;
            let innerFilter = {
                where: whereFilter,
                include: [ "appUser", "serviceUser"],
            //  limit: paginationFilter.limit,
            //  skip: paginationFilter.skip
            };
            console.log(JSON.stringify(innerFilter));
            
            Inspection.find(innerFilter, function (err, inspections) {
                if (err) {
                    return cb(err);
                }

                let result = [];
                let currentDate = new Date();
                inspections.forEach((inspection, index) => {
                    inspection = inspection.toJSON();

                    let inspectionDate = moment( inspection.year + '/' + inspection.month + '/' + currentDate.getDate(), 'jYYYY/jM/jD').format('YYYY-MM-DD');
                    inspectionDate = inspectionDate.split("-");

                    let insDate = new Date();
                    insDate.setFullYear(inspectionDate[0])
                    insDate.setMonth(inspectionDate[1] - 1)
                    insDate.setDate(inspectionDate[2])
                    
                    // inspectionDate.setMonth(inspection.month-1)
                    // inspectionDate.setFullYear(inspection.year)
                    
                    if(filterObject.status === "expired"){
                        if(insDate <= currentDate) {
                            result.push(inspection);
                        }
                    } else {
                        result.push(inspection);
                    }
                    
                });

                cb(err, result);
            })
        // });
    };
    Inspection.remoteMethod('show', {
        description: 'Show customer inspections',
        notes: ['only authenticated users can use'],
        accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'filter', type: 'Object', http: {source: 'query'}},
        ],
        returns: {root: 'true', type: 'array'},
        http: {verb: 'get'}
    });

    Inspection.addNew = function (inspectionObject, cb) {
        
        let startDate = inspectionObject.doneTime.split("T")[0];
        startDate = moment(startDate, 'YYYY-M-D').format('jYYYY-jM-jD')
        startDate = startDate.split("-");

        let where = {
            where: {
                and: [
                    {
                        customerId: inspectionObject.appUserId,
                    },
                    {
                        year: startDate[0]
                    },
                    {
                        month: startDate[1]
                    }
                ]
            }
        }
        console.log(JSON.stringify(where));
        
        Inspection.findOne(where, function (err, inspection) {
            if(err) {
                return cb(err);
            }
            console.log(inspection);
            
            if(inspection) {

                inspection.updateAttributes({
                    doneTime: inspectionObject.doneTime,
                    serviceId: inspectionObject.serviceId, 
                    description: inspectionObject.description}, function (err, updatedInspection) {
                    if(err) {
                        return cb(err);
                    }
    
                    cb(null, updatedInspection);
                })
            } else {
                cb(null, inspectionObject);
            }
            
        })
        
    };
    Inspection.remoteMethod('addNew', {
        description: 'Add elevator inspection',
        accepts: {arg: 'inspectionObject', type: 'object', http: {source: 'body'}},
        http: {verb: 'post'},
        returns: {root: true, type: 'object'}
    });
};
