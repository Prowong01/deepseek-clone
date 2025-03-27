import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import React, { useState } from "react";

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState("");
  const {user, chats, setChats, selectedChat, setSelectedChat} = useAppContext();

  const handleKeyDown = (e) => {
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      sendPrompt(e);
    }
  }

  const sendPrompt = async (e) => {
    const promptCopy = prompt;

    try {
      e.preventDefault();
      if(!user) return toast.error("Please login to continue");
      if(!isLoading) return toast.error('Wait for the previor prompt to finish');

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      }

      setChats((prevChats) => {
        return prevChats.map((chat) => 
          chat._id === selectedChat._id
            ? {
                ...chat,
                messages: [...chat.messages, userPrompt],
              }
            : chat
        );
      });

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }))

      const {data} = await axios.post('/api/chat/ai', {
        prompt: promptCopy,
        chatId: selectedChat._id,
      });

      if(data.success) {
        setChats((prevChats) => prevChats.map((chat) => 
          chat._id === selectedChat._id
            ? {
                ...chat,
                messages: [...chat.messages, data.message],
              }
            : chat
        ));

        const message = data.data.content;
        const messageTokens = message.split(" ");
        let assistantMessage = {
          role: 'assistant',
          content: message,
          timestamp: Date.now(),
        }

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }))

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1),join(" ")
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage
              ]
              return {
                ...prev,
                messages: updatedMessages,
              }
            })
          })
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        false ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Messsage Deepseek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
