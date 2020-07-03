import express = require('express');
import http = require('http');
import socketio = require('socket.io');
import cors = require('cors');

const { addChatUser, deleteChatUser, getChatUser } = require('./users');

const router: express.Router = require('./router')

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', ({ userName, chatRoom }, callback) => {
        try {
            // Adding the user
            const user: User = addChatUser(socket.id, userName, chatRoom);

            // Sending an automated message when the user joins the chat room
            socket.emit('message', { user: 'Administrator', text: `${user.userName} joined the ${user.chatRoom} Chat room.`})

            // Broadcasting the joining message to the rest of the users in the Chat room
            console.log(user.chatRoom);
            socket.broadcast.to(user.chatRoom).emit('message', { user: 'Administrator', text: `${user.userName} has joined this Chat room.` })

            // In case of no errors - join the Chat room
            socket.join(user.chatRoom);

            callback();
        } catch(ex) {}
    });

    // User sent messages handling
    socket.on('sendChatMessage', (message: string, callback: any) => {
        const user = getChatUser(socket.id);
        io.to(user.chatRoom).emit('message', { user: user.userName, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        // Deleting the chat user when disconnected
        const user = deleteChatUser(socket.id);
        if (user) {
            // Letting the other participants in the chat room know that the user has left
            io.to(user.chatRoom).emit('message', { user: 'Administrator', text: `${user.userName} has left the Chat room.` })
        }
    });
});

app.use(router);
app.use(cors());

server.listen(5000, () => console.log('The Chat server\'s running on port 5000'));