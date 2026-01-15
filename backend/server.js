const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// 1. Enhanced Permissive CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle Preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: "50mb" }));

// 2. Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const path = require("path");

// 3. API ROUTES (Explicitly defined to avoid router mounting issues)
const proposalController = require("./controllers/proposalController");

// Health Check
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

// Main API Routes
app.post("/api/generate-proposal", proposalController.generateProposal);
app.get("/api/history", proposalController.getHistory);
app.delete("/api/history/:id", proposalController.deleteHistory);

// Catch-all for UNMATCHED API routes (Must return JSON)
app.all(/^\/api\/.*/, (req, res) => {
  console.log(`API 404: ${req.method} ${req.url}`);
  res.status(404).json({ error: "API Route Not Found", path: req.url });
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
