'use strict';

module.exports = function(FactorItem) {

    FactorItem.beforeRemote('create', function(ctx, unused, next) {
                
        ctx.req.body.total = ctx.req.body.quantity * ctx.req.body.unitPrice;

        next();
    });
};
