require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const axios = require("axios");
const { Buffer } = require("buffer");
const { DateTime, Duration } = require("luxon");
const {
  StickerBuilder,
} = require("instagram-private-api/dist/sticker-builder");

const ig = new IgApiClient();

const postVideoToInsta = async (videoUrl, coverUrl, caption) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    // Attempt to log in without pre-login flow
    try {
      await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
      console.log("Logged in as:", process.env.IG_USERNAME);
    } catch (loginError) {
      console.error("Login failed:", loginError);
      throw new Error("Failed to log in to Instagram.");
    }

    // Fetch the video and cover image using axios
    const videoResponse = await axios.get(videoUrl, {
      responseType: "arraybuffer",
    });
    const coverResponse = await axios.get(coverUrl, {
      responseType: "arraybuffer",
    });

    // Convert the responses to Buffers
    const videoBuffer = Buffer.from(videoResponse.data, "binary");
    const coverBuffer = Buffer.from(coverResponse.data, "binary");

    const publishResult = await ig.publish.video({
      video: videoBuffer,
      coverImage: coverBuffer,
      caption: caption,
    });

    console.log("Video uploaded successfully:", publishResult);
    return publishResult;
  } catch (error) {
    console.error("Error posting video to Instagram:", error);
    throw error;
  }
};

const postToInsta = async (imageUrl, caption) => {
  try {
    console.log("IG_USERNAME:", process.env.IG_USERNAME);
    console.log(
      "IG_PASSWORD:",
      process.env.IG_PASSWORD ? "Loaded" : "Not Loaded"
    );

    if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD) {
      throw new Error("Missing Instagram credentials in .env");
    }

    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(
      process.env.IG_USERNAME,
      process.env.IG_PASSWORD
    );
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    console.log("Logged in as:", loggedInUser.username);

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    await ig.publish.photo({
      file: imageBuffer,
      caption: caption,
    });

    console.log("Post uploaded successfully!");
  } catch (error) {
    console.error("Error posting to Instagram:", error);
    throw error; // Rethrow the error to handle it in the API endpoint
  }
};

const postStoryWithStickers = async (imageUrl) => {
  try {
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log("Logged in as:", process.env.IG_USERNAME);

    // Fetch the image from the URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const file = Buffer.from(imageResponse.data, "binary");

  
    // Publish the story
    await ig.publish.story({file});

    console.log("Story posted successfully!");
  } catch (error) {
    console.error("Error posting story to Instagram:", error);
    throw error; // Rethrow the error to handle it in the API endpoint
  }
};

module.exports = { postToInsta, postVideoToInsta, postStoryWithStickers }; // Export the function
