require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");

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
      caption:
        "Really nice photo from the internError posting to Instagram:et!",
    });

    console.log("Post uploaded successfully!");
  } catch (error) {
    console.error("Error posting to Instagram:", error);
  }
};
