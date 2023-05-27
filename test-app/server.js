const io = require('socket.io')(process.env.SERVER_PORT);
const crypto = require('crypto');

io.on('connection', function(socket) {
  socket.on('join', (channel) => {
    socket.join(channel)
    socket.emit('joined', `Welcome to ${channel}`)
  })

  socket.on('message', (channel, message) => {
    io.in(channel).emit('message', channel, message)
  })
});

const tokens = []
io.of('secured').on('connection', function(socket) {
  socket.on('login', function({username, password}) {
    if (username === password) {
      const token = crypto.randomBytes(20).toString('hex')
      tokens.push(token)
      socket.emit('success', {token})
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
