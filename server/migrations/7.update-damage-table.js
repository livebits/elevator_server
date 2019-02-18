module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var Damage = app.models.Damage;
      ds.autoupdate('Damage', function(er) {
        if (er) throw er;
        console.log('Damage table updated in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
  };