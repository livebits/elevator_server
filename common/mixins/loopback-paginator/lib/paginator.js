'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _debug2 = require('./debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)();
var warn = (0, _debug3.default)(); // create a namespaced warning
warn.log = console.warn.bind(console); // eslint-disable-line no-console

var DEFAULT_LIMIT = 10;
var DEFAULT_MAX_LIMIT = 100;
var DEFAUL_NO_MAX_LIMIT = false;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(Model) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var modifyFilter, getLimit;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            getLimit = function getLimit(filter) {
              if (filter && filter.limit) {
                var limit = parseInt(filter.limit);

                if (options.maxLimit && !options.noMaxLimit) {
                  limit = limit > options.maxLimit ? options.maxLimit : limit;
                }

                return limit;
              }

              return options.limit;
            };

            modifyFilter = function modifyFilter(filter, page) {
              var limit = getLimit(filter);
              var skip = (page - 1) * limit;

              if (!filter) {
                filter = {
                  skip: skip,
                  limit: limit
                };
                return filter;
              }

              filter.skip = skip;
              filter.limit = limit;

              return filter;
            };

            debug('Pagintor mixin for model %s', Model.modelName);

            Model.getApp(function (error, app) {
              if (error) {
                debug('Error getting app: ' + error);
              }

              var globalOptions = app.get('paginator') || {};
              options.limit = options.limit || globalOptions.limit || DEFAULT_LIMIT;
              options.maxLimit = options.maxLimit || globalOptions.maxLimit || DEFAULT_MAX_LIMIT;
              options.noMaxLimit = options.noMaxLimit || globalOptions.noMaxLimit || DEFAUL_NO_MAX_LIMIT;
            });

            Model.beforeRemote('find', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {
                var page;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        page = context.req.query.page || 1;

                        context.args.filter = modifyFilter(context.args.filter, page);

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

            Model.beforeRemote('getAll', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {
                var page;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        page = context.req.query.page || 1;
                        
                        context.args.filter = modifyFilter(context.args.filter, page);

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

            Model.beforeRemote('getPayments', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {
                var page;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        page = context.req.query.page || 1;

                        context.args.filter = modifyFilter(context.args.filter, page);

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

            Model.beforeRemote('getMessages', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {
                var page;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        page = context.req.query.page || 1;

                        context.args.filter = modifyFilter(context.args.filter, page);

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

            Model.beforeRemote('__get__requests', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {
                var page;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        page = context.req.query.page || 1;

                        context.args.filter = modifyFilter(context.args.filter, page);

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

            
            Model.afterRemote('find', function () {
              
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {
                var limit, where, totalItemCount, totalPageCount, currentPage, previousPage, nextPage;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        limit = getLimit(context.args.filter);
                        where = context.args.filter.where || null;
                        _context2.next = 4;
                        return Model.count(where);

                      case 4:
                        totalItemCount = _context2.sent;
                        totalPageCount = Math.ceil(totalItemCount / limit);
                        currentPage = parseInt(context.req.query.page) || 1;
                        previousPage = currentPage - 1;
                        nextPage = currentPage + 1;


                        context.result = {
                          data: context.result,
                          meta: {
                            totalItemCount: totalItemCount,
                            totalPageCount: totalPageCount,
                            itemsPerPage: limit,
                            currentPage: currentPage
                          }
                        };

                        if (nextPage <= totalPageCount) {
                          context.result.meta.nextPage = nextPage;
                        }

                        if (previousPage > 0) {
                          context.result.meta.previousPage = previousPage;
                        }

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

            Model.afterRemote('getAll', function () {
              
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {
                var limit, where, totalItemCount, totalPageCount, currentPage, previousPage, nextPage;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                      
                        limit = getLimit(context.args.filter);
                        where = context.args.filter.where || null;
                        _context2.next = 4;
                        return Model.count(where);

                      case 4:
                        totalItemCount = _context2.sent;
                        totalPageCount = Math.ceil(totalItemCount / limit);
                        currentPage = parseInt(context.req.query.page) || 1;
                        previousPage = currentPage - 1;
                        nextPage = currentPage + 1;


                        context.result = {
                          data: context.result,
                          meta: {
                            totalItemCount: totalItemCount,
                            totalPageCount: totalPageCount,
                            itemsPerPage: limit,
                            currentPage: currentPage
                          }
                        };

                        if (nextPage <= totalPageCount) {
                          context.result.meta.nextPage = nextPage;
                        }

                        if (previousPage > 0) {
                          context.result.meta.previousPage = previousPage;
                        }

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

            Model.afterRemote('getPayments', function () {
              
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {
                var limit, where, totalItemCount, totalPageCount, currentPage, previousPage, nextPage;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        limit = getLimit(context.args.filter);
                        where = context.args.filter.where || null;
                        _context2.next = 4;                        
                        return Model.count(where);

                      case 4:
                        totalItemCount = _context2.sent;
                        totalPageCount = Math.ceil(totalItemCount / limit);
                        currentPage = parseInt(context.req.query.page) || 1;
                        previousPage = currentPage - 1;
                        nextPage = currentPage + 1;


                        context.result = {
                          data: context.result,
                          meta: {
                            totalItemCount: totalItemCount,
                            totalPageCount: totalPageCount,
                            itemsPerPage: limit,
                            currentPage: currentPage
                          }
                        };

                        if (nextPage <= totalPageCount) {
                          context.result.meta.nextPage = nextPage;
                        }

                        if (previousPage > 0) {
                          context.result.meta.previousPage = previousPage;
                        }

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

            Model.afterRemote('getMessages', function () {
              
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {
                var limit, where, totalItemCount, totalPageCount, currentPage, previousPage, nextPage;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        limit = getLimit(context.args.filter);
                        where = context.args.filter.where || null;
                        _context2.next = 4;                        
                        return Model.count(where);

                      case 4:
                        totalItemCount = _context2.sent;
                        totalPageCount = Math.ceil(totalItemCount / limit);
                        currentPage = parseInt(context.req.query.page) || 1;
                        previousPage = currentPage - 1;
                        nextPage = currentPage + 1;


                        context.result = {
                          data: context.result,
                          meta: {
                            totalItemCount: totalItemCount,
                            totalPageCount: totalPageCount,
                            itemsPerPage: limit,
                            currentPage: currentPage
                          }
                        };

                        if (nextPage <= totalPageCount) {
                          context.result.meta.nextPage = nextPage;
                        }

                        if (previousPage > 0) {
                          context.result.meta.previousPage = previousPage;
                        }

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

            Model.afterRemote('__get__requests', function () {

              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {
                var limit, where, totalItemCount, totalPageCount, currentPage, previousPage, nextPage;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        limit = getLimit(context.args.filter);
                        where = context.args.filter.where || null;
                        _context2.next = 4;
                        
                        return Model.count(where);

                      case 4:
                        totalItemCount = _context2.sent;
                        totalPageCount = Math.ceil(totalItemCount / limit);
                        currentPage = parseInt(context.req.query.page) || 1;
                        previousPage = currentPage - 1;
                        nextPage = currentPage + 1;


                        context.result = {
                          data: context.result,
                          meta: {
                            totalItemCount: totalItemCount,
                            totalPageCount: totalPageCount,
                            itemsPerPage: limit,
                            currentPage: currentPage
                          }
                        };

                        if (nextPage <= totalPageCount) {
                          context.result.meta.nextPage = nextPage;
                        }

                        if (previousPage > 0) {
                          context.result.meta.previousPage = previousPage;
                        }

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;