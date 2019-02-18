module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var lbTables = [
      'Inspection'
    ];
      ds.automigrate(lbTables, function(er) {
        if (er) throw er;
        console.log('Migration tables [' - lbTables - '] created in ', ds.adapter.name);
      });
      next();
    },
    down: function(app, next) {
      
    }
};