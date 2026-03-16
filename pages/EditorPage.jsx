import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Client from "../src/components/Client";
import Editor from "../src/components/Editor"
import { createSocket } from "../src/socket";
import Actions from "../Actions";

const EditorPage = () => {

    const [clients, setClients] = useState([
        { socketId: 1, username: 'dikshant' },
        { socketId: 2, username: 'kashyap' },
    ])

    const socketRef = useRef(null);
    useEffect(() => {
        const start = async () => {
            socketRef.current = await createSocket();
            // socketRef.current.emit(Actions.JOIN, {
            //     roomId,
            //     username: location.state?.username,
            // })
        };
        start();
    }, []);

    const { roomId } = useParams();

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
                        <button className="btn copyBtn">Copy ROOM ID</button>
                        <button className="btn LeaveBtn">Leave room</button>
                    </div>
                </div>

                <div className="editorWrap" >
                    <Editor />
                </div>
            </div>
        </div>
    )
}

export default EditorPage;