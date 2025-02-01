// const axios = require("axios");

// async function generateTweet() {
//   const url = "https://7e38-2402-3a80-6d7-98aa-517d-394b-57f-3960.ngrok-free.app/api/chat";
//   const data = {
//     model: "deepseek-r1:8b",
//     messages: [
//       {
//         role: "user",
//         content: "Generate a Twitter tweet with a punch of latest meme or latest trends that might help spice up the tweet and helps a logistics company boost their engagement, lead generation, and sales."
//       }
//     ],
//     stream: false
//   };

//   try {
//     const response = await axios.post(url, data);
//     const fullContent = response.data.message.content;

//     const mainContent = fullContent.replace(/<think>[\s\S]*?<\/think>/, '').trim();

//     console.log("Generated Tweet:", mainContent);
//   } catch (error) {
//     console.error("❌ Error generating tweet with Ollama API:", error);
//   }
// }

// module.exports = { fetchLatestTrends };