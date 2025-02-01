require("dotenv").config();
const path = require("path");
const { generateTweetText } = require("./generateTweet.js");
const { postTweet } = require("./postTweet.js");

async function server() {
  try {
    // const trends = await fetchLatestTrends();
    const tweetText = await generateTweetText();
    const mediaFilePath = path.join(__dirname, "images.png");

    if (tweetText) {
      await postTweet(tweetText, mediaFilePath);
    } else {
      console.error("❌ Failed to generate tweet text.");
    }
  } catch (error) {
    console.error("❌ Error in server function:", error);
  }
}

server();