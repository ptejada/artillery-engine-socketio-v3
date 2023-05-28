const httpServer = require('http').createServer(requestListener)
const io = require('socket.io')(httpServer);
const crypto = require('crypto');

httpServer.listen(process.env.SERVER_PORT)

io.on('connection', function(socket) {
  socket.on('join', (channel) => {
    socket.join(channel)
    socket.emit('joined', `Welcome to ${channel}`)
  })

  socket.on('message', (channel, message) => {
    io.in(channel).emit('message', channel, message)
  })
});

io.of('secured').on('connection', function(socket) {
  socket.on('login', function({username, password}) {
    if (username === password) {
      socket.emit('success', {token: makeToken()})
    }
  })

  socket.on('join', (channel, joined) => {
    let allowed = false;
    if (tokens.indexOf(socket.request.headers['x-auth-token']) > -1) {
      socket.join(channel)
      socket.emit('joined', `Welcome to secured channel ${channel}`)
      allowed = true;
    }

    if (typeof joined === 'function') {
      joined(allowed)
    }
  })
})

io.of('inspect').on('connection', (socket) => {
  socket.emit('result', {
    headers: socket.request.headers,
    query: socket.request.query
  })
})

/*
 * Secured namespace with middleware
 */
const securedMd = io.of('secured-md');

// Middleware authenticating namespace
securedMd.use((socket, next) => {
  if (validAuth(socket.handshake.auth)) {
    next()
  } else {
    const err = new Error("Not authorized");
    err.data = { content: "Please retry later" }; // additional details
    next(err);
  }
})
securedMd.on('connection', function(socket) {
  socket.on('ping', (pong) => pong(true))
})

function validAuth({token, type}) {
  if (token) {
    if (tokens.includes(token)) {
      return true
    }

    if (type === 'uuid' && token.split('-').length === 5) {
      return true
    }
  }

  return false;
}

function requestListener(req, res) {
  switch (req.url) {
    case '/get-token':
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify({token: makeToken()}));
      break;
    default:
      res.writeHead(404);
      res.end();
      break
  }
}

const tokens = ['all-access-token']
function makeToken () {
  const token = crypto.randomBytes(20).toString('hex')
  tokens.push(token)

  return token
}
