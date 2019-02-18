module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var Inspection = app.models.Inspection;
      ds.autoupdate('Inspection', function(er) {
        if (er) throw er;
        console.log('Inspection table updated in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
  };