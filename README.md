# artillery-engine-socketio-v3
Socket.IO v3 engine for Artillery

### Disclaimer
In addition to upgrading the Socket.IO lib to version 3 this engine also modifies the original the YML API documented at 
[artillery.io](https://artillery.io/docs/guides/guides/socketio-reference.html#emit).

The `emit` action no longer supports all the other explicit options like `channel` and `data`. Instead, it will accept 
a list of array of arguments that will be passed to the Socket.IO `emit` function. Ex:   
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
