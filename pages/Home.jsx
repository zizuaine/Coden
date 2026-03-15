import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const HomePage = () => {

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('')

    const createNewRoom = (e) => {
        e.preventDefault();

        const id = uuidv4();
        setRoomId(id);

    }

    return (
        <div className="hp-wrapper">
            <div className="hp-card">

                <div className="hp-left">
                    <div className="hp-logo-row">
                        <img src="/Coden.png" alt="coden-logo" />
                    </div>

                    <p className="hp-tagline">
                        The real-time code editor built for teams - instant previews, zero setup required and end-to-end encrypted rooms
                    </p>

                    <div className="hp-bullets">
                        {[
                            "collaborative editing",
                            "End-to-end encrypted rooms",
                            "Instant preview — no refresh needed",
                            "Zero setup",
                        ].map((b) => (
                            <div key={b} className="hp-bullet">
                                <div className="hp-bulletDot" />
                                {b}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hp-right">
                    <div className="hp-formTitle">Paste invitation ROOM ID</div>
                    <div className="hp-inputContainer">
                        <input
                            type="text"
                            placeholder="ROOM ID"
                            value={roomId}
                            className="inputBox"
                            onChange={(e) => setRoomId(e.currentTarget.value)}
                        />

                        <input
                            type="text"
                            placeholder="USERNAME"
                            className="inputBox"
                            value={username}
                            onChange={(e) => setUsername(e.currentTarget.value)}
                        />
                    </div>

                    <button className="btn hp-joinBtn">Join</button>

                    <div className="hp-or-row">
                        <div className="hp-or-line" />
                        <span className="hp-or-text">OR</span>
                        <div className="hp-or-line" />
                    </div>

                    <button
                        onClick={createNewRoom}
                        className="btn hp-createBtn"
                    >+ Create new room
                    </button>
                </div>

            </div>
        </div>
    )
}

export default HomePage;
