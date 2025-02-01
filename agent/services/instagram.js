require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const axios = require("axios");
const { Buffer } = require("buffer");

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
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const coverResponse = await axios.get(coverUrl, { responseType: 'arraybuffer' });

    // Convert the responses to Buffers
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');
    const coverBuffer = Buffer.from(coverResponse.data, 'binary');

    const publishResult = await ig.publish.video({
      video: videoBuffer,
      coverImage: coverBuffer,
      caption: caption,
    });

    console.log("Video uploaded successfully:", publishResult);
    return publishResult; // Return the result for further processing if needed
  } catch (error) {
    console.error("Error posting video to Instagram:", error);
    throw error; // Rethrow the error to handle it in the API endpoint
  }
};

const postToInsta = async (imageUrl, caption) => { 
  try {
    console.log("IG_USERNAME:", process.env.IG_USERNAME);
    console.log("IG_PASSWORD:", process.env.IG_PASSWORD ? "Loaded" : "Not Loaded");

    if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD) {
      throw new Error("Missing Instagram credentials in .env");
    }

    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    console.log("Logged in as:", loggedInUser.username);

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // const imageBuffer = await get({
    //   url: imageUrl,
    //   encoding: null,
    // }).catch(err => {
    //   throw new Error("Error fetching image: " + err.message);
    // });

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

module.exports = { postToInsta, postVideoToInsta }; // Export the function