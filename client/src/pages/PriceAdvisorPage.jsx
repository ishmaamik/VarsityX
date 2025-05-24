import React, { useState } from "react";
import axios from "axios";

const conditionColors = {
  "Like New": "bg-emerald-100 text-emerald-700 border-emerald-300",
  Good: "bg-sky-100 text-sky-700 border-sky-300",
  Fair: "bg-amber-100 text-amber-700 border-amber-300",
  Poor: "bg-rose-100 text-rose-700 border-rose-300",
  Unknown: "bg-gray-100 text-gray-700 border-gray-300",
};

const PriceAdvisorPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/price-advisor",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error("Error:", err);
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getConditionClass = (condition) => {
    if (!condition) return conditionColors["Unknown"];
    const key = Object.keys(conditionColors).find(
      (k) => k.toLowerCase() === condition.toLowerCase()
    );
    return conditionColors[key] || conditionColors["Unknown"];
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-sky-50 to-white flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-stretch">
        {/* Left: Upload & Preview */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white/80 rounded-3xl shadow-lg p-10 border border-sky-100">
          <h1 className="text-5xl font-black text-emerald-700 mb-8 text-center tracking-tight drop-shadow-lg">
            Price & Condition Advisor
          </h1>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-8"
          >
            <label className="block text-xl font-semibold text-sky-700 mb-2">
              Upload a clear photo of your item
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full border-2 border-sky-200 p-4 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition bg-sky-50 text-sky-900"
              accept="image/*"
            />
            {preview && (
              <div className="flex justify-center mt-6">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-72 h-72 object-contain rounded-2xl border-2 border-sky-100 shadow-xl bg-white"
                />
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-4 text-xl font-bold rounded-xl transition-all duration-200 shadow-lg mt-6 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-sky-400 hover:from-emerald-600 hover:to-sky-500 text-white"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze & Suggest Price"
              )}
            </button>
          </form>
        </div>
        {/* Right: Result Section */}
        <div className="flex-1 flex items-center justify-center">
          {result ? (
            <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl p-10 border border-emerald-100 flex flex-col items-center animate-fade-in">
              <h2 className="text-3xl font-bold text-sky-700 mb-6 flex items-center gap-2">
                <span role="img" aria-label="Price Tag">💸</span>
                Your Item Analysis
              </h2>
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex flex-col items-center w-full">
                  <span className="text-lg text-gray-500">Estimated Price</span>
                  <span className="text-5xl font-extrabold text-emerald-600 drop-shadow mb-2">
                    {result.estimatedPrice || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="text-lg text-gray-500">Condition</span>
                  <span className={`mt-1 px-6 py-2 rounded-full border font-bold text-lg shadow-sm ${getConditionClass(result.condition)}`}>
                    {result.condition || "Unknown"}
                  </span>
                </div>
                <div className="flex flex-col items-center w-full mt-2">
                  <span className="text-lg text-gray-500">Confidence</span>
                  <div className="w-full flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-sky-400 h-4 rounded-full transition-all duration-500"
                        style={{ width: result.confidence !== undefined ? `${Math.round(result.confidence * 100)}%` : "0%" }}
                      ></div>
                    </div>
                    <span className="text-base font-semibold text-sky-700 min-w-[48px] text-right">
                      {result.confidence !== undefined
                        ? `${Math.round(result.confidence * 100)}%`
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="w-full mt-6 p-5 bg-sky-50 rounded-2xl border border-sky-100 text-sky-800 text-lg text-center shadow">
                  {result.comment || result.error}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-lg flex flex-col items-center justify-center text-sky-300 text-xl italic min-h-[350px]">
              <span className="mb-4">Upload an item image to get started.</span>
              <span className="text-7xl">🧠</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-14 w-full max-w-5xl text-center text-sky-700 text-lg md:text-xl">
        <div className="mb-4 font-bold text-2xl text-emerald-700">How it works</div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          <div className="flex-1 bg-white/80 rounded-2xl p-6 border border-emerald-100 shadow">
            <div className="font-semibold text-emerald-600 mb-2">1. Condition Estimator</div>
            <div className="text-sky-800">AI analyzes your item's photo to estimate its condition (e.g., Like New, Good, Fair, Poor).</div>
          </div>
          <div className="flex-1 bg-white/80 rounded-2xl p-6 border border-emerald-100 shadow">
            <div className="font-semibold text-emerald-600 mb-2">2. Price Advisor</div>
            <div className="text-sky-800">Suggests a fair market price for student sellers, factoring in condition and platform data.</div>
          </div>
          <div className="flex-1 bg-white/80 rounded-2xl p-6 border border-emerald-100 shadow">
            <div className="font-semibold text-emerald-600 mb-2">3. Confidence Score</div>
            <div className="text-sky-800">Shows how certain the AI is about its assessment, so you can list with confidence.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PriceAdvisorPage;
