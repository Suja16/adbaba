import { Box, TextField, IconButton, Paper } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

export default function ChatBubble({
  message,
  isUser,
  onAccept,
  onReject,
}: ChatBubbleProps) {
  const [editableMessage, setEditableMessage] = useState(message);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: 1,
      }}
    >
      <Paper
        sx={{
          padding: 2,
          backgroundColor: isUser ? "#e0f7fa" : "#f1f8e9",
          maxWidth: "60%",
          boxShadow: "none",
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={editableMessage}
          onChange={(e) => setEditableMessage(e.target.value)}
          multiline
          sx={{
            backgroundColor: "transparent",
            border: "none",
          }}
        />
        {!isUser && (
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IconButton color="primary" onClick={onAccept}>
              <CheckIcon />
            </IconButton>
            <IconButton color="secondary" onClick={onReject}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
