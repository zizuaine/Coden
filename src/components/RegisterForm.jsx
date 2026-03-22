import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`,
                {
                    email,
                    password,
                    firstname,
                    lastname
                }
            )
            toast.success("You have succesfully registered!");
            navigate("/login");
        } catch (err) {
            toast.error("Email already exists. Please check your credentials.")
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
            <input
                type="text"
                placeholder="first Name"
                onChange={(e) => setFirstname(e.target.value)}
            />
            <input
                type="text"
                placeholder="last Name"
                onChange={(e) => setLastname(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <p className="lf-link">Have already registered? <a href="/login" className="lf-registerLink">login</a></p>
        </>

    )
}

export default RegisterForm;