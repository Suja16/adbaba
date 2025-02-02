import { Image, ThumbDown, ThumbUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface Tweet {
  id: number;
  content: string;
  hasMedia: boolean;
}

export default function TwitterSuggestions({ bId }: { bId: string }) {
  const [prompt, setPrompt] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bId) return;
    const fetchTweets = async () => {
      try {
        setLoading(true);
        console.log("Fetching tweets for bId:", bId);

        const response = await axios.get(
          `http://localhost:3002/api/generate-tweet/${bId}`,
          {
            timeout: 100000,
          }
        );
        console.log(response.data.tweetText.tweetContent);

        const tweetText = response.data.tweetText.tweetContent;
        const exampleTweets = [{ id: 1, content: tweetText, hasMedia: false }];
        setTweets(exampleTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [bId]);

  const handleAccept = async (id: number) => {
    try {
      await axios.post(`http://localhost:3002/api/post-tweet`, {
        tweetText: tweets.find((tweet) => tweet.id === id)?.content,
      });
      console.log("Tweet accepted and posted!");
      enqueueSnackbar("Tweet accepted and posted!", { variant: "success" });
      const newTweets = tweets.filter((tweet) => tweet.id !== id);
      setTweets(newTweets);
    } catch (error) {
      console.error("Error accepting tweet:", error);
    }
  };

  const handleReject = (id: number) => {
    alert(`Tweet ${id} rejected!`);
    const newTweets = tweets.filter((tweet) => tweet.id !== id);
    setTweets(newTweets);
  };

  const generateNewSuggestion = async () => {
    if (!prompt) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3002/api/generate-tweet/${bId}`,
        {
          timeout: 100000,
        }
      );
      console.log(response.data);

      const newTweet: Tweet = {
        id: tweets.length + 1,
        content: response?.data?.tweetText?.tweetContent,
        hasMedia: false,
      };
      setTweets([...tweets, newTweet]);
      setPrompt("");
    } catch (error) {
      console.error("Error generating new suggestion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "80vw", margin: "auto", padding: "16px" }}>
      <div style={{ marginBottom: "24px", display: "flex", gap: "8px" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter prompt for new suggestion"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button variant="contained" onClick={generateNewSuggestion}>
          Generate
        </Button>
      </div>
      {loading && (
        <Box
          sx={{
            width: "100%",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Social Media Agent Generating Tweets...
            </Typography>
            <LinearProgress />
          </Box>
        </Box>
      )}
      <div style={{ display: "grid", gap: "16px" }}>
        {tweets.map((tweet) => (
          <Card
            key={tweet.id}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <CardContent style={{ flexGrow: 1 }}>
              <p style={{ fontSize: "16px", marginBottom: "16px" }}>
                {tweet.content}
              </p>
              {tweet.hasMedia && (
                <div
                  style={{
                    backgroundColor: "#f0f0f0",
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  <Image style={{ fontSize: "48px", color: "#bbb" }} />
                </div>
              )}
            </CardContent>
            <CardActions style={{ justifyContent: "space-between" }}>
              <Button
                onClick={() => handleAccept(tweet.id)}
                variant="outlined"
                startIcon={<ThumbUp />}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleReject(tweet.id)}
                variant="outlined"
                startIcon={<ThumbDown />}
              >
                Reject
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}
