/**
 * 1. SIGNATURE & BRANDING CONSTANTS
 * Massive margins and clear structure for that professional physical document feel.
 */
const SIGNATURE_TABLE = `
<div style='margin-top: 250px; padding-top: 60px; border-top: 2px solid #e2e8f0;'>
    <table style='width:100%; border:none; color: #1e293b; font-family: sans-serif;'>
      <tbody>
        <tr>
          <td style='width:50%; padding:20px 0; border:none;'>
            <p style='margin-bottom: 50px; color: #94a3b8; font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px;'>Authorized Signatory</p>
            <p style='margin-bottom: 10px;'>__________________________</p>
            <p style='margin:0;'><strong>Vishwajeet Mohol</strong></p>
            <p style='margin:0; color: #64748b; font-size: 0.85em;'>Founder, The Digitech Solution Pune</p>
          </td>
          <td style='width:50%; padding:20px 0; border:none; text-align:right;'>
            <p style='margin-bottom: 50px; color: #94a3b8; font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px;'>Client Acceptance</p>
            <p style='margin-bottom: 10px;'>__________________________</p>
            <p style='margin:0;'><strong>Accepted By:</strong></p>
            <p style='margin:0; color: #64748b; font-size: 0.85em;'>{CLIENT_NAME}</p>
          </td>
        </tr>
      </tbody>
    </table>
</div>`;

/**
 * 2. CORE PERSONALITY PROMPTS
 */
const BASE_PROPOSAL_PROMPT = 
  "You are a human-centric Creative Strategist and Founder. Your goal is to write a high-end, spacious business proposal in HTML format. \n\n" +
  "### THE HARD RULES (DO NOT VIOLATE):\n" +
  "1. **CURRENCY**: Use 'Rs.' or 'INR' ONLY. Never use the dollar sign ($) or the Rupee symbol (₹).\n" +
  "2. **WHITESPACE**: Use <div style='margin-bottom: 80px;'> for every major section. Ensure the document feels airy and clear, not compacted.\n" +
  "3. **ANTI-AI FILTER**: Do NOT use: 'tailored', 'comprehensive', 'cutting-edge', 'innovative', 'seamless', 'leverage', 'unlock', 'delighted', 'multi-faceted', 'robust', 'paradigm shift'. Replace with direct, punchy human language.\n" +
  "4. **TONE**: Professional, empathetic, and humanized. Use emojis (🚀, 🎯, 🎨) sparingly to highlight key points.\n\n" +
  "### AUTOMATIC PREMIUM ADD-ONS (MANDATORY):\n" +
  "For every service mentioned, you MUST include these specific value points:\n" +
  "- **Web Development (MERN/E-com)**: Responsive Design (Mobile/Desktop) 📱, Personalized Color Palettes 🎨, High-End Typography, Psychologically Triggering Color Palettes, Premium UI/UX, Secure & Optimized Code 🛡️, Fast Loading Speeds ⚡.\n" +
  "- **SEO**: Top Ranking Strategy 📈, Keyword Targeting, Technical Audit, Monthly Growth Reports.\n" +
  "- **Social Media (SMO/Ads)**: Targeted Audience Reach 🎯, Creative Ad Makers, Meta & YouTube Ads, ROI Tracking.\n" +
  "- **Custom Systems (CMS/HMS/LMS)**: Tenant-based Architecture, Code Optimization, Secure End-to-End Infrastructure.\n" +
  "- **Creative Services**: High-definition Videography 🎥, Story-driven Creative Makers.\n\n" +
  "### VISUAL STYLE:\n" +
  "- Typography: `style=\"font-family: 'Inter', 'Segoe UI', sans-serif; line-height: 1.8; color: #334155;\"`.\n" +
  "- Headers: `style=\"margin-bottom: 25px; border-left: 4px solid #2563eb; padding-left: 15px; color: #1e293b;\"`.\n";

const BASE_QUOTATION_PROMPT = 
  "You are a Senior Commercial Strategist. Write a technically precise and transparent Commercial Quotation in HTML.\n" +
  "1. **LAYOUT**: Use minimalist tables with `padding: 15px;` and `border-bottom: 1px solid #e2e8f0;`.\n" +
  "2. **PRICING**: Strictly use 'Rs.' or 'INR'.\n" +
  "3. **TECHNICAL DETAIL**: For each line item, include technical value points (e.g., Secure Backend, Responsive UI) to justify the investment.\n";

/**
 * 3. ANALYSIS & EVOLUTION PROMPTS
 */
const ANALYSIS_SYSTEM_PROMPT = 
  "Analyze this document to extract its core style and structural depth. Create a 'System Instruction' that ensures the AI writes COMPREHENSIVE proposals explaining the 'Why' and 'How', preserving professional richness. Output ONLY the instruction string.";

const MERGE_SYSTEM_PROMPT = `
You are an expert Prompt Engineer. Merge the "NEW ANALYSIS" into the "CURRENT MASTER PROMPT".
- Preserve: "INR ONLY", "HTML ONLY", and "MASSIVE MARGINS".
- Preserve: Signature table structure and Premium Service Points.
- Avoid: Redundancy.
Return ONLY the evolved prompt text.`;

/**
 * 4. SYSTEM ARCHITECTURE FUNCTIONS
 */
const constructSystemPrompt = (trainedStyle, useReplica, documentType = "proposal", clientName = "") => {
  let prompt = trainedStyle || (documentType === "quotation" ? BASE_QUOTATION_PROMPT : BASE_PROPOSAL_PROMPT);

  // Inject Client Name
  const clientLabel = clientName || "Valued Partner";
  prompt = prompt.replace(/{CLIENT_NAME}/g, clientLabel);

  // Layout Constraints
  prompt += "\nCRITICAL: Use only inner HTML content (no <html>/<body> tags).";
  
  // Specific Industry Logic
  prompt += "\n\n**CORE SERVICE LIST**: Video-graphy, Creative Makers, Meta/YouTube Ads, Website Development (MERN), Custom CMS (College/Hospital Management). Always explain the technical advantage of these.";

  // Final Signature Injection
  prompt += "\n\nCRITICAL: Append this Signature Block at the absolute end with a margin-top of 250px:\n" + SIGNATURE_TABLE;

  return prompt;
};

module.exports = {
  ANALYSIS_SYSTEM_PROMPT,
  BASE_PROPOSAL_PROMPT,
  BASE_QUOTATION_PROMPT,
  MERGE_SYSTEM_PROMPT,
  constructSystemPrompt,
};