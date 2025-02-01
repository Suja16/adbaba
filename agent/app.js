require("dotenv").config();
const express = require("express");
const path = require("path");
const { generateTweetText } = require("./services/generateTweet.js");
const { postTweet } = require("./services/postTweet.js");
const { postToInsta } = require("./services/instagram.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/generate-tweet", async (req, res) => {
  try {
    const tweetText = await generateTweetText();
    if (tweetText) {
      res.json({ tweetText });
    } else {
      res.status(500).json({ error: "Failed to generate tweet text. " });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/post-tweet", async (req, res) => {
  const { tweetText } = req.body;
  const mediaFilePath = path.join(__dirname, "images.png");

  try {
    await postTweet(tweetText, mediaFilePath);
    res.json({ message: "Tweet posted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/post-instagram", async (req, res) => {
  try {
    await postToInsta();
    res.json({ message: "Post uploaded to Instagram successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
