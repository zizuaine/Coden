import express from "express"
import cors from "cors";
import http from "http"
import path from "path";
import { Server } from "socket.io"
import Actions from "./Actions.js";

const app = express();

app.use(cors())
app.use(express.static('dist'));

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



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
            io.to(socketId).emit(Actions.JOINED, {
                clients,
                username,
                socketId: socket.id,
            })
        })
    });


    socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(Actions.CODE_CHANGE, { code })
    })


    socket.on(Actions.SYNC_CODE, ({ code, socketId }) => {
        io.to(socketId).emit(Actions.CODE_CHANGE, { code })
    })


    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(Actions.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))