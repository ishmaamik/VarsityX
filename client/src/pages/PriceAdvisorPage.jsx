import React, { useState } from "react";
import axios from "axios";

const PriceAdvisorPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResponseText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    setResponseText("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/price-advisor",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResponseText(res.data.generatedText);
    } catch (err) {
      console.error("Error:", err);
      setResponseText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Upload Item Image for Price Suggestion
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 p-3 rounded-lg"
          accept="image/*"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-full rounded-lg shadow"
          />
        )}

        <button
          type="submit"
          className={`w-full py-3 text-white font-medium rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Submit Image"}
        </button>
      </form>

      {responseText && (
        <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">
            Gemini Price Suggestion:
          </h2>
          <pre className="whitespace-pre-wrap">{responseText}</pre>
        </div>
      )}
    </div>
  );
};
export default PriceAdvisorPage;
