const express = require("express");
const axios = require("axios");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "<your-openai-key>";
const IS_OLLAMA = process.env.IS_OLLAMA === "true";

// Configure Multer with a correct file storage directory
const upload = multer({ dest: "uploads/" });

/**
 * POST /process-document
 * Accepts a document file (text, PDF, etc.), reads content, and processes it with AI.
 */
router.post("/process-document", upload.single("doc"), async (req, res) => {
  console.log("Processing document...");

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Missing document file in request." });
    }

    const filePath = req.file.path;

    // Read the document file
    const documentText = fs.readFileSync(filePath, "utf-8");

    const commonPrompt =
      "Analyze the following document and summarize the key points:\n\n" +
      documentText;

    let aiResponse;
    console.log("IS_OLLAMA", IS_OLLAMA);

    if (IS_OLLAMA) {
      console.log("Using Ollama AI...");

      const ollamaPayload = {
        model: "llama3",
        prompt: commonPrompt,
        stream: false,
      };
      const ollamaResponse = await axios.post(
        "http://localhost:11434/api/generate",
        ollamaPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      aiResponse = ollamaResponse.data.response || ollamaResponse.data.text;
      console.log("Ollama response:", ollamaResponse);
    } else {
      console.log("Using OpenAI API...");

      const openAiPayload = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: commonPrompt },
        ],
      };

      const openAiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        openAiPayload,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("OpenAI response:", openAiResponse);
      aiResponse = openAiResponse.data.choices[0]?.message?.content;
    }

    fs.unlinkSync(filePath);

    return res.json({
      message: "Document processed successfully",
      response: aiResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
