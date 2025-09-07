import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth, provider } from '../helper/firebase';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const GoogleLogin = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = async () => {
        const googleResponse = await signInWithPopup(auth,provider);
        const values = {
            username: googleResponse.user.displayName,
            email: googleResponse.user.email
        };
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/google-login`, values);
            if (response.data.success) {
                localStorage.setItem("token", response.data.data);
                toast.success(response.data.message);
                navigate('/chat');
            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong in Google Login");
        }
    }
  return (
      <button
          onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center cusror-pointer text-white border border-white/20 py-2 rounded-full hover:bg-white/20 transition-colors
           duration-300"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      Login with Google
    </button>
  );
}

export default GoogleLogin
