import React, { useState } from "react";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password
            });
            console.log("Login response:", res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.user._id);
            localStorage.setItem("username", res.data.user.username);
            setTimeout(() => {
                navigate("/chat", { replace: true });
            }, 50);
        } catch (err: any) {
            alert(err.response?.data?.message || "Lỗi đăng nhập");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
                <div className="space-y-4">
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Đăng nhập
                    </button>
                    <div className="flex justify-end mt-2.5"><span >Chưa có tài khoản?</span>
                        <Link to="/register" className="text-blue-400 hover:underline">Đăng kí</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
