import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  console.log("🔹 Received prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    console.log("✅ Gemini reply:", reply);
    res.json({ response: reply });
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Gemini API call failed." });
  }
});

export default router;
