const mongoose = require("mongoose");

const MasterPromptSchema = new mongoose.Schema({
  content: { type: String, required: true }, // The evolved master prompt
  lastUpdated: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
});

module.exports = mongoose.model("MasterPrompt", MasterPromptSchema);
