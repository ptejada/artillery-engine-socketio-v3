# artillery-engine-socketio-v3
[![npm version](https://badge.fury.io/js/artillery-engine-socketio-v3.svg)](https://badge.fury.io/js/artillery-engine-socketio-v3)
[![Test App](https://github.com/ptejada/artillery-engine-socketio-v3/actions/workflows/test-app.yml/badge.svg)](https://github.com/ptejada/artillery-engine-socketio-v3/actions/workflows/test-app.yml)

Socket.IO v3 & v4 engine for Artillery

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

### Socket.IO v3 Engine Options

| Option                                  | Description                                                                                                                                                          |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config.socketio.*`                     | Set any Socket.IO [Client options].                                                                                                                                  |
| `scenario.flow.*.emit`                  | Array of arguments to send to the server. The first item in the list is usually referred as the event name while everything else following are additional arguments. |
| `scenario.flow.*.emit.channel`          | \[DEPRECATED] Equivalent to `emit[0]`.                                                                                                                               |
| `scenario.flow.*.emit.data`             | \[DEPRECATED] Equivalent to `emit[1]`.                                                                                                                               |
| `scenatio.flow.*.connect`               | Overwrites any [Client options] from `config.socketio.*` and starts a new Socket.IO connection.                                                                      |
| `scenatio.flow.*.namespace`             | Optional Socket.IO namespace to use alongside `emit` and `connect`.                                                                                                  |
| `scenatio.flow.*.response`              | Object defining how to handle a following event following for an `emit` action.                                                                                      |
| `scenatio.flow.*.response.on`           | The name of the event to listen to.                                                                                                                                  |
| `scenatio.flow.*.response.capture`      | Define logic to capture or remember a value from the event. This can be object or an array of objects.                                                               |
| `scenatio.flow.*.response.capture.json` | JSON path to capture or remember. Ex `$.0.token` reference token in this document `[{"token": "..."}]`.                                                              |
| `scenatio.flow.*.response.capture.as`   | The name how the captured value will be remembered as.                                                                                                               |
| `scenatio.flow.*.response.args`         | Assert the response asserts the object defined in this option.                                                                                                       |
| `scenatio.flow.*.response.data`         | \[DEPRECATED] Use `args` instead.                                                                                                                                    |
| `scenatio.flow.*.response.match`        | Asserts the response match specific values from a json document. This can be an object or an array of objects.                                                       |
| `scenatio.flow.*.response.match.json`   | JSON path to read the expected value from.                                                                                                                           |
| `scenatio.flow.*.response.match.value`  | The expected value at the JSON path.                                                                                                                                 |
| `scenatio.flow.*.acknowledge`           | An object defining how to handle an `ack` response from Socket.IO                                                                                                    |
| `scenatio.flow.*.acknowledge.args`      | Has the same behavior as `scenatio.flow.*.response.args`.                                                                                                            |
| `scenatio.flow.*.acknowledge.data`      | \[DEPRECATED] Use `args` instead.                                                                                                                                    |
| `scenatio.flow.*.acknowledge.capture`   | Accepts same options as `scenatio.flow.*.response.capture`.                                                                                                          |
| `scenatio.flow.*.acknowledge.match`     | Accepts same options as `scenatio.flow.*.response.match`.                                                                                                            |
| `scenatio.flow.*.think`                 | Number of seconds to wait.                                                                                                                                           |
| `scenatio.flow.*.jitter`                | Option to be used with `think`. This option expects a value in milliseconds serves as random +- to offset the original `think` value                                 |
| `scenatio.flow.*.get`                   | Performs an HTTP GET request. See [Testing HTTP] for more info.                                                                                                      |
| `scenatio.flow.*.post`                  | Performs an HTTP POST request. See [Testing HTTP] for more info.                                                                                                     |

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
If you have [socket.io-msgpack-parser](https://github.com/socketio/socket.io-msgpack-parser) enabled on your server, you need to enable this parser by setting `parser` option to `msgpack`: 


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

In each scenario you must list the engine `socketio-v3` as well. Ex:
```yml
scenarios:
  - name: My first scenario
    engine: socketio-v3
    flow:
      - emit: ["join", "lobby"]
      - emit: ["message", "lobby", "Hello World"]  
```

### Testing socket connection and re-connections

Respects `beforeRequest` custom function hook which is fired before emit
```yml
config:
  processor: "./someFileWithSomeFunction.js"
scenarios:
  - engine: socketio-v3
    flow:
      - emit: ["join", "lobby"]
        beforeRequest: "someFunction"
```
someFileWithSomeFunction.js
```js
function someFunction(requestParams, context, userEvents, next) {
  // do something
  return next();
}
```

There is an option `reconnect` which can be used to force a socket reconnection before emit is fired.
Use together with setting `extraHeaders` on the context object to enable login flows.
```yml
config:
  processor: "./processor.js"
scenarios:
  - engine: socketio-v3
    flow:
      - emit: ["login", { username: "creds", password: "secretPword" }]
        response:
          on: "success"
          capture:
            json: "$.token"
            as: "token"
      - function: "setToken"
      - emit: ["join", "lobby"]
        reconnect: true
        namespace: /authorisedNamespace
```

processor.js
```js
function setToken(context, userEvents, next) {
  context.extraHeaders = { 'x-auth-token': context.vars.token };
  return next();  
}
```
### Changelog
[Changelog](CHANGELOG.md)

### Roadmap
[Roadmap board](https://github.com/ptejada/artillery-engine-socketio-v3/projects/2)

[Client options]: https://socket.io/docs/v4/client-options/
[Testing HTTP]: https://www.artillery.io/docs/guides/guides/http-reference
