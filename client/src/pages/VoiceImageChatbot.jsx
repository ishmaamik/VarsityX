import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mic, Image as ImageIcon } from "lucide-react";
import { marked } from "marked";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

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
        setQuestion(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        alert("Voice input error");
        setIsListening(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question && !image) return;

    setGeneratingAnswer(true);

    setChatHistory((prev) => [
      ...prev,
      {
        type: "user",
        content: question || "[Image Uploaded]",
        imagePreview: image ? URL.createObjectURL(image) : null,
      },
    ]);

    const formData = new FormData();
    formData.append("prompt", question || "What is in this image?");
    if (image) formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", formData);
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", content: res.data.response },
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }

    setQuestion("");
    setImage(null);
    setGeneratingAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-zinc-800 rounded-lg shadow-lg">
        <div className="text-center p-4 border-b border-gray-700 text-teal-400">
          <h2 className="text-2xl font-bold">Smart Chatbot</h2>
          <p className="text-sm">Talk or upload an image to ask anything</p>
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
                {msg.imagePreview && (
                  <img
                    src={msg.imagePreview}
                    alt="uploaded"
                    className="mb-2 rounded max-h-40"
                  />
                )}
                {msg.type === "user" ? (
                  msg.content
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(msg.content || "[No content]"),
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {generatingAnswer && (
            <div className="text-center text-sm text-gray-400">Thinking...</div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-700 space-y-2"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question or describe the image..."
            rows={2}
            disabled={generatingAnswer}
            className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600"
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor="imageUpload"
              className="bg-purple-700 p-2 rounded cursor-pointer"
            >
              <ImageIcon size={16} />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

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

            <button
              type="submit"
              disabled={generatingAnswer}
              className="ml-auto bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
