const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const proposalRoutes = require("./routes/proposalRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(
  cors({
    origin: [
      "https://proposal.thedigitechsolutions.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Handle preflight requests explicitly
app.options("*", cors());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const path = require("path");

// Health Check
app.get("/api/health", (req, res) =>
  res.status(200).json({ status: "ok", timestamp: new Date() })
);

app.use("/api", proposalRoutes);

// Catch-all for API 404s
app.use("/api/*", (req, res) => {
  console.log(`404 Hit: ${req.method} ${req.url}`);
  res.status(404).json({ error: "API Route Not Found", path: req.url });
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
