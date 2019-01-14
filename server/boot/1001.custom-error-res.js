module.exports = function (app) {

    var remotes = app.remotes();

    remotes.options.rest = remotes.options.rest || {};
    // remotes.options.rest.handleErrors = false;
    // app.middleware('final', FinalErrorHandler);

    function FinalErrorHandler(err, req, res, next) {
        if (err) {
            console.log(err);
            // if (res.statusCode != 200) {
                if(err.statusCode == undefined) {
                    res.send({
                        statusCode: 500,
                        code: 500,
                        data: {},
                        error: true,
                        errors: {}
                    }).end();

                } else {
                    res.status(err.statusCode).send({
                        statusCode: err.statusCode,
                        code: err.code, 
                        data: {},
                        error: true,
                        errors: err
                    }).end();
                }
                
            // }
        }
        next();
    }
};