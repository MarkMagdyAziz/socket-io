const { instrument } = require("@socket.io/admin-ui");
const httpServer  = require('http').createServer();
const { Server } = require("socket.io");


const socketIO = new Server(httpServer, {
    cors: { origin: ["http://localhost:4200","https://admin.socket.io"] }
  });

socketIO.on('connection', (socket) => {
    console.log('a user connected');
    console.log('socket id',socket.id);

    socket.on('send-message', (clientMessage,room,cb) =>     {
        console.log("a new message from client",clientMessage,socket.id);

        // socket.broadcast.emit => send to all clients except the one who send the message
        // socket.emit => send back events and data from the server to a specific client
        socket.broadcast.emit('receive-message', `a new message say ${clientMessage}` );
    });


    socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
});

instrument(socketIO, {
    auth: false,
  });


  httpServer.listen(8080, () => console.log('listening on http://localhost:8080') );


  // https://admin.socket.io/#/