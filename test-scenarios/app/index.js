const io = require("socket.io")(3009);

io.on("connection", function(socket) {
  socket.on('join', (channel) => {
    socket.join(channel)
    socket.emit('joined', `Welcome to ${channel}`)
  })

  socket.on('message', (channel, message) => {
    io.in(channel).emit('message', channel, message)
  })
});
