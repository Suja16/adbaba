require("dotenv").config();
const express = require("express");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser")
const cors = require("cors");

const { generateTweetText } = require("./services/generateTweet.js");
const { postTweet } = require("./services/postTweet.js");
const { postToInsta, postVideoToInsta, postStoryWithStickers } = require("./services/instagram.js");

const app = express();
const PORT = process.env.PORT || 3002;
const HASURA_GRAPHQL_URL = "https://datathon2025.hasura.app/v1/graphql";
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

/**
 * GET /api/generate-tweet/:id
 * Fetches business data using the provided ID and generates a tweet text.
 */
app.get("/api/generate-tweet/:id", async (req, res) => {
  const { id } = req.params;
  const { hasMedia } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Business ID is required." });
  }

  try {
    // GraphQL Query
    const query = `
      query MyQuery($id: uuid!) {
        businesses(where: {id: {_eq: $id}}) {
          ad_spend_distribution
          business_size
          content_strategy
          customer_acquisition_cost
          customer_behavior
          customer_interests
          customer_lifetime_value
          description
          email_subscribers
          founded_year
          hq_location
          id
          industry
          influencer_marketing
          marketing_budget
          name
          primary_ad_channels
          seo_rank
          social_followers
          social_media_channels
          target_age_group
          target_gender
          target_location
          website
          website_traffic
        }
      }
    `;

    // Request Payload
    const payload = {
      query,
      variables: { id },
    };

    const response = await axios.post(HASURA_GRAPHQL_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
    });

    // Log the full response
    console.log("Hasura response:", JSON.stringify(response.data, null, 2));

    if (response.data.errors) {
      console.error(
        "GraphQL Error:",
        JSON.stringify(response.data.errors, null, 2)
      );
      return res.status(500).json({
        error: "GraphQL query failed.",
        details: response.data.errors,
      });
    }

    const businessData = response.data.data?.businesses?.[0];

    if (!businessData) {
      return res.status(404).json({ error: "Business not found." });
    }

    // Generate Tweet Text
    const tweetText = await generateTweetText(businessData, hasMedia);
    if (tweetText) {
      res.json({ tweetText });
    } else {
      res.status(500).json({ error: "Failed to generate tweet text." });
    }
  } catch (error) {
    console.error("Error fetching business data:", error.message);
    res.status(500).json({ error: "Error fetching business data." });
  }
});

app.post("/api/post-tweet", async (req, res) => {
  const { tweetText, imageUrl } = req.body; // Accept imageUrl in the request body

  let mediaFilePath = null;

  try {
    // If an image URL is provided, download the image
    if (imageUrl) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const mediaData = Buffer.from(response.data, "binary");
      mediaFilePath = `uploads/${Date.now()}.jpg`; // Save the image with a unique name
      fs.writeFileSync(mediaFilePath, mediaData); // Write the image to the filesystem
    }

    await postTweet(tweetText, mediaFilePath);
    res.json({ message: "Tweet posted successfully." });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up the uploaded image file if it was created
    if (mediaFilePath) {
      fs.unlinkSync(mediaFilePath); // Remove the file after posting
    }
  }
});

app.post("/api/post-instagram", async (req, res) => {
  const { imageUrl, caption } = req.body;

  // Log the incoming request body
  console.log("Received request body:", req.body);

  if (!imageUrl || !caption) {
    return res
      .status(400)
      .json({ error: "Image URL and caption are required." });
  }

  try {
    // Log the imageUrl and caption before calling postToInsta
    console.log("Image URL:", imageUrl);
    console.log("Caption:", caption);

    await postToInsta(imageUrl, caption); // Call the function with parameters
    res.json({ message: "Post uploaded to Instagram successfully." });
  } catch (error) {
    console.error("Error posting to Instagram:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/post-video-instagram", async (req, res) => {
  const { videoUrl, coverUrl, caption } = req.body;

  // Log the incoming request body
  console.log("Received request body:", req.body);

  if (!videoUrl || !coverUrl || !caption) {
    return res
      .status(400)
      .json({ error: "Video URL, cover URL, and caption are required." });
  }

  try {
    const publishResult = await postVideoToInsta(videoUrl, coverUrl, caption); // Call the function with parameters
    res.json({
      message: "Video uploaded to Instagram successfully.",
      publishResult,
    });
  } catch (error) {
    console.error("Error posting video to Instagram:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/post-story', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required.' });
  }

  try {
    await postStoryWithStickers(imageUrl);
    return res.status(200).json({ message: 'Story posted successfully!' });
  } catch (error) {
    console.error("Error posting story:", error);
    return res.status(500).json({ error: 'Failed to post story to Instagram.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
