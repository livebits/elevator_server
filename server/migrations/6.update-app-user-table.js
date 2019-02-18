module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var Message = app.models.Inspection;
      ds.autoupdate('Message', function(er) {
        if (er) throw er;
        console.log('Message table updated in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
  };