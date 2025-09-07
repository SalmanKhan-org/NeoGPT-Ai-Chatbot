import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MyContext } from "./mycontext";
import { ChatWindow } from "./components/ChatWindow";
import { v1 as uuidv1 } from 'uuid';
import { toast } from "sonner";
import axios from "axios";
import { Helmet } from "react-helmet";
// Main App Component
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // user prompt
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [threadId, setThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [userData, setUserData] = useState();

  const providerValues = {
    isSidebarOpen,
    setIsSidebarOpen,
    isCollapsed,
    setIsCollapsed,
    prompt, setPrompt,
    reply, setReply,
    threadId, setThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    userData
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/me`, {
        headers: {
          'Authorization':`Bearer ${token}`
        }
      });
      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message|| "User data not fetched");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);


  return (
    <>
      <Helmet>
        <title>NeoGPT | Your AI Chat Assistant</title>
        <meta
          name="description"
          content="NeoGPT your personal AI chat assistant"
        />
        <meta
          name="keywords"
          content="NeoGPT, start chatting, AI assistant, GPT Chat"
        />
        <meta name="author" content="NeoGPT" />
      </Helmet>
      <div className="flex min-h-screen overflow-hidden">
        <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow />
        </MyContext.Provider>
      </div>
    </>
  );
}

export default App;
