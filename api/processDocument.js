const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const FormData = require("form-data");
require("dotenv").config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "<your-openai-key>";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "<your-gemini-key>";
const IS_OLLAMA = process.env.IS_OLLAMA === "true";
const IS_GEMINI = process.env.IS_GEMINI === "true";

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

/**
 * POST /process-document
 * Accepts a document file and sends it to either OpenAI, Gemini, or Ollama for processing.
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
    const fileName = req.file.originalname;
    const prompt = `What are the contents of the given document?`;

    let aiResponse;

    console.log("IS_OLLAMA:", IS_OLLAMA);
    console.log("IS_GEMINI:", IS_GEMINI);

    // **Using Ollama (No need to upload the document)**
    if (IS_OLLAMA) {
      console.log("Using Ollama AI...");

      // Read the document text (only needed for Ollama)
      const documentText = fs.readFileSync(filePath, "utf-8");

      const ollamaPayload = {
        model: "llama3",
        prompt: `${prompt}\n\n${documentText}`,
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
      console.log("Ollama response:", aiResponse);
    }

    // **Using Gemini API**
    else if (IS_GEMINI) {
      console.log("Uploading file to Gemini API...");

      // Read file content to base64 (Gemini requires base64 encoded files)
      const fileData = fs.readFileSync(filePath, { encoding: "base64" });

      const geminiPayload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "application/pdf", // Change based on file type
                  data: fileData,
                },
              },
            ],
          },
        ],
      };

      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        geminiPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      aiResponse = geminiResponse.data.candidates[0]?.content?.parts[0]?.text;
      console.log("Gemini response:", aiResponse);
    }

    // **Using OpenAI (Upload document first)**
    else {
      console.log("Uploading file to OpenAI...");

      // Create form-data for OpenAI file upload
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath));
      formData.append("purpose", "assistants");

      // Upload file to OpenAI
      const uploadResponse = await axios.post(
        "https://api.openai.com/v1/files",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const fileId = uploadResponse.data.id;
      console.log(`File uploaded successfully. OpenAI File ID: ${fileId}`);

      const openAiPayload = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at document analysis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        file_ids: [fileId], // OpenAI no longer supports this, might need file search API instead
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

      aiResponse = openAiResponse.data.choices[0]?.message?.content;
      console.log("OpenAI response:", aiResponse);

      // Delete the file from OpenAI after processing
      await axios.delete(`https://api.openai.com/v1/files/${fileId}`, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      });
      console.log(`Deleted file ${fileId} from OpenAI.`);
    }

    // **Delete the local file after processing**
    fs.unlinkSync(filePath);
    console.log(`Deleted local file: ${fileName}`);

    return res.json({
      message: "Document processed successfully",
      response: aiResponse,
    });
  } catch (error) {
    console.error(
      "Error processing document:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
