const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const users = {}; 

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('setUsername', (username) => {
        users[socket.id] = username;
    });

    socket.on('message', (data) => {
        io.emit('message', { text: data.text, sender: users[socket.id] });
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
