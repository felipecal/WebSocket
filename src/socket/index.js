import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const chatMessage = 'chat_message';
const notifyMessage = 'notify_message';

const users = [];



io.on('connection', (socket) => {
    users.push({
        id: socket.id,
        name: 'loading'
    });
    socket.on('front_connection', (name) => {
        const index = users.findIndex(element => element.id === socket.id);
        if (index !== -1) {
            const user = {...users[index],name};
            users[index] = user;
            io.emit(notifyMessage, `${user.name} with id: ${user.id}  is connected.`)
        }

    })
    socket.on('disconnect', () => {
        const index = users.findIndex(element => element.id === socket.id);
        if (index !== -1) {
            const user = users[index];
            io.emit(notifyMessage, `${user.name} with id: ${user.id} is disconnected.`)
            users.splice(index,1) ;
        }

    });
    socket.on(chatMessage, (msg) => {
        io.emit(notifyMessage, msg);
    });
});

httpServer.listen(port, () => {
    console.log(`🔥 Running at ${port} 🔥`);
});
