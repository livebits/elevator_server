module.exports = {
    up: function(app, next) {
      var ds = app.dataSources.db;
      var lbTables = [
      'MyAccessToken',
      'Manager',
      'AppUser',
      'Comment',
      'Company',
      'Damage',
      'DealPayment',
      'Deal',
      'FactorItem',
      'FactorPayment',
      'Factor',
      'Payment',
      'Report',
      'ServiceSchedule',
      'Settings',
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