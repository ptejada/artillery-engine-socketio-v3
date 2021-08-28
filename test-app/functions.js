'use strict';

// Starts the test server
require('./server')

module.exports = {
  setToken,
};

function setToken(context, userEvents, next) {
  context.extraHeaders = { 'x-auth-token': context.vars.token };
  return next();
}
