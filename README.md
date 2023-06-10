# artillery-engine-socketio-v3
[![npm version](https://badge.fury.io/js/artillery-engine-socketio-v3.svg)](https://badge.fury.io/js/artillery-engine-socketio-v3)
[![Test App](https://github.com/ptejada/artillery-engine-socketio-v3/actions/workflows/test-app.yml/badge.svg)](https://github.com/ptejada/artillery-engine-socketio-v3/actions/workflows/test-app.yml)

Socket.IO v3 & v4 engine for Artillery.

### Disclaimer
In addition to upgrading the Socket.IO lib to version 3/4 this engine also modifies the original YML API documented at 
[artillery.io](https://artillery.io/docs/guides/guides/socketio-reference.html#emit).

The `emit` action no longer supports the explicit options `channel` and `data`. Instead, it will accept 
a list or array of arguments that will be passed to the Socket.IO `emit` function. Ex:
```yml
scenarios:
  - engine: socketio-v3
    flow:
      - emit: ["join", "lobby"]
      # It can also can be written as
      - emit:
        - join
        - lobby
```

All other advance options like `namespace` and `acknowledge` can still be included alongside the `emit` action but not 
under it. Ex:

```yml
scenarios:
  - engine: socketio-v3
    flow:
      - emit: ["join", "lobby"]
        namespace: /nsp1
```

# Table of Contents
1. [Install & Configure](#install--configure)
2. [Available Engine Options](#available-engine-options)
3. [Example Scenario](#example-scenario)
   - [Use MsgPack parser](#use-msgpack-parser)
   - [Authentication via Auth](#authentication-via-auth)
   - [Authentication via Headers](#authentication-via-headers)
4. [Changelog](#changelog)
4. [Roadmap](#roadmap)

### Install & Configure

Install with npm

```bash
npm install -D artillery-engine-socketio-v3
```

Install with yarn
```bash
yarn add -D artillery-engine-socketio-v3
```

Enable the `socketio-v3` engine by listing it in `config.engines`. Ex:

```yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 5
      arrivalRate: 1
  engines:
   socketio-v3: {}
```

You may set Socket.IO client options in `config.engines.socketio-v3`. Ex:
```yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 5
      arrivalRate: 1
  engines:
    socketio-v3:
      query:
        token: secret-token
```
In each scenario you must list the engine `socketio-v3` as well. Ex:
```yml
scenarios:
  - name: My first scenario
    engine: socketio-v3
    flow:
      - emit: ["join", "lobby"]
      - emit: ["message", "lobby", "Hello World"]  
```

### Available Engine Options

| Option                                  | Description                                                                                                                                                          |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config.socketio.*`                     | Set any Socket.IO [Client options].                                                                                                                                  |
| `scenario.flow.*.emit`                  | Array of arguments to send to the server. The first item in the list is usually referred as the event name while everything else following are additional arguments. |
| `scenario.flow.*.connect`               | Overwrites any [Client options] from `config.socketio.*` and starts a new Socket.IO connection.                                                                      |
| `scenario.flow.*.namespace`             | Optional Socket.IO namespace to use alongside `emit` and `connect`.                                                                                                  |
| `scenario.flow.*.response`              | Object defining how to handle a following event following for an `emit` action.                                                                                      |
| `scenario.flow.*.response.on`           | The name of the event to listen to.                                                                                                                                  |
| `scenario.flow.*.response.capture`      | Define logic to capture or remember a value from the event. This can be object or an array of objects.                                                               |
| `scenario.flow.*.response.capture.json` | JSON path to capture or remember. Ex `$.0.token` reference token in this document `[{"token": "..."}]`.                                                              |
| `scenario.flow.*.response.capture.as`   | The name how the captured value will be remembered as.                                                                                                               |
| `scenario.flow.*.response.args`         | Assert the response asserts the object defined in this option.                                                                                                       |
| `scenario.flow.*.response.match`        | Asserts the response match specific values from a json document. This can be an object or an array of objects.                                                       |
| `scenario.flow.*.response.match.json`   | JSON path to read the expected value from.                                                                                                                           |
| `scenario.flow.*.response.match.value`  | The expected value at the JSON path.                                                                                                                                 |
| `scenario.flow.*.acknowledge`           | An object defining how to handle an `ack` response from Socket.IO                                                                                                    |
| `scenario.flow.*.acknowledge.args`      | Has the same behavior as `scenario.flow.*.response.args`.                                                                                                            |
| `scenario.flow.*.acknowledge.capture`   | Accepts same options as `scenario.flow.*.response.capture`.                                                                                                          |
| `scenario.flow.*.acknowledge.match`     | Accepts same options as `scenario.flow.*.response.match`.                                                                                                            |
| `scenario.flow.*.think`                 | Number of seconds to wait.                                                                                                                                           |
| `scenario.flow.*.jitter`                | Option to be used with `think`. This option expects a value in milliseconds serves as random +- to offset the original `think` value                                 |
| `scenario.flow.*.get`                   | Performs an HTTP GET request. See [Testing HTTP] for more info.                                                                                                      |
| `scenario.flow.*.post`                  | Performs an HTTP POST request. See [Testing HTTP] for more info.                                                                                                     |
| `scenario.flow.*.acknowledge.data`      | \[DEPRECATED] Use `args` instead.                                                                                                                                    |
| `scenario.flow.*.emit.channel`          | \[DEPRECATED] Equivalent to `emit[0]`.                                                                                                                               |
| `scenario.flow.*.emit.data`             | \[DEPRECATED] Equivalent to `emit[1]`.                                                                                                                               |
| `scenario.flow.*.beforeRequest`         | \[DEPRECATED] Use `connect` instead to establish any new connection to server. For everything else use a standalone `function` action.                               |
| `scenario.flow.*.response.data`         | \[DEPRECATED] Use `args` instead.                                                                                                                                    |
| `scenario.flow.*.reconnect`             | \[DEPRECATED] Instead use `connect` to establish a new connection to server.                                                                                         |

### Example Scenario

#### Use MsgPack parser
If your Socket.IO server uses [socket.io-msgpack-parser](https://github.com/socketio/socket.io-msgpack-parser) then you will need to enable the client side parser as well. 

1. Install the NPM package `socket.io-msgpack-parser`.
2. Set `config.engines.socketio-v3.parser` to `msgpack`.

Example:
```yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 5
      arrivalRate: 1
  engines:
    socketio-v3:
      parser: msgpack
      query:
        token: secret-token
```

#### Authentication via Auth

Socket.IO recommends all connection authentication to be made using the `auth` option. There are two ways an auth  
connection can establish:

1. Using a static value that applies to all connections.
2. Using dynamic values that can vary by scenario or step.

To use a static auth value simply configure the static values in `config.engines.socketio-v3.auth`
Example:
```yml
config:
  engines:
    socketio-v3:
      auth:
        token: secret-token
```

To use dynamic `auth` values use the `connect` action. This will allow you to interpolate values from the context or 
inline variables.

Inline variables Example:
```yml
config:
  variables:
    token:
      - token1
      - token2
      - token3
scenarios:
  flow:
    - connect:
        auth:
          token: "{{token}}"
```

External auth HTTP service example:
```yml
scenarios:
  flow:
    - get:
        url: "URL TO AUTH SERVICE"
        capture:
          json: "$.token"
          as: "token"
    - connect:
        auth:
          token: "{{token}}"
```

Generate values from processor functions:
```yml
config:
  processor: "functions.js"
scenarios:
  flow:
    - function: "generateToken"
    - connect:
        auth:
          token: "{{token}}"
```
```js
// functions.js
module.exports = {
  generateToken,
};

function generateToken(context, userEvents, next) {
  context.vars.token = new Date().getTime().toString(20) // Obiously not secured and only used for simplicity  
  return next();
}
```

This last example is very powerful since you can really leverage this to get the `auth` values however you want. You can
perform your own custom HTTP requests from processor functions.

#### Authentication via Headers

The same static and dynamic principles from [Authentication via Auth](#authentication-via-headers) applies here.
The only thing that changes is the config option been used.

Example:
```yml
config:
  engines:
    socketio-v3:
      extraHeaders:
        Authorization: secret-token
```

Inline variables Example:
```yml
config:
  variables:
    token:
      - token1
      - token2
      - token3
scenarios:
  flow:
    - connect:
        extraHeaders:
          Authorization: "Basic {{token}}"
```

### Changelog
[Changelog](CHANGELOG.md)

### Roadmap
[Roadmap board](https://github.com/ptejada/artillery-engine-socketio-v3/projects/2)

[Client options]: https://socket.io/docs/v4/client-options/
[Testing HTTP]: https://www.artillery.io/docs/guides/guides/http-reference
[1.1.2 Docs]: https://github.com/ptejada/artillery-engine-socketio-v3/tree/v1.1.2
