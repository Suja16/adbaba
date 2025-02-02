import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import TwitterSuggestions from "../components/TwitterSuggestions";
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
      {/* <Typography variant="h1"> {pageName}</Typography> */}
      {normalizedPage == "twitter" && (
        <TwitterSuggestions
          bId="8e246e2f-6558-4e66-830f-30414224f64c
"
        />
      )}
    </Box>
  );
}
