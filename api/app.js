const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const processDocumentRouter = require("./processDocument");

const app = express();
app.use(express.json());

// Use your HeyGen API key here or set it as an environment variable.
const API_KEY = process.env.HEYGEN_API_KEY || "<your-api-key>";
const PORT = process.env.PORT || 3000;

/**
 * POST /generate-video
 * Generates an avatar video using the HeyGen API and saves it locally.
 */
app.post("/generate-video", async (req, res) => {
  try {
    const payload = {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: "Daisy-inskirt-20220818",
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: "Welcome to the HeyGen API!",
            voice_id: "2d5b0e6cf36f460aa7fc47e3eee4ba54",
          },
          background: {
            type: "color",
            value: "#008000",
          },
        },
      ],
      dimension: {
        width: 1280,
        height: 720,
      },
    };

    const generateResponse = await axios.post(
      "https://api.heygen.com/v2/video/generate",
      payload,
      {
        headers: {
          "X-Api-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const videoId = generateResponse.data.video_id || generateResponse.data.id;
    if (!videoId) {
      return res
        .status(500)
        .json({ error: "Video ID not returned from HeyGen API" });
    }

    let videoUrl = "";
    const pollInterval = 5000;
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      const statusResponse = await axios.get(
        `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
        {
          headers: { "X-Api-Key": API_KEY },
        }
      );

      const status = statusResponse.data.status;

      if (status === "completed") {
        videoUrl = statusResponse.data.video_url;
        break;
      } else if (status === "failed") {
        return res.status(500).json({ error: "Video generation failed" });
      }

      attempts++;
    }

    if (!videoUrl) {
      return res.status(500).json({ error: "Video generation timed out" });
    }

    const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
    const videosDir = path.join(__dirname, "videos");

    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }
    const localFilePath = path.join(videosDir, `${videoId}.mp4`);
    const writer = fs.createWriteStream(localFilePath);

    videoResponse.data.pipe(writer);

    writer.on("finish", () => {
      return res.json({
        message: "Video generated and saved locally",
        videoPath: localFilePath,
      });
    });

    writer.on("error", (err) => {
      return res
        .status(500)
        .json({ error: "Error writing video file", details: err.message });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Use the document processing route
app.use(processDocumentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the HeyGen & AI Document Processing API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
