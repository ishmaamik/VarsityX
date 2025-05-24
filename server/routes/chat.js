import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

async function extractImageCaption(base64, mimeType) {
  const systemPrompt = `
You are a helpful assistant. Describe clearly what you see in the image. Respond with one sentence.
If the image is not clear, say 'The image could not be interpreted.'
`;

  const fakeVisualInput = `
Mime Type: ${mimeType}
Base64 (start): ${base64.slice(0, 100)}...
`;

  const response = await axios.post(
    `${GEMINI_TEXT_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: fakeVisualInput },
          ],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Image could not be interpreted.";
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let finalPrompt = req.body.prompt || "";
    const imageFile = req.file;

    if (imageFile) {
      const base64 = fs.readFileSync(imageFile.path, { encoding: "base64" });
      const caption = await extractImageCaption(base64, imageFile.mimetype);
      fs.unlinkSync(imageFile.path);
      finalPrompt += `\n\nImage description: ${caption}`;
    }

    console.log("🔹 Final Prompt to Gemini 2.0 Flash:", finalPrompt);

    const response = await axios.post(
      `${GEMINI_TEXT_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: finalPrompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ response: reply });

  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Gemini API call failed." });
  }
});

export default router;
