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

    const prompt = `As a student marketplace pricing expert in Bangladesh, analyze this image and provide a structured analysis with the following specific details only:

HEAD: Brief name/type of the item (1 line)
PRICE: Recommended price range in ৳ (Taka)
MARKET: Current market value in ৳ (Taka)
CONDITION: Item condition rating (Excellent/Good/Fair/Poor)
DEMAND: Current market demand (High/Medium/Low)
INSIGHTS: Key factors affecting price (2-3 bullet points)

Format the response exactly with these headings. Keep it brief and to-the-point.`;

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