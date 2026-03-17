import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, Navigate, redirect } from "react-router-dom";
import { useParams } from "react-router-dom";
import Client from "../src/components/Client";
import Editor from "../src/components/Editor"
import { createSocket } from "../src/socket";
import Actions from "../Actions";


const EditorPage = () => {

    const [clients, setClients] = useState([])

    const socketRef = useRef(null);
    const location = useLocation();
    const codeRef = useRef(null)
    const { roomId } = useParams();
    const RedirectNavigator = useNavigate();


    useEffect(() => {
        const start = async () => {
            socketRef.current = await createSocket();
            socketRef.current.on("connect_error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));

            function handleErrors(e) {
                console.log("socket error", e);
                toast.error("Socket connection failed, Please try again later");
                RedirectNavigator("/home")
            }

            socketRef.current.emit(Actions.JOIN, {
                roomId,
                username: location.state?.username,
            });

            //listening for joined event
            socketRef.current.on(Actions.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
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
                toast.success(`${username} has left the room.`);
                setClients(prevClients => (
                    prevClients.filter(client => client.socketId !== socketId)
                ))
            })

        };
        start();

        return () => {
            socketRef.current.off(Actions.JOINED);
            socketRef.current.off(Actions.DISCONNECTED);
            socketRef.current.disconnect();
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

    if (!location.state) {
        return <Navigate to="/" />
    }


    return (
        <div className="main-wrapper">
            <div className="ed-topBar">
                <div className="ed-logo">
                    <img src="/Coden.png" alt="" />
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