import React, { useContext, useState, useRef } from "react";
import { IoMdAttach } from "react-icons/io";
import { IoMicSharp } from "react-icons/io5";
import { MyContext } from "../mycontext";
import axios from "axios";
import VoiceMicButton from "./MicVoiceButton";
import { toast } from "sonner";

export const PromptArea = ({ setLoading }) => {
  const { prompt, setPrompt, setReply, threadId, setNewChat, setPrevChats } =
    useContext(MyContext);

  const [file, setFile] = useState(null); // ⬅️ File state
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null); // ⬅️ File input ref

  // Dynamic height textarea
  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
    setPrompt(e.target.value);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const getReply = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("threadId", threadId);
    formData.append("message", prompt);
    if (file) {
      formData.append("file", file);
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `/api/v1/chat`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setNewChat(false);
        const userMessage = {
          role: "user",
          content: prompt,
        };
        const assistantMessage = {
          role: "assistant",
          content: response.data.data, // or response.data.data.content if nested
        };

        setPrevChats((prev) => [...prev, userMessage, assistantMessage]);
        setReply(assistantMessage); // This triggers typing effect
        setFile(null); // Clear file after success
        setPrompt(""); // Optionally clear prompt
      }
    } catch (error) {
      toast.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* 📄 PDF File Preview */}
      {file && (
        <div className="mb-2 text-sm text-neutral-400 bg-neutral-800 px-4 py-2 rounded border border-neutral-700 flex items-center justify-between">
          <span>{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="ml-2 text-red-400 hover:text-red-600 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center flex-wrap rounded-3xl bg-neutral-800 px-4 py-2 border border-neutral-700 shadow-sm">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          className="flex-grow bg-transparent text-white placeholder-neutral-500 focus:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800"
          placeholder="What do you want to build?"
          rows={1}
          style={{
            minHeight: "1.5rem",
            lineHeight: "1.5rem",
            maxHeight: "150px",
            transition: "height 0.2s ease",
          }}
        />

        {/* Bottom Actions */}
        <div className="flex items-center justify-between w-full space-x-2 mt-2">
          <div className="flex space-x-1">
            {/* Attach File */}
            <div className="relative group">
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors duration-200"
              >
                <IoMdAttach className="h-5 w-5" />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Add File
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Mic Icon */}
            <div className="relative group">
              <VoiceMicButton onTranscriptChange={setPrompt}/>
            </div>
          </div>

          {/* Submit */}
          <div className="relative group">
            <button
              onClick={getReply}
              className="p-2 rounded-full text-white bg-neutral-700 hover:bg-neutral-600 focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Submit
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-500 mt-2">
        NeoGPT can make mistakes, so double-check it.
      </p>
    </div>
  );
};
