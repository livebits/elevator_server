module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var AppUser = app.models.AppUser;
      ds.autoupdate('AppUser', function(er) {
        if (er) throw er;
        console.log('AppUser table updated in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
  };