import React, { useContext, useState, useRef, useEffect } from "react";
import { MyContext } from "../mycontext";
import { Tooltip } from "./Tooltip";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { isSidebarOpen, setIsSidebarOpen, userData } = useContext(MyContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Hook to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside the dropdown and not on the profile button
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isProfileOpen]);

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            navigate("/");
            toast.success("User logged out successfully");
        } catch (error) {
            toast.error("User not logged out");
        }
    }
  return (
    <div className="relative bg-neutral-900 text-white p-4 flex items-center justify-between h-16  rounded-b-lg">
      <div className="flex items-center">
        {/* Toggle button, visible on medium/small screens only */}
        {!isSidebarOpen && (
          <Tooltip
            label={"Toggle Sidebar"}
            position="bottom"
            children={
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-800 lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-neutral-300"
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
        )}
        <span className="text-xl font-semibold ml-2">NeoGPT</span>
      </div>

      {/* User profile icon and dropdown */}
      <div className="flex space-x-4 items-center">
        <div className="md:hidden h-6 w-6">
          <FaPlus className="w-full h-full" />
        </div>
        <div className="relative" ref={dropdownRef}>
          <Tooltip
            label={"Profile"}
            position="bottom"
            children={
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="min-w-[24px] w-8 h-8 flex items-center justify-center rounded-full bg-blue-800 text-white text-lg cursor-pointer font-semibold uppercase"
              >
                {userData?.username?.charAt(0) || "J"}
              </div>
            }
          />
          {isProfileOpen && (
            <div className="absolute top-12 right-0  max-w-fit  bg-[#2f2f2f] text-neutral-300 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-neutral-700">
                <p className="font-bold ">{userData?.username || "John Doe"}</p>
                <p className="text-sm truncate text-neutral-500">
                  {userData?.email || "john.doe@example.com"}
                </p>
              </div>
              <ul className="py-2">
                <li>
                  <button className="w-full text-left flex items-center px-4 py-2 hover:bg-neutral-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2V3a1 1 0 00-2 0v2H7V3a1 1 0 00-2 0zM7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
                    </svg>
                    Saved Chats
                  </button>
                </li>
                <li onClick={handleLogout}>
                  <button className="w-full text-left flex items-center px-4 py-2 text-red-400 hover:bg-neutral-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
