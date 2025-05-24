import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const base64 = file.buffer.toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You're an expert in digital marketplaces. Given the visual condition of this item and assuming it's being sold on a student platform, suggest a fair market price in Bangladeshi Taka (৳). Respond in this format:
{
  "estimatedPrice": "৳3500",
  "condition": "Good",
  "confidence": 0.87,
  "comment": "Based on visual analysis, this item appears to be lightly used and is reasonably valued at this price for a student marketplace."
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: file.mimetype,
        },
      },
    ]);

    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanText = text.replace(/```json|```/g, "").trim();

    res.json({ generatedText: cleanText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

export default router;