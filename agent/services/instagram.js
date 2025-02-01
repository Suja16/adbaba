require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");
const fs = require("fs");
const path = require("path");

const postToInsta = async () => {
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

    const imageBuffer = await get({
      url: "https://i.imgur.com/xp9j1Dm.jpeg",
      encoding: null,
    }).catch((err) => {
      throw new Error("Error fetching image: " + err.message);
    });

    await ig.publish.photo({
      file: imageBuffer,
      caption: "Really nice photo from the internet!",
    });

    console.log("Post uploaded successfully!");
  } catch (error) {
    console.error("Error posting to Instagram:", error);
  }
};

const postVideoToInsta = async (
  videoUrl,
  caption = "Check out this awesome video! 🎥🔥"
) => {
  try {
    console.log("IG_USERNAME:", process.env.IG_USERNAME);
    console.log(
      "IG_PASSWORD:",
      process.env.IG_PASSWORD ? "Loaded" : "Not Loaded"
    );

    if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD) {
      throw new Error("Missing Instagram credentials in .env");
    }

    if (!videoUrl) {
      throw new Error("Video URL is required");
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
    console.log("Downloading video from:", videoUrl);

    // Fetch the video from Firebase Storage URL
    const videoBuffer = await get({
      url: videoUrl,
      encoding: null,
    }).catch((err) => {
      throw new Error("Error fetching video: " + err.message);
    });

    // Optional: Fetch a cover image from the video (use a separate service or default image if needed)
    const coverImageBuffer = videoBuffer; // For now, using the same video as cover image (change as needed)

    await ig.publish.video({
      video: videoBuffer,
      coverImage: coverImageBuffer, // Optional: Provide a thumbnail if needed
      caption,
    });

    console.log("Video uploaded successfully!");
  } catch (error) {
    console.error("Error posting video to Instagram:", error);
  }
};

module.exports = { postToInsta, postVideoToInsta };
