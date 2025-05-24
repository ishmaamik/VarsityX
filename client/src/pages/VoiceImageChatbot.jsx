import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mic } from "lucide-react";
import { marked } from "marked";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        alert("Speech recognition error");
      };
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQuestion = question;
    setGeneratingAnswer(true);
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "user", content: currentQuestion },
    ]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        prompt: currentQuestion,
      });

      const reply = res.data.response;
      console.log("📥 Gemini reply:", reply);

      setChatHistory((prev) => [
        ...prev,
        { type: "bot", content: reply || "No reply received." },
      ]);
    } catch (err) {
      console.error("❌ API error:", err.message || err);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }

    setGeneratingAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-zinc-800 rounded-lg shadow-lg">
        <div className="text-center p-4 border-b border-gray-700 text-teal-400">
          <h2 className="text-2xl font-bold">Gemini Chatbot</h2>
          <p className="text-sm">Chat in English using text or voice</p>
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
                className={`max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.type === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-700 text-teal-100"
                }`}
              >
                {msg.type === "user" && msg.content}
                {msg.type === "bot" && msg.content && (
                  <span dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                )}
                {msg.type === "bot" && !msg.content && (
                  <span className="text-red-400">[No content]</span>
                )}
              </div>
            </div>
          ))}

          {generatingAnswer && (
            <div className="text-center text-sm text-gray-400">Thinking...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your message..."
              rows={2}
              disabled={generatingAnswer}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="flex-1 p-2 rounded-md bg-zinc-700 border border-zinc-600 text-white resize-none focus:outline-none focus:ring focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={generatingAnswer}
              className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500"
            >
              Send
            </button>
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={generatingAnswer || isListening}
              className={`p-2 rounded ${
                isListening ? "bg-green-600 animate-pulse" : "bg-fuchsia-600"
              }`}
            >
              <Mic size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
