"use strict";
var users = [];
// Adding a new user to the Chat
var addChatUser = function (id, userName, chatRoom) {
    if (userName && chatRoom) {
        userName = userName.trim();
        chatRoom = chatRoom.trim();
        var user = { id: id, userName: userName, chatRoom: chatRoom };
        users.push(user);
        return user;
    }
};
// Deleting a user from Chat
var deleteChatUser = function (id) {
    var userIndex = users.findIndex(function (user) { return user.id === id; });
    if (userIndex != -1) {
        return users.splice(userIndex, 1)[0];
    }
};
// Getting the chat user
var getChatUser = function (id) {
    return users.find(function (user) { return user.id === id; });
};
module.exports = { addChatUser: addChatUser, deleteChatUser: deleteChatUser, getChatUser: getChatUser };
