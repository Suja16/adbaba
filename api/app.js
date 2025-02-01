const express = require("express");
require("dotenv").config();

const processDocumentRouter = require("./processDocument");
const generateVideoRouter = require("./generateVideoService");
const checkVideoStatusRouter = require("./checkVideoStatusService");
const generateFunnelFlowRouter = require("./generateFunnelFlow");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use(generateVideoRouter);
app.use(checkVideoStatusRouter);
app.use(processDocumentRouter);
app.use(generateFunnelFlowRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the HeyGen & AI Document Processing API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
