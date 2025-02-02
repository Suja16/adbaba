import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import TwitterSuggestions from "../components/TwitterSuggestions";
import { useBusinessContext } from "../context/BusinessContext";
import NotFound from "./notFound";

const validPages = ["instagram", "twitter", "linkedin", "whatsapp", "facebook"];

export default function Suggestion() {
  const { pageName } = useParams(); // Get pageName from URL
  const normalizedPage = pageName?.toLowerCase();
  const { businessId } = useBusinessContext();
  if (!validPages.includes(normalizedPage!)) {
    return <NotFound />;
  }
  console.log(businessId);
  return (
    <Box>
      {/* <Typography variant="h1"> {pageName}</Typography> */}
      {normalizedPage == "twitter" && (
        <TwitterSuggestions bId={businessId || ""} />
      )}
    </Box>
  );
}
