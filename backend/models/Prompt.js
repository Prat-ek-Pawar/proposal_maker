const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Filename, URL, or "Text Input"
  originalContent: { type: String }, // The raw text used for training
  visualData: { type: Object }, // Stores extracted colors, header/footer text
  source: { type: String }, // e.g., 'file', 'url', 'text'
  contributionSummary: { type: String }, // What this input added to the master prompt
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prompt", PromptSchema);
