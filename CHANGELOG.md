# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Bug capturing json value. By [@gruffT](https://github.com/gruffT)
 
### Added
- Reconnect to close all socket and force reconnection by the client. By [@gruffT](https://github.com/gruffT)
- Support to validate any event with any amount of exact arguments from the `response` with the new `on` + `args` option.
- Support for the `response` validator to use the `match` API.
- Support for configuring the Socket.IO client options under `config.engines.socketio-v3`
- `acknowledge.args` as alias of `acknowledge.data`. This is used match the exact params of tha ack function.

[Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.0.1...HEAD
[1.1.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.1.0...v1.0.1
