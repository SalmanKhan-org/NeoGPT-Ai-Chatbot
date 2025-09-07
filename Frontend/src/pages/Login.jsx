import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import GoogleLogin from "./GoogleLogin";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

   const toggleShowPassword = () => {
     setShowPassword((prev) => !prev);
   };

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return { ...prev, [name]: value }
        });
    }
    const handleLogin = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
            data
          );
          if (response.data.success) {
            localStorage.setItem("token", response.data.data);
            toast.success(response.data.message);
            navigate("/chat");
          }
        } catch (error) {
          toast.error(
            error.response.data.message ||
              "Something went wrong in Google Login"
          );
        }
    }
  return (
    <>
      <Helmet>
        <title>Log In | NeoGPT - AI Chat Assistant</title>
        <meta
          name="description"
          content="Log in to NeoGPT account to access your personal AI assistant. Login with email or Google today."
        />
        <meta
          name="keywords"
          content="NeoGPT, chatbot login, AI assistant, GPT signup, login to AI account"
        />
        <meta name="Salman khan" content="NeoGPT" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className=" p-8 rounded-2xl md:m-0 m-2 shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Log In for NeoGPT
          </h1>
          {/* Email */}
          <div className="mb-4">
            <label className="block  mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-white/20 rounded-full focus:outline-none focus:ring-0 "
            />
          </div>
          {/* Password */}
          <div className="mb-6 relative">
            <label className="block mb-2" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleOnChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 pr-12 border border-white/20 rounded-full focus:outline-none focus:ring-0"
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-4 top-[43px] text-sm text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <FaRegEyeSlash className="text-lg text-white" />
              ) : (
                <FaRegEye className="text-lg text-white" />
              )}
            </button>
          </div>
          {/* Sign Up Button */}
          <button onClick={handleLogin} className="w-full border border-white/20 cursor-pointer text-white py-2 rounded-full hover:bg-white/20 transition-colors duration-300">
            Login
          </button>
          <p className="text-sm text-white/50 mt-1">
            Don't have an Account?{" "}
            <Link className="hover:underline text-white" to={"/create-new-account"}>
              Sign Up
            </Link>
          </p>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          {/* Google Login Button */}
          <GoogleLogin/>
        </div>
      </div>
    </>
  );
};

export default Login;
