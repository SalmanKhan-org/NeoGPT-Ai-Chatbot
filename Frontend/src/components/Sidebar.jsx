import React, { useState, useContext, useEffect, useRef } from "react";
import { MyContext } from "../mycontext";
import { IoArrowBackSharp } from "react-icons/io5";
import { Tooltip } from "./Tooltip";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";



export const Sidebar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isCollapsed,
    setIsCollapsed,
    setNewChat,
    threadId,
    setThreadId,
    setPrevChats,
    allThreads,
    setAllThreads,
    setReply,
    setPrompt,
    userData
  } = useContext(MyContext);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef();
  const token = localStorage.getItem("token");


  //get all threads
  const getAllThreads = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/threads`, {
        headers: {
          'Authorization':`Bearer ${token}`
        }
      });
      if (response.data.success) {
        const data = await response.data.data.map((thread)=>({_id:thread.threadId, title:thread.title}))
        setAllThreads(data)
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    getAllThreads();
  }, [threadId])
  

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  // Close sidebar on clicking outside (for mobile/medium sizes)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isSidebarOpen &&
        window.innerWidth < 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const filteredThreads = allThreads.filter((thread) =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      // Mobile behavior
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      // Desktop behavior
      setIsCollapsed(!isCollapsed);
      setIsSidebarOpen(true);
    }
  };

  // generate new threadId

  const startNewThread = () => {
    const newThreadId = uuidv4();
    setThreadId(newThreadId);
    setReply(null);
    setNewChat(true);
    setPrompt('');
    setPrevChats([]); // Optional: clear previous messages for new thread
  };


  // fetch chats of a single thread
  const fetchChats = async (id) => {
    setThreadId(id);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/thread/${id}`, {
        headers: {
          'Authorization':`Bearer ${token}`
        }
      });
      if (response.data.success) {
        setReply(null);
        setNewChat(false);
        setPrevChats(response.data.data.messages);
      }
    } catch (error) {
      toast.error("something went wrong !please refresh the page");
    }
  }

  //delete thread
  const deleteThread = async (e, id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/thread/${id}`, {
        headers: {
          'Authorization':`Bearer ${token}`
        }
      });
      if (response.data.success) {
        getAllThreads();
        startNewThread();
      }
    } catch (error) {
      toast.error("something went wrong! please refresh the page");
    }
  }
  return (
    <div
      ref={sidebarRef}
      className={`
        bg-[#1f1f1f] text-neutral-300 transition-all duration-300 ease-in-out
        flex-shrink-0 flex flex-col h-screen overflow-hidden
        ${isSidebarOpen ? "w-64" : "w-0 sm:w-0"}
        ${isCollapsed ? "lg:w-16" : "lg:w-64"}
      `}
    >
      {/* HEADER or SEARCH BAR */}
      <div className="p-4 flex items-center justify-between h-16">
        {isSearchOpen ? (
          <div className="flex items-center w-full bg-neutral-900 rounded-full pl-2">
            <Tooltip
              label={"Close"}
              children={
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchTerm("");
                  }}
                  className="text-neutral-400 hover:text-white p-1"
                  title="Back"
                >
                  <IoArrowBackSharp className="min-w-[20px] w-5 h-5" />
                </button>
              }
            />
            <Tooltip
              label={"Search"}
              children={
                <input
                  autoFocus
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow bg-transparent p-2 text-white focus:outline-none"
                />
              }
            />
          </div>
        ) : (
          <>
            <div>
              <Tooltip
                label={"Toggle Sidebar"}
                position="bottom"
                children={
                  <button
                    onClick={handleToggle}
                    className="p-2 rounded-full cursor-pointer hover:bg-neutral-800"
                    aria-labelledby="toggle sidebar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="min-w-[24px] h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                }
              />
            </div>
            {/* Hide search icon if search is open */}
            {!isSearchOpen && (
              <div className="flex items-center space-x-2">
                <Tooltip
                  label={"Search"}
                  position="bottom"
                  children={
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 rounded-full hover:bg-neutral-800"
                      aria-labelledby="Search"
                    >
                      <svg
                        className="min-w-[24px] h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  }
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* ONLY "New Chat" WHEN NOT SEARCHING */}
      {!isSearchOpen && (
        <div className="p-4">
          <Tooltip
            label={"New Chat"}
            children={
              <div
                onClick={() => {
                  setNewChat(true);
                  startNewThread();
                }}
                className="flex items-center p-2 rounded-full cursor-pointer hover:bg-neutral-800"
                style={{ minHeight: "40px" }} // Ensure stable height
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 min-w-[24px] text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>

                {/* Keep layout stable using absolute/fixed width on label */}
                <span
                  className={`
        ml-2 text-sm text-white whitespace-nowrap transition-all duration-200 overflow-hidden
        ${
          isCollapsed
            ? "lg:max-w-0 lg:opacity-0"
            : "lg:max-w-[200px] lg:opacity-100"
        }
      `}
                >
                  New Chat
                </span>
              </div>
            }
          />
        </div>
      )}

      {/* THREADS */}
      <div
        className={`flex-grow overflow-x-hidden overflow-y-auto px-4 ${
          isCollapsed ? "lg:hidden" : ""
        }`}
      >
        <h3 className="text-sm text-neutral-500 uppercase mt-4">Threads</h3>
        <ul className="mt-2 space-y-2">
          {filteredThreads.length > 0 &&
            filteredThreads.map((thread) => (
              <li
                key={thread?._id}
                onClick={() => fetchChats(thread._id)}
                className={`p-2 h-8 cursor-pointer group flex justify-between items-center text-sm rounded-md border-l-4
          ${
            threadId === thread._id
              ? "bg-neutral-800 border-neutral-600"
              : "hover:bg-neutral-800 border-transparent hover:border-neutral-600"
          }
        `}
              >
                <div className="truncate">{thread?.title}</div>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(e, thread._id);
                  }}
                  className="p-1 md:hidden rounded-full hover:bg-neutral-500 group-hover:block"
                >
                  <MdDeleteOutline className="w-5 h-5" />
                </p>
              </li>
            ))}
          {filteredThreads.length === 0 && (
            <li className="p-2 text-neutral-500 text-sm">No threads found.</li>
          )}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-neutral-800">
          <Tooltip
            label={"User"}
            children={
              <div className="min-w-[24px] w-6 h-6 flex items-center justify-center rounded-full bg-blue-800 text-white text-sm font-semibold uppercase">
                {userData?.username?.charAt(0)||"J"}
              </div>
            }
          />
          {!isCollapsed && <span className="text-sm">{userData?.username||"John Doe"}</span>}
        </div>
      </div>
    </div>
  );
};
