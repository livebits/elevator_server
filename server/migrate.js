const app = require('./server');
const Migrate = app.models.Migration;

Migrate.migrate('up', function(err) {});