module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var Report = app.models.Report;
      ds.autoupdate('Report', function(er) {
        if (er) throw er;
        console.log('Report table updated in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
  };