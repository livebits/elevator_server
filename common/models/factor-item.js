'use strict';

module.exports = function(FactorItem) {

    FactorItem.beforeRemote('create', function(ctx, unused, next) {
                
        ctx.req.body.total = ctx.req.body.quantity * ctx.req.body.unitPrice;

        next();
    });

    FactorItem.afterRemote('prototype.updateAttributes', function(ctx, factorItem, next) {
                
        ctx.req.body.total = ctx.req.body.quantity * ctx.req.body.unitPrice;
        console.log(ctx.req.body);
        
        next();
    });
};
