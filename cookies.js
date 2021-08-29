'use strict'

var tough = require('tough-cookie')

var CookieJar = tough.CookieJar

// Adapt the sometimes-Async api of tough.CookieJar to our requirements
function RequestJar (store) {
  var self = this
  self._jar = new CookieJar(store, {looseMode: true})
}
RequestJar.prototype.setCookie = function (cookieOrStr, uri, options) {
  var self = this
  return self._jar.setCookieSync(cookieOrStr, uri, options || {})
}
RequestJar.prototype.getCookieString = function (uri) {
  var self = this
  return self._jar.getCookieStringSync(uri)
}
RequestJar.prototype.getCookies = function (uri) {
  var self = this
  return self._jar.getCookiesSync(uri)
}

exports.jar = function (store) {
  return new RequestJar(store)
}
