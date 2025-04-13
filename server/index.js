/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { verifySignature } = require("@upstash/qstash/nextjs");
const dotenv = require("dotenv");
const { getAllSummaries, getSummaryById } = require("./db");
const { generateSummary } = require("./generateSummary");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple health check endpoint
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "QStash receiver server is running" });
});

// Add new endpoint to get all summaries
app.get("/api/summaries", async (req, res) => {
  try {
    const summaries = await getAllSummaries();
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});

// Add endpoint to get a specific summary by ID
app.get("/api/summaries/:id", async (req, res) => {
  try {
    const summary = await getSummaryById(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// Endpoint to receive QStash messages
app.post("/api/webhook", async (req, res) => {
  try {
    // Get the QStash signature from headers
    const signature = req.headers["upstash-signature"];

    if (!signature) {
      return res.status(401).json({ error: "Unauthorized: Missing signature" });
    }

    // Verify the signature
    const isValid = await verifySignature({
      signature,
      body: JSON.stringify(req.body),
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized: Invalid signature" });
    }

    // Fetch data from PostgreSQL
    const summaries = await getAllSummaries();

    // If the message contains an ID, fetch that specific summary
    let specificSummary = null;
    if (req.body.summaryId) {
      specificSummary = await getSummaryById(req.body.summaryId);
    }

    // Send a response
    res.status(200).json({
      status: "success",
      message: "Message received and processed successfully",
      receivedAt: new Date().toISOString(),
      data: req.body,
      summariesCount: summaries.length,
      specificSummary: specificSummary || undefined,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process message" });
  }
});

// New endpoint to process summaries
app.post("/api/process-summary", async (req, res) => {
  try {
    // Get the QStash signature from headers
    const signature = req.headers["upstash-signature"];

    if (!signature) {
      return res.status(401).json({ error: "Unauthorized: Missing signature" });
    }

    // Verify the signature
    const isValid = await verifySignature({
      signature,
      body: JSON.stringify(req.body),
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized: Invalid signature" });
    }

    // Log the received summary ID
    console.log(
      "Received summary processing request for ID:",
      req.body.summaryId
    );

    // Get the summary from the database
    const summary = await getSummaryById(req.body.summaryId);

    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }

    // Process the summary asynchronously
    // We don't await this to respond quickly to QStash
    generateSummary(summary.text, req.body.summaryId)
      .then(() => {
        console.log(`Summary ${req.body.summaryId} processed successfully`);
      })
      .catch((error) => {
        console.error(`Error processing summary ${req.body.summaryId}:`, error);
      });

    // Send a response immediately
    res.status(200).json({
      status: "success",
      message: "Summary processing request received and started",
      receivedAt: new Date().toISOString(),
      summaryId: req.body.summaryId,
    });
  } catch (error) {
    console.error("Error processing summary:", error);
    res.status(500).json({ error: "Failed to process summary" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`QStash receiver server running on port ${PORT}`);
});
