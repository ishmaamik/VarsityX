import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Updated model names
const GEMINI_TEXT_MODEL = "gemini-1.5-pro-latest";
const GEMINI_VISION_MODEL = "gemini-1.5-pro-latest"; // Same model handles both now
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const extractImageText = async (base64, mimeType) => {
  const response = await axios.post(
    `${BASE_URL}/${GEMINI_VISION_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{
        parts: [
          { 
            text: `Extract ALL text from this image exactly as it appears. 
            Preserve formatting, numbers, and symbols. 
            Return ONLY the raw extracted text with no commentary.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64
            }
          }
        ]
      }]
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No text found";
};

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let result = "";
    const userText = req.body.text;
    const imageFile = req.file;

    if (imageFile) {
      const base64 = fs.readFileSync(imageFile.path, { encoding: "base64" });
      const extractedText = await extractImageText(base64, imageFile.mimetype);
      fs.unlinkSync(imageFile.path);
      
      if (userText) {
        // Enhanced prompt when both image and text are provided
        const visionResponse = await axios.post(
          `${BASE_URL}/${GEMINI_VISION_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [
                { text: userText },
                {
                  inlineData: {
                    mimeType: imageFile.mimetype,
                    data: base64
                  }
                }
              ]
            }]
          }
        );
        result = visionResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || extractedText;
      } else {
        result = extractedText;
      }
    } else if (userText) {
      // Process text-only input with the latest model
      const response = await axios.post(
        `${BASE_URL}/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ 
            parts: [{ 
              text: userText 
            }] 
          }],
          generationConfig: {
            temperature: 0.5,
            topP: 1,
            topK: 32,
            maxOutputTokens: 4096
          }
        }
      );
      result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    } else {
      return res.status(400).json({ error: "No input provided" });
    }

    // Clean up response
    result = result.replace(/```/g, '').trim();
    res.json({ response: result });

  } catch (err) {
    console.error("API Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      error: "Processing failed",
      details: err.response?.data?.error?.message || err.message
    });
  }
});

// Add proper error handling middleware
router.use((err, req, res, next) => {
  console.error(err);
  if (req.file) {
    fs.unlinkSync(req.file.path);
  }
  res.status(500).json({ 
    error: "Processing failed",
    details: err.message 
  });
});

export default router;