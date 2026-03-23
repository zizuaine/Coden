import { io } from "socket.io-client";

export const createSocket = async () => {

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: Infinity,
        timeout: 10000,
        withCredentials: true,
    });

    return socket;
};