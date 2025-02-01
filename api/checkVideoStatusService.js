const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const firebaseConfig = require("./firebase.config");

const router = express.Router();
const API_KEY = process.env.HEYGEN_API_KEY || "<your-api-key>";

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

/**
 * GET /check-video-status/:videoId
 * Checks if the video is ready, saves it locally, and uploads to Firebase Storage.
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

    console.log("status response:", statusResponse.data);

    if (status === "completed") {
      const videoUrl = statusResponse.data.data.video_url;
      console.log(`Video ${videoId} is ready. Downloading...`);

      const videoResponse = await axios.get(videoUrl, {
        responseType: "stream",
      });

      // Ensure the local "videos" directory exists
      const videosDir = path.join(__dirname, "videos");
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      const localFilePath = path.join(videosDir, `${videoId}.mp4`);
      const writer = fs.createWriteStream(localFilePath);
      videoResponse.data.pipe(writer);

      writer.on("finish", async () => {
        console.log(`Video saved locally: ${localFilePath}`);

        // Upload to Firebase Storage
        const storageRef = ref(storage, `videos/${videoId}.mp4`);
        const videoBuffer = fs.readFileSync(localFilePath);
        const metadata = { contentType: "video/mp4" };

        const uploadTask = uploadBytesResumable(
          storageRef,
          videoBuffer,
          metadata
        );

        uploadTask
          .then(async (snapshot) => {
            console.log("Video uploaded to Firebase Storage");

            // Get the public download URL
            const firebaseVideoUrl = await getDownloadURL(snapshot.ref);
            console.log(`Firebase Video URL: ${firebaseVideoUrl}`);

            // Delete local file after successful upload
            fs.unlinkSync(localFilePath);

            return res.json({
              message: "Video is ready and uploaded to Firebase",
              videoUrl: firebaseVideoUrl,
            });
          })
          .catch((uploadError) => {
            console.error("Upload error:", uploadError);
            return res
              .status(500)
              .json({ error: "Error uploading video to Firebase" });
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

module.exports = router;
