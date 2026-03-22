import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                {
                    email,
                    password
                }
            );
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.user.firstname);
            navigate("/home");
        } catch (err) {
            toast.error("Login failed. Please check your credentials.")
        }
    }
    return (
        <>
            <input
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p className="lf-link">Have not registered yet? <a href="/register" className="lf-registerLink">register</a></p>
        </>

    )
}

export default LoginForm;