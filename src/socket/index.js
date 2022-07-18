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


const test = io.on('connection', (socket) => {
    io.emit(notifyMessage, `user is connected.`)
    console.log(test.server.httpServer._connections);
    socket.on('disconnect', () => {
        io.emit(notifyMessage, `user is disconnected.}`)
    });
    socket.on(chatMessage, (msg) => {
        io.emit(notifyMessage, msg);
    });
});

httpServer.listen(port, () => {
    console.log(`🔥 Running at ${port} 🔥`);
});
