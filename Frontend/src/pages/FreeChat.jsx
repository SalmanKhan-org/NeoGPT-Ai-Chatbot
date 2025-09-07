import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdAttach } from "react-icons/io";
import { GoArrowUp } from "react-icons/go";
import { IoMicSharp } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { toast } from "sonner";
import { HashLoader } from "react-spinners";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";
import VoiceMicButton from "../components/MicVoiceButton";

const FreeChat = () => {

  const textareaRef = useRef(null);
  const [freeChats, setFreeChats] = useState([]);
  const [reply, setReply] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [liveReply, setLiveReply] = useState("");
  const [isTyping, setIsTyping] = useState(false);



  //state for copy prompt and reply
  const [copiedPromptIndex, setCopiedPromptIndex] = useState(null);
  const [copiedReplyIndex, setCopiedReplyIndex] = useState(null);

  // heper function for copy and share
  const handleCopy = (text, index, type = "reply") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "reply") {
        setCopiedReplyIndex(index);
        setTimeout(() => setCopiedReplyIndex(null), 2000);
      } else if (type === "prompt") {
        setCopiedPromptIndex(index);
        setTimeout(() => setCopiedPromptIndex(null), 2000);
      } else if (type === "code") {
        setCopiedPromptIndex(index);
        setTimeout(() => setCopiedPromptIndex(null), 2000);
      }
    });
  };

  const handleShare = (text) => {
    const shareData = {
      title: "NeoGPT Response",
      text,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        toast.error("Failed to share: " + err.message);
      });
    } else {
      toast.error("Sharing is not supported in your browser.");
    }
  };

  const chatEndRef = useRef(null);

  // file upload

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      // handleFileUpload(file); // pass file to parent for backend upload
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  // Use a ref to store the interval ID
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!reply || !isTyping) return;

    const content = reply.split(" ");
    let idx = 0;
    setLiveReply(""); // Reset live reply

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const partial = content.slice(0, idx + 1).join(" ") + " ▍";
      setLiveReply(partial);
      idx++;

      if (idx >= content.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setLiveReply("");
        setIsTyping(false); // ✅ Stop animation
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reply, isTyping]);

  // Auto-resize with max height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height = 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  //get Reply from Assistant
  const getReply = async (customPrompt ) => {
    const finalPrompt = customPrompt || prompt;
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("prompt", finalPrompt);
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/v1/free-chat`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setSelectedFile(null);
        setIsTyping(true);
        setReply(response.data.data.content);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // append reply to free chats
  useEffect(() => {
    if (prompt && reply) {
      setFreeChats((freeChat) => [
        ...freeChat,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    }
  }, [reply]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [freeChats]);

  // helper function to get reply for introductory buttons
  const handleQuickPrompt = async (text) => {
    setPrompt(text); // still update the state so it reflects in textarea
    getReply(text); // pass the text directly
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-2xl font-bold mb-2 mt-4 text-white " {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-xl font-semibold mb-2 mt-4 text-white" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p
        className="mb-1 text-neutral-300  py-1"
        {...props}
      />
    ),

    li: ({ node, ...props }) => (
      <li className="ml-5 list-disc text-neutral-300 mb-1" {...props} />
    ),
    pre: ({ node, ...props }) => (
      <pre
        className="mb-2  bg-neutral-900 rounded-xl overflow-x-auto text-sm"
        {...props}
      />
    ),

    code: ({ inline, className = "", children, ...props }) => {
      const [localCopied, setLocalCopied] = useState(false);

      // Recursive flatten
      const flattenChildren = (children) => {
        if (typeof children === "string") return children;
        if (Array.isArray(children)) {
          return children.map(flattenChildren).join("");
        }
        if (children?.props?.children) {
          return flattenChildren(children.props.children);
        }
        return "";
      };

      const codeText = flattenChildren(children);

      const handleCopyClick = () => {
        navigator.clipboard.writeText(codeText).then(() => {
          setLocalCopied(true);
          setTimeout(() => setLocalCopied(false), 2000);
        });
      };

      // Inline code (single words, in text)
      if (inline) {
        return (
          <code
            className="bg-neutral-800 text-white text-sm px-1.5 py-0.5 rounded"
            {...props}
          >
            {codeText}
          </code>
        );
      }

      // Code block with syntax highlighting
      return (
        <div className="relative group my-4">
          <button
            onClick={handleCopyClick}
            className="absolute top-2 right-2 text-xs text-white  px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            title="Copy code"
          >
            {localCopied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          </button>

          <pre className="mb-2  bg-neutral-900 rounded-xl overflow-x-auto text-sm">
            <code className={`hljs ${className}`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
  };
  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="h-14 md:p-4 p-2 w-full flex items-center justify-between ">
        <h1 className="font-semibold md:text-xl text-lg text-white">NeoGPT</h1>
        <div className="flex items-center md:space-x-4 space-x-2">
          <Link
            to={"/login-to-account"}
            className="px-4 py-2 bg-white text-black rounded-full text-base"
          >
            Log in
          </Link>
          <Link
            to={"create-new-account"}
            className="px-4 py-2 text-white border border-white/50 rounded-full hover:bg-neutral-700 transition"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Main Scrollable Chat Area */}
      <div className="flex-grow overflow-y-auto px-2 md:px-0">
        <div className="w-full max-w-[720px] mx-auto mt-4 text-neutral-300">
          {freeChats.length === 0 && (
            <div className="text-center my-auto">
              <h1 className="text-6xl text-neutral-300 font-bold mb-4">
                NeoGPT
              </h1>
              <p className="text-neutral-500 text-lg">
                {" "}
                A large language model from a company called Neospace.{" "}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    handleQuickPrompt("Brainstorm ideas");
                  }}
                  className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                >
                  <p className="font-semibold text-neutral-300">
                    Brainstorm ideas
                  </p>
                </div>{" "}
                <div
                  onClick={() => {
                    handleQuickPrompt("Write a poem");
                  }}
                  className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                >
                  <p className="font-semibold text-neutral-300">Write a poem</p>
                </div>
                <div
                  onClick={() => handleQuickPrompt("Explain a concept")}
                  className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                >
                  <p className="font-semibold text-neutral-300">
                    {" "}
                    Explain a concept{" "}
                  </p>
                </div>
                <div
                  onClick={() => handleQuickPrompt("Suggest a recipe")}
                  className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200"
                >
                  <p className="font-semibold text-neutral-300">
                    Suggest a recipe
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4 pb-36">
            {" "}
            {/* bottom padding to avoid overlap with prompt */}
            {freeChats.map((chat, index) => (
              <div key={index}>
                {chat.role === "user" ? (
                  <div className="w-full flex justify-end mb-2">
                    <div className="max-w-[70%] text-right">
                      <div className="px-4 py-2 bg-neutral-700 text-start rounded-xl break-words">
                        {chat.content}
                      </div>
                      <div className="mt-1 flex justify-end">
                        <button
                          onClick={() =>
                            handleCopy(chat.content, index, "prompt")
                          }
                          className="text-white hover:text-green-400 transition"
                          title="Copy Prompt"
                        >
                          {copiedPromptIndex === index ? (
                            <FiCheck />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-start">
                    <div className="w-full max-w-[720px] px-4 py-3  rounded-xl text-white text-start">
                      <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={markdownComponents}
                      >
                        {isTyping && index === freeChats.length - 1
                          ? liveReply
                          : chat.content}
                      </ReactMarkdown>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() =>
                            handleCopy(chat.content, index, "reply")
                          }
                          className="text-white hover:text-green-400"
                          title="Copy Reply"
                        >
                          {copiedReplyIndex === index ? (
                            <FiCheck />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                        <button
                          onClick={() => handleShare(chat.content)}
                          className="text-white hover:text-blue-400"
                          title="Share Reply"
                        >
                          <FiShare2 />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center mt-4">
            <HashLoader color="#fff" loading={loading} />
          </div>
        </div>
      </div>

      {/* Prompt Area (Sticky Bottom) */}
      <div className="w-full sticky bottom-0 bg-neutral-900 px-2 md:px-0 py-2">
        <div className="w-full max-w-[720px] mx-auto flex flex-col items-center justify-center">
          {/* File name preview */}
          {selectedFile && (
            <div className="w-full text-left mb-2 px-2 text-sm text-white">
              Attached:{" "}
              <span className="font-medium text-green-400">
                {selectedFile.name}
              </span>
            </div>
          )}

          {/* Input box */}
          <div className="flex items-center w-full flex-wrap rounded-3xl bg-neutral-800 px-4 py-2 border border-neutral-700 shadow-sm">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow bg-transparent text-white placeholder-neutral-500 focus:outline-none resize-none overflow-y-auto w-full"
              placeholder="What do you want to build?"
              rows={1}
              style={{
                minHeight: "1.5rem",
                lineHeight: "1.5rem",
                maxHeight: "200px",
                transition: "height 0.2s ease-in-out",
              }}
            />

            {/* Icons & Submit */}
            <div className="flex items-center justify-between w-full space-x-2 mt-2">
              <div className="flex space-x-1">
                {/* Attach */}
                <div className="relative group">
                  <button
                    className="p-2 rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <IoMdAttach className="h-5 w-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Add PDF
                  </span>
                </div>

                {/* Mic */}
                <div className="relative group">
                  <VoiceMicButton onTranscriptChange={setPrompt}/>
                  
                </div>
              </div>

              {/* Submit */}
              <div className="relative group">
                <button
                  onClick={()=>getReply("")}
                  disabled={loading}
                  className="p-2 rounded-full text-black bg-white hover:bg-white/70 transition"
                >
                  <GoArrowUp className="text-lg font-bold" />
                </button>
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Submit
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-neutral-500 mt-2">
            NeoGPT can make mistakes, so double-check it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeChat;
