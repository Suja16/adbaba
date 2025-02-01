const axios = require("axios");

async function generateTweetText(businessData) {
  const prompt = `“Generate a compelling and engaging tweet based on the following business data. The tweet should be concise, attention-grabbing, and optimized for engagement (likes, shares, and comments). It should align with the brand’s tone and target audience. Feel free to add relevant hashtags, emojis, and a call-to-action where appropriate.

Here is the business data:
${JSON.stringify(businessData)}

Guidelines:
	•	Keep it within Twitter’s character limit (280 characters).
	•	Use a casual, professional, or witty tone depending on the business context.
	•	Highlight key selling points, promotions, or unique aspects.
	•	Encourage engagement by asking a question, using a call-to-action, or leveraging trends.
	•	If relevant, include hashtags and emojis for better reach.

  Now, generate a tweet following these guidelines based on the provided business data.”
`;

  console.log(prompt);

  const url =
    "https://7e38-2402-3a80-6d7-98aa-517d-394b-57f-3960.ngrok-free.app/api/chat";
  const data = {
    model: "deepseek-r1:8b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: false,
  };

  try {
    const response = await axios.post(url, data);
    const fullContent = response.data.message.content;

    const mainContent = fullContent
      .replace(/<think>[\s\S]*?<\/think>/, "")
      .trim();

    console.log("Generated Tweet:", mainContent);
    return mainContent;
  } catch (error) {
    console.error("❌ Error generating tweet with Ollama API:", error);
    return null;
  }
}

module.exports = { generateTweetText };
