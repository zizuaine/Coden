import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import http from "http"
import path from "path";
import { Server } from "socket.io"
import Actions from "./Actions.js";
import { fileURLToPath } from "url"
import { connectDB } from "./db.js";
import Code from "./models/code.js"
import authRouter from "./routes/authRoutes.js";
import { getJwtSecret } from "./config.js";
import jwt from "jsonwebtoken"
dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(express.json());
app.use(cors())

app.use("/auth", authRouter)

app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



const users = {}

function getAllConnectedClients(roomId) {
    const sockets = io.sockets.adapter.rooms.get(roomId) || []
    return [...sockets].map(socketId => ({
        socketId,
        username: users[socketId]
    }));
}


let timers = {}; //will save timers for each room

io.on("connection", (socket) => {
    console.log('socket connected', socket.id);

    socket.on(Actions.JOIN, async ({ roomId, username, token }) => {
        try {
            if (!token) {
                return socket.emit("ERROR", "Token missing");
            }
            const decoded = jwt.verify(token, getJwtSecret());

            socket.userId = decoded.id

            users[socket.id] = username;
            socket.join(roomId); //client joins the room

            const room = await Code.findOne({ roomId })

            if (room) {
                socket.emit(Actions.CODE_CHANGE, {
                    code: room.code
                })
            }

            const clients = getAllConnectedClients(roomId)
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit(Actions.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                })
            })
        } catch (err) {
            socket.emit("ERROR", "Unauthorized");
        }
    });

    socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
        clearTimeout(timers[roomId]);
        timers[roomId] = setTimeout(async () => {
            await Code.findOneAndUpdate(
                { roomId },
                { code, updatedAt: Date.now() },
                { upsert: true }
            );
        }, 2000)

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
                username: users[socket.id],
            })
        })
        delete users[socket.id];
    })
})


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});