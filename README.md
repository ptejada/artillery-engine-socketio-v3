# artillery-engine-socketio-v3
Socket.IO v3 engine for Artillery

### Disclaimer
In addition to upgrading the Socket.IO lib to version 3 this engine also modifies the original YML API documented at 
[artillery.io](https://artillery.io/docs/guides/guides/socketio-reference.html#emit).

The `emit` action no longer supports all the other explicit options like `channel` and `data`. Instead, it will accept 
a list or array of arguments that will be passed to the Socket.IO `emit` function. Ex:   
```yml
scenarios:
  - engine: socketio-v3
    flow:
      - emit: ["join", "lobby"]
      # Also can be written as    
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

### Install & Configure

Install with npm

```
npm install -D artillery-engine-socketio-v3

OR

yarn add -D artillery-engine-socketio-v3
```

Enable the `socketio-v3` engine by listing it in `config.engines`. Ex:

```yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 30
      arrivalRate: 5
  engines:
   socketio-v3: {}
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
