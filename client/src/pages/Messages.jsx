import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Image as ImageIcon,
  MoreVertical,
  ChevronLeft,
  UserCircle,
  CheckCheck,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const Messages = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(location.state?.selectedChat || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef({});

  // New state for user search and modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Configure axios
  axios.defaults.baseURL = 'http://localhost:5000';
  axios.defaults.withCredentials = true;

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !currentUser) return;

    const newSocket = io('http://localhost:5000', {
      auth: {
        token: `Bearer ${token}`
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Handle new messages
    newSocket.on('new_message', ({ message, conversationId }) => {
      console.log('Received new message:', message, 'for conversation:', conversationId);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Handle conversation updates
    newSocket.on('conversation_update', (updatedConversation) => {
      console.log('Conversation update received:', updatedConversation);
      setConversations(prev => 
        prev.map(conv => 
          conv._id === updatedConversation._id 
            ? updatedConversation
            : conv
        )
      );
    });

    // Handle online users
    newSocket.on('online_users', (users) => {
      setOnlineUsers(new Set(users));
    });

    newSocket.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    newSocket.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Handle typing events
    newSocket.on('typing', ({ conversationId, senderId }) => {
      if (selectedChat?._id === conversationId && senderId !== currentUser._id) {
        setIsTyping(prev => ({ ...prev, [conversationId]: true }));
      }
    });

    newSocket.on('stop_typing', ({ conversationId }) => {
      setIsTyping(prev => {
        const newState = { ...prev };
        delete newState[conversationId];
        return newState;
      });
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.off('new_message');
        newSocket.off('conversation_update');
        newSocket.off('online_users');
        newSocket.off('user_online');
        newSocket.off('user_offline');
        newSocket.off('typing');
        newSocket.off('stop_typing');
        newSocket.close();
      }
    };
  }, [currentUser]);

  // Add effect to handle conversation room joining/leaving
  useEffect(() => {
    if (!socket || !selectedChat) return;

    // Join the conversation room
    console.log('Joining conversation room:', selectedChat._id);
    socket.emit('join_conversation', selectedChat._id);

    // Leave the conversation room when unmounting or changing conversations
    return () => {
      console.log('Leaving conversation room:', selectedChat._id);
      socket.emit('leave_conversation', selectedChat._id);
    };
  }, [socket, selectedChat?._id]);

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/user/user-data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle typing status
  const handleTyping = () => {
    if (!socket || !selectedChat) return;

    const recipientId = selectedChat.participants.find(p => p._id !== currentUser?._id)?._id;
    if (!recipientId) return;

    socket.emit('typing', {
      conversationId: selectedChat._id,
      recipientId
    });

    if (typingTimeoutRef.current[selectedChat._id]) {
      clearTimeout(typingTimeoutRef.current[selectedChat._id]);
    }

    typingTimeoutRef.current[selectedChat._id] = setTimeout(() => {
      socket.emit('stop_typing', {
        conversationId: selectedChat._id,
        recipientId
      });
    }, 1000);
  };

  // Update conversation with new message
  const updateConversationWithNewMessage = (conversationId, message) => {
    setConversations(prev => 
      prev.map(conv => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCounts: conv.unreadCounts.map(uc =>
              uc.user === currentUser?._id
                ? { ...uc, count: uc.count + 1 }
                : uc
            )
          };
        }
        return conv;
      })
    );
  };

  // Search users function
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      return;
    }

    try {
      setSearchingUsers(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/user/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSearchedUsers(response.data.data);
      } else {
        console.error('Error searching users:', response.data.message);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchingUsers(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userSearchTerm) {
        searchUsers(userSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userSearchTerm]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socket) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/messages/conversations/${selectedChat._id}/messages`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNewMessage("");
        // The message will be added to the list through the socket event
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      // First upload the image
      const uploadResponse = await axios.post('/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const imageUrl = uploadResponse.data.url;

      // Then send the message with the image URL
      const response = await axios.post(
        `/api/messages/conversations/${selectedChat._id}/messages`,
        { text: '', image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      
      // Update the conversation's last message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === selectedChat._id 
            ? { ...conv, lastMessage: response.data }
            : conv
        )
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleStartConversation = async (selectedUser) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      if (!selectedUser?._id) {
        console.error('No valid user selected');
        return;
      }

      const response = await axios.post(
        '/api/messages/conversations',
        { participantId: selectedUser._id },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        const conversation = response.data.data;
        setConversations(prev => [conversation, ...prev]);
        setSelectedChat(conversation);
        setShowNewChatModal(false);
        setUserSearchTerm("");
        setSearchedUsers([]);
      } else {
        console.error('Failed to create conversation:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating conversation:', error.response?.data || error.message);
    }
  };

  const getUnreadCount = (conversation) => {
    if (!currentUser) return 0;
    const unreadCount = conversation.unreadCounts?.find(
      uc => uc.user.toString() === currentUser._id
    );
    return unreadCount?.count || 0;
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants.find(p => p._id !== currentUser?._id);
    return otherParticipant?.displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  // Add input change handler with typing
  const handleMessageInputChange = (e) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Conversations List */}
      <div
        className={`w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          selectedChat ? "hidden md:block" : ""
        }`}
      >
        {/* Current User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={currentUser?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || '')}&background=0D8ABC&color=fff`}
              alt={currentUser?.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {currentUser?.displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser?.email}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="relative flex-1">
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
            <button
              onClick={() => setShowNewChatModal(true)}
              className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {filteredConversations.map((conv) => {
            const otherParticipant = conv.participants.find(p => p._id !== currentUser?._id);
            return (
              <div
                key={conv._id}
                onClick={() => setSelectedChat(conv)}
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${
                  selectedChat?._id === conv._id ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={otherParticipant?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.displayName)}&background=0D8ABC&color=fff`}
                    alt={otherParticipant?.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {otherParticipant?.displayName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conv.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {conv.lastMessage?.text || 'Start a conversation'}
                    </p>
                    {getUnreadCount(conv) > 0 && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                New Conversation
              </h2>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setUserSearchTerm("");
                  setSearchedUsers([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {searchingUsers ? (
                  <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                    Searching...
                  </div>
                ) : searchedUsers.length > 0 ? (
                  searchedUsers.map((searchedUser) => (
                    <div
                      key={searchedUser._id}
                      onClick={() => handleStartConversation(searchedUser)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <img
                        src={searchedUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(searchedUser.displayName)}&background=0D8ABC&color=fff`}
                        alt={searchedUser.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {searchedUser.displayName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {searchedUser.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : userSearchTerm ? (
                  <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                    No users found
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                    Search for users to start a conversation
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                {selectedChat && (
                  <>
                    <img
                      src={selectedChat.participants.find(p => p._id !== currentUser?._id)?.photo || 
                           `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.participants.find(p => p._id !== currentUser?._id)?.displayName)}&background=0D8ABC&color=fff`}
                      alt={selectedChat.participants.find(p => p._id !== currentUser?._id)?.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {selectedChat.participants.find(p => p._id !== currentUser?._id)?.displayName}
                      </h3>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
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
                  key={message._id}
                  className={`flex ${
                    message.sender._id === currentUser?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.sender._id === currentUser?._id
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    }`}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Message attachment" 
                        className="max-w-full rounded-lg mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-gray-200">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.sender._id === currentUser?._id && (
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
                  onChange={handleMessageInputChange}
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

      {/* Add typing indicator */}
      {isTyping[selectedChat?._id] && (
        <div className="text-sm text-gray-500 italic ml-4 mb-2">
          Typing...
        </div>
      )}
      {/* Add online status indicator */}
      {selectedChat && (
        <div className={`w-2 h-2 rounded-full ${
          onlineUsers.has(selectedChat.participants.find(p => p._id !== currentUser?._id)?._id)
            ? 'bg-green-500'
            : 'bg-gray-500'
        }`} />
      )}
    </div>
  );
};

export default Messages;
