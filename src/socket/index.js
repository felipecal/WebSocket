import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = process.env.PORT || 3000;
import os from "os";

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
   for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
         addresses.push(address.address);
      }
   }
}

console.log(addresses);

app.use(express.static(path.join(__dirname, "..", "public/templates")));

const chatMessage = "chat_message";
const notifyMessage = "notify_message";

const users = [];

io.on("connection", (socket) => {
   users.push({
      id: socket.id,
      name: "loading",
   });

   socket.on("front_connection", (name) => {
      const index = users.findIndex((element) => element.id === socket.id);
      if (index !== -1) {
         const user = { ...users[index], name };
         users[index] = user;
         io.emit(notifyMessage, `${user.name} is connected.`);
      }
   });
   socket.on("start-typing", function (name) {
      socket.broadcast.emit("start-typing", name);
   });

   socket.on("stop-typing", function (name) {
      socket.broadcast.emit("stop-typing", name);
   });

   socket.on("disconnect", () => {
      const index = users.findIndex((element) => element.id === socket.id);
      if (index !== -1) {
         const user = users[index];
         io.emit(notifyMessage, `${user.name} is disconnected.`);
         users.splice(index, 1);
      }
   });

   socket.on(chatMessage, (msg) => {
      const index = users.findIndex((element) => element.id === socket.id);
      const user = users[index];
      io.emit(notifyMessage, `${user.name}: ` + msg);
   });
});

httpServer.listen(port, () => {
   console.log(`🔥 Running at ${port} 🔥`);
});
