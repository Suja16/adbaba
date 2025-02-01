import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import NotFound from "./notFound";

const validPages = ["instagram", "twitter", "linkedin", "whatsapp", "facebook"];

export default function Suggestion() {
  const { pageName } = useParams(); // Get pageName from URL
  const normalizedPage = pageName?.toLowerCase();

  if (!validPages.includes(normalizedPage!)) {
    return <NotFound />;
  }

  return (
    <Box>
      <Typography variant="h1"> {pageName}</Typography>
    </Box>
  );
}
