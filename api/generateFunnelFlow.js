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

    const prompt = `Given the following business data, generate a structured marketing funnel flow that outlines steps from awareness to conversion. Ensure that you are giving the possible ideas and proposed solutions. Generate a JSON File for this.
 

Business Data:
${JSON.stringify(businessData, null, 2)}


For the funnel output flow:

Firstly, classify which leverage requires more attention: Media Leverage, Capital Leverage, Labour Leverage, Code Leverage. 

On the basis of this, identify channels where processes can be streamlined and improvised such that digital marketing campaigns are targeted to the relevant audience more effectively. Consider the opportunities with regards to paid advertisements, content and outreach. Identify areas for good lead magnet implementation with probable use cases and examples. Split them into different stages such as awareness, consideration, conversion, and retention stages with suggestions aligning with the business practices and strategies. 

When suggesting best platforms, give at most 3, and give reasons for the same. Ensure that they are aligning with the userbase and target audience. 

Finally, Ensure that the funnel flow is aligned with the industry processes, target audience and existing marketing channels. Return the final structure in a valid JSON Format.`;

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

    // Second AI call to generate visualization
    const visualizationPrompt = {
      role: "system",
      content: `You are a data visualization expert. Convert the following marketing funnel data into a ReactFlow graph structure. 
      Create nodes and edges that represent the hierarchical relationship between different elements.
      
      Rules:
      1. Each node must have unique id, position (x,y coordinates), and data properties
      2. Root node should be "Marketing Funnel" at the top
      3. Connect nodes using edges with unique ids
      4. Maintain clear visual hierarchy
      5. Return only valid JSON with 'nodes' and 'edges' arrays
      6. Use consistent spacing between nodes
      7. Position nodes to avoid overlapping
      
      Structure the nodes in this hierarchy:
      - Marketing Funnel (root)
        - Leverage Types (Media, Capital, Labor, Code)
          - Specific Strategies
            - Funnel Stages (Awareness, Consideration, etc.)
      
      Here's the funnel data to visualize: ${JSON.stringify(funnelFlowData)}`,
    };

    const visualizationMessages = [
      visualizationPrompt,
      {
        role: "user",
        content:
          "Generate the ReactFlow visualization data following the specified structure.",
      },
    ];

    let flowResponse;

    if (IS_OLLAMA) {
      const flowOllamaResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3",
          prompt: visualizationPrompt,
          stream: false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      flowResponse = flowOllamaResponse.data.response;
    } else if (IS_GEMINI) {
      const flowGeminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: visualizationPrompt }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      flowResponse =
        flowGeminiResponse.data.candidates[0]?.content?.parts[0]?.text;
    } else {
      const flowOpenAiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: visualizationMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      flowResponse = flowOpenAiResponse.data.choices[0]?.message?.content;
    }

    let flowData;
    try {
      const cleanedFlowResponse = flowResponse
        .replace(/```json|```/g, "")
        .trim();
      flowData = JSON.parse(cleanedFlowResponse);
    } catch (parseError) {
      console.error("Error parsing flow response:", parseError.message);
      return res.status(500).json({ error: "Failed to parse flow response." });
    }

    return res.json({
      message: "Funnel flow generated successfully",
      response: funnelFlowData,
      flowData: flowData,
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
