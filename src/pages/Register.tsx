import React, { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        username,
        email,
        password,
      });
      alert(res.data.message || "Đăng ký thành công");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
        <div className="space-y-4">
          <Input
            label="Họ tên"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Đăng ký
          </button>
          <div className="flex justify-end mt-2.5">
            <span>Đã có tài khoản?</span>
            <Link to="/" className="text-blue-400 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
