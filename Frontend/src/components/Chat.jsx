/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../mycontext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";
import { toast } from "sonner";

const Chat = () => {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [liveReply, setLiveReply] = useState("");
  const chatEndRef = useRef(null);
  const intervalRef = useRef(null);

  const [copiedIndex, setCopiedIndex] = useState(null); // for assistant reply copy
  const [copiedPromptIndex, setCopiedPromptIndex] = useState(null); // for prompt copy

  useEffect(() => {
    if (reply && reply.role === "assistant") {
      const content = reply.content.split(" ");
      let idx = 0;
      setLiveReply("");
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        const partial = content.slice(0, idx + 1).join(" ") + " ▍";
        setLiveReply(partial);
        idx++;
        if (idx >= content.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setLiveReply("");
        }
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLiveReply("");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reply]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevChats, liveReply]);

  const handleCopy = (text, index, type = "reply") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "reply") {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopiedPromptIndex(index);
        setTimeout(() => setCopiedPromptIndex(null), 2000);
      }
    });
  };

  const handleShare = (text) => {
    const shareData = {
      title: "AI Reply",
      text: text,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((error) => toast.error("Error sharing:", error));
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-2xl font-bold mb-2 mt-4 text-white" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-xl font-semibold mb-2 mt-4 text-white" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="mb-3 text-neutral-300" {...props} />
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
    <div className="w-full max-w-[720px] mt-10 p-2 md:p-4 text-neutral-300">
      {newChat && (
        <h1 className="text-lg md:text-2xl text-neutral-300">
          Start a new Chat
        </h1>
      )}

      <div className="w-full space-y-4">
        {prevChats.map((chat, index) => (
          <div key={index}>
            {chat.role === "user" ? (
              <div className="w-full flex justify-end mb-1">
                <div className="max-w-[70%]">
                  <div className="px-4 py-2 bg-neutral-700 text-start rounded-xl break-words">
                    {chat.content}
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => handleCopy(chat.content, index, "prompt")}
                      className="text-white hover:text-green-400"
                      title="Copy Prompt"
                    >
                      {copiedPromptIndex === index ? <FiCheck /> : <FiCopy />}
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
                    {liveReply && index === prevChats.length - 1
                      ? liveReply
                      : chat.content}
                  </ReactMarkdown>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleCopy(chat.content, index, "reply")}
                      className="text-white hover:text-green-400"
                      title="Copy Reply"
                    >
                      {copiedIndex === index ? <FiCheck /> : <FiCopy />}
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
    </div>
  );
};

export default Chat;
