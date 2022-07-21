import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from 'path';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/'));
// });


app.use(express.static(path.join(__dirname, '..', "public")))

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
            const user = { ...users[index], name };
            users[index] = user;
            // io.emit(notifyMessage, `${user.name} with id: ${user.id}  is connected.`);
            io.emit(notifyMessage, `${user.name} is connected.`);
        }
    })
    console.log(users);

    socket.on('disconnect', () => {
        const index = users.findIndex(element => element.id === socket.id);
        if (index !== -1) {
            const user = users[index];
            // io.emit(notifyMessage, `${user.name} with id: ${user.id} is disconnected.`)
            io.emit(notifyMessage, `${user.name} is disconnected.`);
            users.splice(index, 1);
        }

    });
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data)
    })
    socket.on(chatMessage, (msg) => {
        // io.emit(notifyMessage, msg);
        const index = users.findIndex(element => element.id === socket.id);
        const user = users[index];
        io.emit(notifyMessage, `${user.name}: ` + msg);
    });
});

httpServer.listen(port, () => {
    console.log(`🔥 Running at ${port} 🔥`);
});
