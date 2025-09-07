// src/pages/HomeRedirect.jsx
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FreeChat from "../pages/FreeChat";

const HomeRedirect = () => {
  const navigate = useNavigate();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/chat"); // ✅ redirect to /chat if logged in
    } else {
      setCheckedAuth(true); // ✅ allow FreeChat to render
    }
  }, [navigate]);

  // Render FreeChat only if token is not present
  return checkedAuth ? <FreeChat /> : null;
};

export default HomeRedirect;
