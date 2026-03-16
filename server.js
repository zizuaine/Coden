import express from "express"
import http from "http"
import { Server } from "socket.io"
import Actions from "./Actions.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server)

const userSocketMap = {}

function getAllConnectedClients(roomId) {
    const sockets = io.sockets.adapter.rooms.get(roomId) || []
    return [...sockets].map(socketId => ({
        socketId,
        username: userSocketMap[socketId]
    }));
}

io.on("connection", (socket) => {
    console.log('socket connected', socket.id);

    socket.on(Actions.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId); //client joins the room
        const clients = getAllConnectedClients(roomId)
        clients.forEach(({ socketId }) => {
            io.to(socket).emit(Actions.JOINED, {
                clients,
                username,
                socketId: socketId.id,
            })
        })
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))