'use strict';

module.exports = {
  setChatMessage,
  setHelloMessage
};

function setChatMessage(context, events, done) {
  context.vars.message = 'Hello World'

  done();
}

function setHelloMessage(context, events, done) {
  context.vars.message = 'Hello from Some Some Place'

  done()
}
