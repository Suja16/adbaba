// require("dotenv").config();
const { twitterClient } = require("./twitterClient.js");
const fs = require("fs");
const path = require("path");

async function postTweet(tweetText, mediaFilePath) {
  try {
    const mediaData = fs.readFileSync(mediaFilePath);
    const mimeType = 'image/jpeg';

    const mediaId = await twitterClient.v1.uploadMedia(mediaData, {mimeType});

    const response = await twitterClient.v2.tweet({
      text: tweetText,
      media: {
        media_ids: [mediaId]
      }
    });
    console.log("✅ Tweet posted:", response);
  } catch (error) {
    console.error("❌ Error posting tweet:", error);
  }
}

module.exports = { postTweet };