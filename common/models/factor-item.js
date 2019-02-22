'use strict';
var app = require('../../server/server');

module.exports = function(FactorItem) {

    FactorItem.beforeRemote('create', function(ctx, unused, next) {
        console.log("before create");
        
        ctx.req.body.total = ctx.req.body.quantity * ctx.req.body.unitPrice;

        next();
    });
    
    FactorItem.afterRemote('create', function(ctx, unused, next) {
            console.log("after create");
            
            //update factor
            FactorItem.find({where: {factorId: ctx.req.body.factorId}}, function (err, facotorItems) {
                
                let sum = 0;
                facotorItems.forEach(item => {
                    sum += (item.quantity * item.unitPrice)
                });

                app.models.Factor.updateAll({id: ctx.req.body.factorId}, {sumPrice: sum}, function (err, factors) {
                    if (err) {
                        return cb(err);
                    }                
        
                    next();
                })
        
            });
    });

    FactorItem.afterRemote('prototype.patchAttributes', function(ctx, factorItem, next) {
        
        ctx.req.body.total = ctx.req.body.quantity * ctx.req.body.unitPrice;

        //update factor
        FactorItem.find({where: {factorId: ctx.req.body.factorId}}, function (err, facotorItems) {
            
            let sum = 0;
            facotorItems.forEach(item => {
                sum += (item.quantity * item.unitPrice)
            });

            app.models.Factor.updateAll({id: ctx.req.body.factorId}, {sumPrice: sum}, function (err, factors) {
                if (err) {
                    return cb(err);
                }                
    
                next();
            })
    
        });
        
        
    });
};
