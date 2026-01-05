const fs = require("fs");
const pdf = require("pdf-parse");
const axios = require("axios");
const cheerio = require("cheerio");
const Groq = require("groq-sdk");
const PromptModel = require("../models/Prompt");
const MasterPrompt = require("../models/MasterPrompt");
const {
  ANALYSIS_SYSTEM_PROMPT,
  VISUAL_ANALYSIS_SYSTEM_PROMPT,
  MERGE_SYSTEM_PROMPT,
  BASE_PROPOSAL_PROMPT,
  constructSystemPrompt,
} = require("../utils/prompts");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const trainModel = async (req, res) => {
  try {
    let textContent = "";
    let visualData = null;
    const { type, url, text, extractVisuals } = req.body;

    if (type === "file" && req.file) {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdf(dataBuffer);
      textContent = data.text;
      fs.unlinkSync(req.file.path);
    } else if (type === "url" && url) {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      textContent = $("body").text().replace(/\s+/g, " ").trim();
    } else if (type === "text" && text) {
      textContent = text;
    } else {
      return res.status(400).json({ error: "Invalid input for training" });
    }

    const MAX_INPUT_CHARS = 20000;
    const CHUNK_SIZE = 6000;
    const truncatedContent = textContent.substring(0, MAX_INPUT_CHARS);

    const analysisCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
        { role: "user", content: truncatedContent.substring(0, CHUNK_SIZE) },
      ],
      model: "llama-3.3-70b-versatile",
    });
    const newAnalysis = analysisCompletion.choices[0]?.message?.content || "";

    if (extractVisuals === "true") {
      const visualCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: VISUAL_ANALYSIS_SYSTEM_PROMPT },
          { role: "user", content: truncatedContent.substring(0, 4000) },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });
      const visualContent = visualCompletion.choices[0]?.message?.content;
      try {
        visualData = JSON.parse(visualContent);
      } catch (e) {
        console.log("Failed to parse visual data JSON");
      }
    }

    let masterPrompt = await MasterPrompt.findOne();
    let currentMasterContent = masterPrompt
      ? masterPrompt.content
      : BASE_PROPOSAL_PROMPT;

    const mergeCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: MERGE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `CURRENT MASTER PROMPT:\n${currentMasterContent}\n\nNEW ANALYSIS:\n${newAnalysis}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const evolvedPromptContent =
      mergeCompletion.choices[0]?.message?.content || currentMasterContent;

    if (!masterPrompt) {
      masterPrompt = new MasterPrompt({ content: evolvedPromptContent });
    } else {
      masterPrompt.content = evolvedPromptContent;
      masterPrompt.lastUpdated = Date.now();
      masterPrompt.version += 1;
    }
    await masterPrompt.save();

    let title = "Untitled Training";
    if (type === "file" && req.file) title = req.file.originalname;
    else if (type === "url") title = url;
    else if (type === "text") title = text.substring(0, 30) + "...";

    await PromptModel.create({
      title,
      originalContent: textContent,
      visualData: visualData,
      source: type,
      contributionSummary: newAnalysis.substring(0, 500) + "...",
    });

    res.json({
      message: "Master Prompt Updated Successfully",
      instruction: evolvedPromptContent,
    });
  } catch (error) {
    console.error("Training Error:", error);
    res.status(500).json({ error: error.message || "Failed to train model" });
  }
};

const generateProposal = async (req, res) => {
  try {
    const {
      description,
      useReplica,
      documentType = "proposal",
      clientName,
    } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    // Fetch Master Prompt
    const masterPrompt = await MasterPrompt.findOne();
    const trainedStyle = masterPrompt ? masterPrompt.content : "";

    const systemPrompt = constructSystemPrompt(
      trainedStyle,
      useReplica,
      documentType,
      clientName
    );

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate a ${documentType} for: ${description}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 6000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    let jsonResponse;
    try {
      // Try parsing if model mistakenly outputs JSON despite instructions
      jsonResponse = JSON.parse(responseContent);
    } catch (e) {
      // Default: Treat output as HTML string (which is what we want)
      jsonResponse = responseContent;
    }

    // Pass visual data for replica mode
    let responseVisuals = null;
    // We can pull visuals from the last history item or from the master prompt if we stored it there.
    // For now, let's grab the most recent visual data from history as a fallback.
    if (useReplica) {
      const latestVisuals = await PromptModel.findOne({
        visualData: { $ne: null },
      }).sort({ createdAt: -1 });
      if (latestVisuals) {
        responseVisuals = latestVisuals.visualData;
      }
    }

    res.json({ content: jsonResponse, visualData: responseVisuals });
  } catch (error) {
    console.error("Generation Error:", error);
    res.status(500).json({ error: "Failed to generate proposal" });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await PromptModel.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await PromptModel.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete history item" });
  }
};

module.exports = {
  trainModel,
  generateProposal,
  getHistory,
  deleteHistory,
};
