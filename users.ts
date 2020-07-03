const users: Array<User> = [];

interface User {
    id: number;
    chatRoom: string;
    userName: string;
}

// Adding a new user to the Chat
const addChatUser = (id: number, userName: string, chatRoom: string) => {
    if (userName && chatRoom) {
        userName = userName.trim();
        chatRoom = chatRoom.trim();

        const user = { id, userName, chatRoom }
        users.push(user);

        return user;
    }
}

// Deleting a user from Chat
const deleteChatUser = (id: number) => {
    const userIndex = users.findIndex((user: User) => user.id === id);

    if (userIndex != -1) {
        return users.splice(userIndex, 1)[0];
    }
}

// Getting the chat user
const getChatUser = (id: number) => {
    return users.find((user: User) => user.id === id);
}

module.exports = { addChatUser, deleteChatUser, getChatUser };