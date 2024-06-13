import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppRoute } from '../App'

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    // Scroll to the bottom of the chat on every update
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, [messages]);

  const messageChatbot = async (e) => {
    e.preventDefault();

    // Update the state with the user's message
    setMessages([...messages, { type: "user", text: userInput }]);

    // Make an API request to the backend to send the user's message
    try {
      // Simulate a delay to show the thinking animation
      setMessages([...messages, { type: "chatbot", text: "Thinking..." }]);
      setTimeout(async () => {
        const response = await axios.post(`${AppRoute}send-msg`, {
          user_message: userInput,
        });

        // Store the chatbot response in a variable
        const chatbotResponse = response.data.Reply;

        // Update the state with both the user's message and chatbot's response
        setMessages([
          ...messages,
          { type: "user", text: userInput },
          { type: "chatbot", text: chatbotResponse },
        ]);

        // Clear the input field
        setUserInput("");
      }, 1000); // Simulated delay of 1 second
    } catch (error) {
      console.error("Error sending user input to backend:", error);
    }
  };

  return (
    // <div className=" min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className=" container w-full h-full">
    //     <div id="chat-messages" className="max-h-80 overflow-y-auto space-y-2">
    //       {messages.map((message, index) => (
    //         <div
    //           key={index}
    //           className={`p-3 rounded-lg ${
    //             message.type === "user"
    //               ? "bg-blue-500 text-white self-start"
    //               : "bg-green-500 text-white self-end"
    //           }`}
    //         >
    //           {message.text}
    //         </div>
    //       ))}
    //     </div>

    //     <div className="flex mt-4">
    //       <input
    //         type="text"
    //         value={userInput}
    //         onChange={(e) => setUserInput(e.target.value)}
    //         placeholder="Type your message..."
    //         className="flex-1 p-2 border rounded-l focus:outline-none focus:ring focus:border-blue-300 transition-all"
    //       />
    //       <button
    //         onClick={messageChatbot}
    //         className="bg-blue-500 text-white p-2 rounded-r focus:outline-none hover:bg-blue-600 transition-all"
    //       >
    //         Send
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-gray-900 to-gray-700">
      <div className="container w-full h-full">
        <div id="chat-messages" className="chat-history space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-500 text-white font-lg font-bold self-start"
                  : "bg-green-500 text-white font-lg font-bold self-end"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input flex items-center p-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-gray-700 border-transparent text-white font-bold px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          />
          <button
            onClick={messageChatbot}
            className="ml-2 px-4 py-2 rounded-lg bg-grey-500 text-white hover:bg-blue-600 focus:outline-none transition-all"
          >
            Ask FashionBot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;