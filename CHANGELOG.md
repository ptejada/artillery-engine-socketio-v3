# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2023-06-10
### Added
- Added new `connect` action to provide greater control over WS connection during the scenario flow.

### Fixed
- Fixed bug disconnecting all sockets when forcing a new connection.

### Changes
- The connection to the Socket.IO server will be made only when needed instead of during staging phase for the scenario.
- Instead of tracking the Websocket messages with code 0 in the Summary of an execution it will now appear as 101.

### Deprecated

- Deprecates `scenario.flow.*.acknowledge.data`. Use `scenario.flow.*.acknowledge.data` instead.
- Deprecates `scenario.flow.*.emit.channel`. Equivalent to the first array element for `scenario.flow.*.emit`.
- Deprecates `scenario.flow.*.emit.data`. Equivalent to the second array element for `scenario.flow.*.emit`.
- Deprecates `scenario.flow.*.beforeRequest`. Use `scenario.flow.*.connect` instead to establish any new connection to
  server. For everything else use a standalone `scenario.flow.*.function` action.
- Deprecates `scenario.flow.*.response.data`. Use `scenario.flow.*.response.args` instead.
- Deprecates `scenario.flow.*.reconnect`. Instead use `scenario.flow.*.connect` to establish a new connection to server.

## [1.1.2] - 2021-08-29
### Added
- Compatability with Artillery v1.7+

## [1.1.1] - 2021-08-28
### Added
- Socket.IO v4 as a compatible version.

## [1.1.0] - 2021-08-28
### Fixed
- Bug capturing json value. By [@gruffT](https://github.com/gruffT)
 
### Added
- Reconnect to close all the sockets and force reconnection by the client. By [@gruffT](https://github.com/gruffT)
- Support to validate any event with any amount of exact arguments from the `response` with the new `on` + `args` option.
- Support for the `response` validator to use the `match` API.
- Support for configuring the Socket.IO client options under `config.engines.socketio-v3`
- `acknowledge.args` as an alias of `acknowledge.data`. This is used to match the exact params of the ack function.

[Unreleased]: https://github.com/ptejada/artillery-engine-socketio-v3/compare/v1.2.0...HEAD
[1.2.0]: https://github.com//ptejada/artillery-engine-socketio-v3/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com//ptejada/artillery-engine-socketio-v3/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com//ptejada/artillery-engine-socketio-v3/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com//ptejada/artillery-engine-socketio-v3/compare/v1.0.1...v1.1.0
