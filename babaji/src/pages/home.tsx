import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Paper,
  Grid,
  LinearProgress,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useBusinessContext } from "../context/BusinessContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [businessId, setBusinessIdState] = useState(null); // State for business ID
  const { register, setValue, handleSubmit } = useForm(); // Initialize useForm

  const fetchBusinessData = async (id) => {
    const HASURA_GRAPHQL_URL = "https://datathon2025.hasura.app/v1/graphql"; // Replace with your Hasura GraphQL endpoint
    const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET; // Your Hasura admin secret

    const query = `
      query displayFormData($id: uuid!) {
        businesses(where: {id: {_eq: $id}}) {
          name
          industry
          description
          website
          founded_year
          hq_location
          business_size
          target_age_group
          target_gender
          customer_interests
          customer_behavior
          marketing_budget
          customer_acquisition_cost
          content_strategy
          target_location
        }
      }
    `;

    try {
      const response = await axios.post(
        HASURA_GRAPHQL_URL,
        {
          query,
          variables: { id },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
          },
        }
      );

      return response.data.data.businesses[0]; // Return the first business data
    } catch (error) {
      console.error("Error fetching business data:", error);
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("doc", file);

      setLoading(true);
      setProgress(0);

      try {
        const response = await axios.post(
          "http://localhost:3000/process-document",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total;
              const current = progressEvent.loaded;
              const percentCompleted = Math.round((current * 100) / total);
              setProgress(percentCompleted);
            },
          }
        );

        const { businessId } = response.data;
        setBusinessIdState(businessId); // Set the business ID state
        setBusinessId(businessId); // Set the context business ID

        // Fetch business data using the business ID
        const businessData = await fetchBusinessData(businessId);
        if (businessData) {
          // Pre-fill the form fields with the retrieved data
          Object.keys(businessData).forEach((key) => {
            setValue(key, businessData[key]); // Set form values
          });
        }

        // Simulate a 5-second loading time
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    }
  };

  const handleContinue = (data) => {
    // Handle the continue action (e.g., navigate to the next step)
    console.log("Continue with data:", data);
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

          {!loading ? (
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
          ) : (
            <Box sx={{ width: "100%", mt: 4 }}>
              <LinearProgress color="primary" value={progress} />
            </Box>
          )}

          {/* Render the pre-filled form if formData is available */}
          {businessId && (
            <Box sx={{ mt: 4, width: "100%" }}>
              <Stack spacing={2} component="form" onSubmit={handleSubmit(handleContinue)}>
                <TextField
                  label="Company Name"
                  {...register("name")}
                  fullWidth
                />
                <TextField
                  label="Industry"
                  {...register("industry")}
                  fullWidth
                />
                <TextField
                  label="Description"
                  {...register("description")}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label="Website"
                  {...register("website")}
                  fullWidth
                />
                <TextField
                  label="Headquarters Location"
                  {...register("hq_location")}
                  fullWidth
                />
                <TextField
                  label="Business Size"
                  {...register("business_size")}
                  fullWidth
                />
                <TextField
                  label="Target Age Group"
                  {...register("target_age_group")}
                  fullWidth
                />
                <TextField
                  label="Target Gender"
                  {...register("target_gender")}
                  fullWidth
                />
                <TextField
                  label="Customer Interests"
                  {...register("customer_interests")}
                  fullWidth
                />
                <TextField
                  label="Customer Behavior"
                  {...register("customer_behavior")}
                  fullWidth
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Continue
                </Button>
              </Stack>
            </Box>
          )}
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