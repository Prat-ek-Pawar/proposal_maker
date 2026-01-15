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
      "http://localhost:5173",
      "https://proposal-maker.celiyo.com",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const path = require("path");

app.use("/api", proposalRoutes);

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
