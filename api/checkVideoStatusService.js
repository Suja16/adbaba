const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const router = express.Router();
const API_KEY = process.env.HEYGEN_API_KEY || "<your-api-key>";

/**
 * GET /check-video-status/:videoId
 * Checks if the video is ready and saves it if completed.
 */
router.get("/check-video-status/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ error: "Missing video ID." });
    }

    console.log(`Checking status for video: ${videoId}`);

    const statusResponse = await axios.get(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      {
        headers: { "X-Api-Key": API_KEY },
      }
    );

    const status = statusResponse.data.data.status;

    console.log("status response:", statusResponse);

    if (status === "completed") {
      const videoUrl = statusResponse.data.data.video_url;
      console.log(`Video ${videoId} is ready. Downloading...`);

      const videoResponse = await axios.get(videoUrl, {
        responseType: "stream",
      });
      const videosDir = path.join(__dirname, "videos");

      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      const localFilePath = path.join(videosDir, `${videoId}.mp4`);
      const writer = fs.createWriteStream(localFilePath);

      videoResponse.data.pipe(writer);

      writer.on("finish", () => {
        console.log(`Video saved: ${localFilePath}`);
        return res.json({
          message: "Video is ready and saved locally",
          videoPath: localFilePath,
        });
      });

      writer.on("error", (err) => {
        return res
          .status(500)
          .json({ error: "Error saving video", details: err.message });
      });
    } else if (status === "failed") {
      return res.status(500).json({ error: "Video generation failed." });
    } else {
      return res.json({
        message: "Video is still processing",
        status: status,
      });
    }
  } catch (error) {
    console.error(
      "Error checking video status:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router; // ✅ Ensure correct export
