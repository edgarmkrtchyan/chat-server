"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var socketio = require("socket.io");
var cors = require("cors");
var _a = require('./users'), addChatUser = _a.addChatUser, deleteChatUser = _a.deleteChatUser, getChatUser = _a.getChatUser;
var router = require('./router');
var app = express();
var server = http.createServer(app);
var io = socketio(server);
io.on('connection', function (socket) {
    console.log('New user connected');
    socket.on('join', function (_a, callback) {
        var userName = _a.userName, chatRoom = _a.chatRoom;
        try {
            // Adding the user
            var user = addChatUser(socket.id, userName, chatRoom);
            // Sending an automated message when the user joins the chat room
            socket.emit('message', { user: 'Administrator', text: user.userName + " joined the " + user.chatRoom + " Chat room." });
            // Broadcasting the joining message to the rest of the users in the Chat room
            console.log(user.chatRoom);
            socket.broadcast.to(user.chatRoom).emit('message', { user: 'Administrator', text: user.userName + " has joined this Chat room." });
            // In case of no errors - join the Chat room
            socket.join(user.chatRoom);
            callback();
        }
        catch (ex) { }
    });
    // User sent messages handling
    socket.on('sendChatMessage', function (message, callback) {
        var user = getChatUser(socket.id);
        io.to(user.chatRoom).emit('message', { user: user.userName, text: message });
        callback();
    });
    socket.on('disconnect', function () {
        // Deleting the chat user when disconnected
        var user = deleteChatUser(socket.id);
        if (user) {
            // Letting the other participants in the chat room know that the user has left
            io.to(user.chatRoom).emit('message', { user: 'Administrator', text: user.userName + " has left the Chat room." });
        }
    });
});
app.use(router);
app.use(cors());
server.listen(5000, function () { return console.log('The Chat server\'s running on port 5000'); });
