import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Client from "../src/components/Client";
import Editor from "../src/components/Editor"
import { createSocket } from "../src/socket";
import Actions from "../Actions";


const EditorPage = () => {
    const [clients, setClients] = useState([])
    const socketRef = useRef(null);
    const codeRef = useRef(null)
    const { roomId } = useParams();
    const RedirectNavigator = useNavigate();

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }




    useEffect(() => {
        const start = async () => {

            socketRef.current = await createSocket();

            function handleErrors(e) {
                console.log("socket error", e);
                toast.error("Socket connection failed, Please try again later");
                RedirectNavigator("/home")
            }

            socketRef.current.on("connect_error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));



            socketRef.current.on("connect", () => {
                console.log("connected");

                const token = localStorage.getItem("token");
                const username = localStorage.getItem("username");

                socketRef.current.emit(Actions.JOIN, {
                    roomId,
                    username,
                    token
                });
            });

            //listening for joined event
            socketRef.current.on(Actions.JOINED, ({ clients, username, socketId }) => {
                const myUsername = localStorage.getItem("username")
                if (username !== myUsername) {
                    toast.success(`${username} has joined the room.`)
                    console.log(username)
                }
                setClients(clients)
                socketRef.current.emit(Actions.SYNC_CODE, {
                    code: codeRef.current,
                    socketId
                });
            });

            //listening for disconnected
            socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
                toast(`${username} has left the room.`);
                setClients(prevClients => (
                    prevClients.filter(client => client.socketId !== socketId)
                ))
            })

        };
        start();

        return () => {
            socketRef.current?.off(Actions.JOINED);
            socketRef.current?.off(Actions.DISCONNECTED);
            socketRef.current?.disconnect();
        }

    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied!")
        } catch (err) {
            toast.error("try again");
            console.log(err)
        }
    }

    const leaveRoom = () => {
        RedirectNavigator("/home")
    }



    return (
        <div className="main-wrapper">
            <div className="ed-topBar">
                <div className="ed-logo">
                    <img src="/coden.png" alt="" />
                </div>
                <div className="ed-room-id">
                    {roomId}
                </div>
            </div>

            <div className="editor-body">

                <div className="left-panel">
                    <div className="left-upper-container">
                        <h3>Connected</h3>
                        <div className="clientsList">
                            {
                                clients.map(client => (
                                    <Client key={client.socketId} username={client.username} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="left-lower-container">
                        <button onClick={copyRoomId} className="btn copyBtn">Copy ROOM ID</button>
                        <button onClick={leaveRoom} className="btn LeaveBtn">Leave room</button>
                    </div>
                </div>

                <div className="editorWrap" >
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => codeRef.current = code}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditorPage;