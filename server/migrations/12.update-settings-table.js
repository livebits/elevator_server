module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var Settings = app.models.Settings;
      ds.autoupdate('Settings', function(er) {
        if (er) throw er;
        console.log('Settings table updated in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
  };