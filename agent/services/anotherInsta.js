require("dotenv").config();
const InstagramPublisher = require('instagram-publisher'); // CommonJS import
const path = require("path");

// Initialize the Instagram Publisher client
const client = new InstagramPublisher({
  email: process.env.IG_EMAIL, // Your Instagram email
  password: process.env.IG_PASSWORD, // Your Instagram password
  verbose: true, // Enable verbose logging
});

// Function to post a single image
const postImage = async (imagePath, caption, location) => {
  const image_data = {
    image_path: imagePath,
    caption: caption,
    location: location, // optional
  };

  try {
    const post_published = await client.createSingleImage(image_data);
    console.log("Image posted successfully:", post_published);
    return post_published;
  } catch (error) {
    console.error("Error posting image:", error);
  }
};

// Function to post a slideshow of images
const postImageSlideshow = async (imagePaths, caption, location) => {
  const slideshow_data = {
    images: imagePaths,
    caption: caption,
    location: location, // optional
  };

  try {
    const post_published = await client.createImageSlideshow(slideshow_data);
    console.log("Slideshow posted successfully:", post_published);
    return post_published;
  } catch (error) {
    console.error("Error posting slideshow:", error);
  }
};

// Function to post a video
const postVideo = async (videoPath, thumbnailPath, caption, location) => {
  const video_data = {
    video_path: videoPath,
    thumbnail_path: thumbnailPath,
    caption: caption,
    location: location, // optional
  };

  try {
    const post_published = await client.createSingleVideo(video_data);
    console.log("Video posted successfully:", post_published);
    return post_published;
  } catch (error) {
    console.error("Error posting video:", error);
  }
};

// Function to post a reel
const postReel = async (videoPath, thumbnailPath, caption, location) => {
  const reel_data = {
    video_path: videoPath,
    thumbnail_path: thumbnailPath,
    caption: caption,
    location: location, // optional
  };

  try {
    const post_published = await client.createReel(reel_data);
    console.log("Reel posted successfully:", post_published);
    return post_published;
  } catch (error) {
    console.error("Error posting reel:", error);
  }
};

// Example usage
(async () => {
  await postImage(path.resolve(__dirname, './images.png'), 'Image caption', 'Chicago, United States');
  await postImageSlideshow([path.resolve(__dirname, './a.jpg'), path.resolve(__dirname, './b.jpg')], 'Slideshow caption', 'Chicago, United States');
  await postVideo(path.resolve(__dirname, './video.mp4'), path.resolve(__dirname, './thumbnail.jpg'), 'Video Post caption', 'Chicago, United States');
  await postReel(path.resolve(__dirname, './video.mp4'), path.resolve(__dirname, './thumbnail.jpg'), 'Reel caption', 'Chicago, United States');
})();