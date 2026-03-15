import React from "react";

const HomePage = () => {
    return (
        <div className="HomePageWrapper">
            <div className="formWrapper">
                <img src="/coden.png" alt="coden-logo" />
                <h4 className="mainLabel">Paste invitation Room</h4>
                <div className="inputContainer">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                    />
                    <button className="btn joinBtn">Join</button>

                    <div className="hp-or-row">
                        <div className="hp-or-line" />
                        <span className="hp-or-text">OR</span>
                        <div className="hp-or-line" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;