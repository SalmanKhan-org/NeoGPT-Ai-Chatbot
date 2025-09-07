import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
    const token = searchParams.get("token");
    const navigate = useNavigate();

  useEffect(() => {
      const verifyEmail = async () => {
          if (token) {
              try {
                  const response = await axios.get(`/api/v1/users/verify-email?token=${token}`);
                  if (response.data.success) {
                      setStatus('success');
                      toast.success("Email Verified Successfully");
                      navigate('/chat');
                  }
              } catch (err) {
                  setStatus('error');
                  toast.error(err.response.data.message||"Somthing went wrong with verification")
              }
          } else {
              setStatus('error');
              toast.error("Token does not exist");
          }
      }
      verifyEmail();
  }, [token]);

    return (
      <>
        <Helmet>
          <title>Verify Account | NeoGPT - AI Chat Assistant</title>
          <meta
            name="description"
            content="Verify your NeoGPT Account "
          />
          <meta
            name="keywords"
            content="NeoGPT, chatbot verification, AI assistant, GPT verification, Email Verification"
          />
          <meta name="author" content="NeoGPT" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
          <div className="bg-[#1f1f1f] p-8 rounded-xl shadow-md w-full max-w-md text-center">
            {status === "loading" && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Verifying Email...
                </h2>
                <p className="text-white/50">
                  Please wait while we verify your email.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Email Verified ✅
                </h2>
                <p className="text-white/50">
                  Your email has been successfully verified. You can now log in.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  Verification Failed ❌
                </h2>
                <p className="text-white/50">
                  The verification link is invalid or has expired.
                </p>
              </>
            )}
          </div>
        </div>
      </>
    );
};

export default VerifyEmail;
