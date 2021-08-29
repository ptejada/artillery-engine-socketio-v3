# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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

[Unreleased]: https://github.com/ptejada/artillery-engine-socketio-v3/compare/v1.1.1...HEAD
[1.1.1]: https://github.com//ptejada/artillery-engine-socketio-v3/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com//ptejada/artillery-engine-socketio-v3/compare/v1.0.1...v1.1.0
