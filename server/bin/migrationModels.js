var server = require('../server');
var ds = server.dataSources.db;
var lbTables = ['Migration', 'MigrationMap'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Migration tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});