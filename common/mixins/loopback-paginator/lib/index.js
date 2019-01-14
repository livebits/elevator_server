'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _paginator = require('./paginator');

var _paginator2 = _interopRequireDefault(_paginator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _util.deprecate)(function (app) {
  app.loopback.modelBuilder.mixins.define('Paginator', _paginator2.default);
}, 'DEPRECATED: Use mixinSources, see https://github.com/prototype-berlin/loopback-paginator#server-config');


module.exports = exports.default;