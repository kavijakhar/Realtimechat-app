const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
const io = require('socket.io')(server);
let users = {};
 
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    socket.on("new-user-joineded", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username)
        io.emit("user-list",users);
    });

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user=users[socket.id])
        delete users[socket.id];
        io.emit("user-list",users);
    });
    socket.on("message",(data)=>{
        socket.broadcast.emit('message',{user:data.user,msg:data.msg})
    });


});    
server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})

