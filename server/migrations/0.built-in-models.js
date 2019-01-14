module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var lbTables = ['AccessToken', 'ACL', 'RoleMapping', 'Role'];
      ds.automigrate(lbTables, function(er) {
        if (er) throw er;
        console.log('Migration tables [' - lbTables - '] created in ', ds.adapter.name);
        // ds.disconnect();
      });
      next();
    },
    down: function(app, next) {
      
    }
  };