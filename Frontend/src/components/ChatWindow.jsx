import { Header } from "./Header";
import { IoMicSharp } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { PromptArea } from "./PromptArea";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../mycontext";
import { HashLoader } from "react-spinners";
import Chat from "./Chat";

// Chat Window Component
export const ChatWindow = () => {
  const { reply, prompt, setPrevChats, setPrompt, threadId } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (prompt && reply) {
  //     setPrevChats((prevChat) => [
  //       ...prevChat,
  //       { role: "user", content: prompt },
  //       { role: "assistant", content: reply },
  //     ]);
  //     setPrompt("");
  //   }
  // }, [reply]);

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-900">
      {/* Header stays fixed at the top */}
      <Header />

      {/* Main chat area — scrollable */}
      <div className="flex-grow overflow-y-auto p-4 flex justify-center ">
        {!threadId ? (
          <div className="text-center my-auto">
            <h1 className="text-6xl text-neutral-300 font-bold mb-4">NeoGPT</h1>
            <p className="text-neutral-500 text-lg">
              {" "}
              A large language model from a company called Neospace.{" "}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                <p className="font-semibold text-neutral-300">
                  Brainstorm ideas
                </p>
              </div>{" "}
              <div className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                <p className="font-semibold text-neutral-300">Write a poem</p>
              </div>
              <div className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                <p className="font-semibold text-neutral-300">
                  {" "}
                  Explain a concept{" "}
                </p>
              </div>
              <div className="p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-200">
                <p className="font-semibold text-neutral-300">
                  Suggest a recipe
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[720px] flex flex-col items-center text-center">
            <Chat />
            <HashLoader color="#fff" loading={loading} />
          </div>
        )}
        {/* Inner chat area: responsive width */}
      </div>

      {/* Prompt area stays fixed at the bottom */}
      <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex justify-center">
        <div className="w-full max-w-[720px]">
          <PromptArea setLoading={setLoading} />
        </div>
      </div>
    </div>
  );
};
