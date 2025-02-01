import { Image, ThumbDown, ThumbUp } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Tweet {
  id: number;
  content: string;
  hasMedia: boolean;
}

export default function TwitterSuggestions() {
  const [prompt, setPrompt] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([
    {
      id: 1,
      content: "Check out this amazing new product! #innovation",
      hasMedia: true,
    },
    {
      id: 2,
      content:
        "Just had an incredible experience with customer service. Kudos to the team!",
      hasMedia: false,
    },
  ]);

  const handleAccept = (id: number) => {
    alert(`Tweet ${id} accepted!`);
  };

  const handleReject = (id: number) => {
    alert(`Tweet ${id} rejected!`);
  };

  const generateNewSuggestion = () => {
    const newTweet: Tweet = {
      id: Math.random(),
      content: `New tweet suggestion based on: "${prompt}"`,
      hasMedia: Math.random() > 0.5,
    };
    setTweets([...tweets, newTweet]);
    setPrompt("");
  };

  return (
    <div style={{ margin: "auto", padding: "16px", maxWidth: "80vw" }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={11}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter prompt for new suggestion"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateNewSuggestion}
          >
            Generate
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        {tweets.map((tweet) => (
          <Grid item xs={12} md={6} key={tweet.id}>
            <Card>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {tweet.content}
                </Typography>
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
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
