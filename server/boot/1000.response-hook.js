module.exports = function (app) {
    var remotes = app.remotes();
    // modify all returned values
    // remotes.after('**', function (ctx, next) {
    //     if (ctx.result) {
    //         ctx.result = {
    //             statusCode: 200,
    //             code: 200,
    //             data: ctx.result,
    //             message: "Success",
    //             error: false
    //         };
    //     }
    //     next();
    // });

    // remotes.afterError('**', function(ctx, next){
    //     ctx.error = {
    //         code: ctx.error.code,
    //         statusCode: ctx.error.statusCode,
    //         error: true,
    //         errors: [{
    //             message: ctx.error.message
    //         }],
    //         data: []
    //     };
        
    //     next(ctx.error);
    // });
    
    };