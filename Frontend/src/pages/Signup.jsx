import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import GoogleLogin from "./GoogleLogin";

const Signup = () => {
    const [data, setData] = useState({
      username:"",
    email: "",
    password: "",
  });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
    };

    
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/v1/users/register`, data );
            if (response.data.success) {
                setLoading(false);
                localStorage.setItem("token", response.data.data);
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message||"Something went wrong with Registration")
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
      <Helmet>
        <title>Sign Up | NeoGPT - AI Chat Assistant</title>
        <meta
          name="description"
          content="Create a free NeoGPT account to access your personal AI assistant. Sign up with email or Google today."
        />
        <meta
          name="keywords"
          content="NeoGPT, chatbot signup, AI assistant, GPT signup, create AI account"
        />
        <meta name="author" content="NeoGPT" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className=" p-8 rounded-2xl md:m-0 m-2 shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Sign Up for NeoGPT
          </h1>

          {/* Username */}
          <div className="mb-4">
            <label className="block mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={data.username}
              onChange={handleOnChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-white/20 rounded-full focus:outline-none focus:ring-0"
            />
          </div>

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
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full border border-white/20 text-white py-2 rounded-full transition-colors duration-300 flex items-center justify-center ${
              loading
                ? "bg-white/10 cursor-not-allowed"
                : "hover:bg-white/20 cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2 h-5 w-5" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-sm text-white/50 mt-1">
            Already have an Account?{" "}
            <Link
              className="hover:underline text-white"
              to={"/login-to-account"}
            >
              Log In
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

export default Signup;
