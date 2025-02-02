import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Paper,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useBusinessContext } from "../context/BusinessContext";

// Styled component for the upload button
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Home() {
  const { setBusinessId } = useBusinessContext();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("doc", file);

      try {
        const response = await axios.post(
          "http://localhost:3000/process-document",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setBusinessId(response.data.businessId);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h2" component="h1" fontWeight="bold">
            AI-Powered Marketing Automation
          </Typography>

          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Optimize your digital marketing campaigns with our intelligent
            multi-agent system
          </Typography>

          <Button
            component="label"
            variant="contained"
            size="large"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 4 }}
          >
            Upload Campaign Data
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>
        </Stack>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

const features = [
  {
    title: "Intelligent Campaign Optimization",
    description:
      "Our AI agents analyze customer behavior and market trends to automatically optimize your marketing campaigns.",
  },
  {
    title: "Smart Budget Allocation",
    description:
      "Maximize ROI with intelligent budget distribution across different marketing channels and campaigns.",
  },
  {
    title: "Personalized Marketing Strategies",
    description:
      "Create targeted campaigns with AI-driven insights for better customer engagement and conversion rates.",
  },
];
