const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "<your-openai-key>";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "<your-gemini-key>";
const IS_OLLAMA = process.env.IS_OLLAMA === "true";
const IS_GEMINI = process.env.IS_GEMINI === "true";
const HASURA_GRAPHQL_URL = "https://datathon2025.hasura.app/v1/graphql";
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

/**
 * POST /generate-funnel-flow
 * Accepts a businessId and generates a marketing funnel flow using AI.
 */
router.post("/generate-funnel-flow", async (req, res) => {
  console.log("Generating funnel flow...");

  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: "Missing businessId in request." });
    }

    console.log("Fetching business data for:", businessId);

    // Fetch business data from Hasura
    const query = `
      query GetBusiness($id: uuid!) {
        businesses_by_pk(id: $id) {
          id
          name
          industry
          description
          website
          target_age_group
          target_gender
          customer_interests
          customer_behavior
          marketing_budget
          customer_acquisition_cost
          customer_lifetime_value
          ad_spend_distribution
          social_media_channels
          social_followers
          seo_rank
          email_subscribers
          primary_ad_channels
          content_strategy
          influencer_marketing
          target_location
        }
      }
    `;

    const hasuraResponse = await axios.post(
      HASURA_GRAPHQL_URL,
      {
        query,
        variables: { id: businessId },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
        },
      }
    );

    if (hasuraResponse.data.errors) {
      throw new Error(JSON.stringify(hasuraResponse.data.errors));
    }

    const businessData = hasuraResponse.data.data.businesses_by_pk;

    if (!businessData) {
      return res.status(404).json({ error: "Business not found" });
    }

    console.log("Business data retrieved:", businessData);

    const prompt = `Given the following business data, generate a structured marketing funnel flow that outlines steps from awareness to conversion.

Business Data:
${JSON.stringify(businessData, null, 2)}

### Funnel Flow Output:
- Awareness Stage:
  - Suggested strategies
  - Best platforms to use
- Consideration Stage:
  - Recommended engagement techniques
  - Content ideas
- Conversion Stage:
  - Suggested CTAs and offers
  - Retargeting strategies
- Retention Stage:
  - Customer loyalty tactics
  - Long-term engagement methods

Ensure that the funnel flow is aligned with the business's industry, target audience, and existing marketing channels. Return the final structured data in valid JSON format.`;

    let aiResponse;

    console.log("IS_OLLAMA:", IS_OLLAMA);
    console.log("IS_GEMINI:", IS_GEMINI);

    // **Using Ollama**
    if (IS_OLLAMA) {
      console.log("Using Ollama AI...");
      const ollamaPayload = {
        model: "llama3",
        prompt,
        stream: false,
      };

      const ollamaResponse = await axios.post(
        "http://localhost:11434/api/generate",
        ollamaPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      aiResponse = ollamaResponse.data.response || ollamaResponse.data.text;
      console.log("Ollama response:", aiResponse);
    }

    // **Using Gemini API**
    else if (IS_GEMINI) {
      console.log("Using Gemini AI...");
      const geminiPayload = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      };

      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        geminiPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      aiResponse = geminiResponse.data.candidates[0]?.content?.parts[0]?.text;
      console.log("Gemini response:", aiResponse);
    }

    // **Using OpenAI**
    else {
      console.log("Using OpenAI...");
      const openAiPayload = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert in marketing funnel strategies.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      };

      const openAiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        openAiPayload,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      aiResponse = openAiResponse.data.choices[0]?.message?.content;
      console.log("OpenAI response:", aiResponse);
    }

    // **Fix: Clean up AI response before parsing JSON**
    let funnelFlowData;
    try {
      const cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();
      funnelFlowData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError.message);
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    return res.json({
      message: "Funnel flow generated successfully",
      response: funnelFlowData,
    });
  } catch (error) {
    console.error(
      "Error generating funnel flow:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
