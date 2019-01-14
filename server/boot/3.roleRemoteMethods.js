module.exports = function(app) {
    const Role = app.models.Role;
    Role.afterRemoteError('create', function(context, next) {
        let filter = {
            where: {
                name: context.req.body.name
            }
        };

        Role.find(filter, function (err, role) {
            if(role.length > 0) {
                context.error.code = 1001;
            }

            next();
        });
        
    });
};
  