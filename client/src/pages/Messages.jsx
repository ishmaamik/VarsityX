import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Image as ImageIcon,
  MoreVertical,
  ChevronLeft,
  Phone,
  Video,
  UserCircle,
  Check,
  CheckCheck,
} from "lucide-react";
import axios from "axios";

const Messages = () => {
  const [conversations, setConversations] = useState([
    // Placeholder data - replace with real API data
    {
      id: 1,
      user: {
        name: "Sarah Ahmed",
        university: "IUT",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Ahmed&background=0D8ABC&color=fff",
        online: true,
      },
      lastMessage: {
        text: "Hey, is the textbook still available?",
        time: "10:30 AM",
        unread: true,
      },
    },
    {
      id: 2,
      user: {
        name: "Rahul Kumar",
        university: "BUET",
        avatar:
          "https://ui-avatars.com/api/?name=Rahul+Kumar&background=2563EB&color=fff",
        online: false,
      },
      lastMessage: {
        text: "I'll meet you at the library tomorrow",
        time: "Yesterday",
        unread: false,
      },
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([
    // Placeholder messages - replace with real API data
    {
      id: 1,
      sender: "Sarah Ahmed",
      text: "Hey, is the textbook still available?",
      time: "10:30 AM",
      isSender: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Yes, it's still available! When would you like to meet?",
      time: "10:32 AM",
      isSender: true,
    },
    {
      id: 3,
      sender: "Sarah Ahmed",
      text: "Great! Could we meet tomorrow at the library?",
      time: "10:33 AM",
      isSender: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSender: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle image upload logic here
      console.log("Image uploaded:", file);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Conversations List */}
      <div
        className={`w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          selectedChat ? "hidden md:block" : ""
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Messages
          </h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-6rem)]">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
            >
              <div className="relative">
                <img
                  src={conv.user.avatar}
                  alt={conv.user.name}
                  className="w-12 h-12 rounded-full"
                />
                {conv.user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {conv.user.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conv.lastMessage.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {conv.lastMessage.text}
                  </p>
                  {conv.lastMessage.unread && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedChat ? "hidden md:flex" : ""
        }`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <img
                  src={selectedChat.user.avatar}
                  alt={selectedChat.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {selectedChat.user.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedChat.user.university}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  <Phone size={20} />
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  <Video size={20} />
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.isSender
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-gray-200">
                        {message.time}
                      </span>
                      {message.isSender && (
                        <CheckCheck size={16} className="text-gray-200" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  <ImageIcon size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <UserCircle size={64} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Select a Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
