import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mic, Image as ImageIcon, Send } from "lucide-react";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chatHistory]);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input && !image) return;

    setIsProcessing(true);
    const userMessage = {
      type: "user",
      content: input || "Image uploaded",
      imagePreview: image ? URL.createObjectURL(image) : null,
    };
    setChatHistory((prev) => [...prev, userMessage]);

    const formData = new FormData();
    if (input) formData.append("text", input);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/api/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: res.data.response,
          isText: !!image, // Format as text block for image responses
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Processing failed. Please try again.",
        },
      ]);
    } finally {
      setInput("");
      setImage(null);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-zinc-800 rounded-lg shadow-lg">
        <div className="text-center p-4 border-b border-gray-700 text-teal-400">
          <h2 className="text-2xl font-bold">Smart Text Extractor</h2>
          <p className="text-sm">Upload images or speak to extract text</p>
        </div>

        <div
          ref={chatRef}
          className="h-[400px] overflow-y-auto p-4 space-y-3 bg-zinc-800"
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.type === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-700 text-teal-100"
                }`}
              >
                {msg.imagePreview && (
                  <img
                    src={msg.imagePreview}
                    alt="uploaded"
                    className="mb-2 rounded max-h-40"
                  />
                )}
                {msg.isText ? (
                  <div className="whitespace-pre-wrap font-mono text-sm bg-gray-800 p-2 rounded">
                    {msg.content}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-center">
              <div className="animate-pulse text-gray-400">
                {image ? "Extracting text..." : "Processing..."}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isProcessing}
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isProcessing}
              className="bg-purple-700 p-2 rounded cursor-pointer disabled:opacity-50"
            >
              <ImageIcon size={16} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={image ? "Add description (optional)" : "Type or speak..."}
              disabled={isProcessing}
              className="flex-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`p-2 rounded ${
                isListening ? "bg-green-600 animate-pulse" : "bg-fuchsia-600"
              } disabled:opacity-50`}
            >
              <Mic size={18} />
            </button>

            <button
              type="submit"
              disabled={isProcessing || (!input && !image)}
              className="bg-emerald-600 p-2 rounded disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          {image && (
            <div className="mt-2 text-xs text-gray-400 flex justify-between">
              <span>{image.name}</span>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chatbot;