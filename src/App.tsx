// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatLayout from "./layouts/ChatLayout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Chat layout (mọi route khác) */}
        <Route path="/chat" element={<ChatLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
