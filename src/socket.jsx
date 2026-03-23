import { io } from "socket.io-client";

export const createSocket = async () => {

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
        transports: ["websocket", "polling"],

        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,

        timeout: 20000,

        withCredentials: true,

        autoConnect: true,
    });
    return socket;
};