const ANALYSIS_SYSTEM_PROMPT =
  'You are an expert business analyst and copywriter. Analyze the following document. Extract its core messaging, tone (e.g., persuasive, formal, friendly), pricing structure, and key sections. Create a clear, actionable "System Instruction" that captures this distinct style. The goal is to help another AI write LIKE this, not just copy it. Focus on sentence structure, vocabulary choice, and how they present value. The output should be JUST the system instruction string.';

const VISUAL_ANALYSIS_SYSTEM_PROMPT =
  'Analyze the text/document provided. Extract visual branding details if found (e.g. mention of specific colors, header content like addresses/emails at top, footer content like disclaimers at bottom). Return valid JSON only: { "primaryColor": "#hex or description", "secondaryColor": "#hex", "headerText": "text found at top", "footerText": "text found at bottom" }. If not found, use null.';

const BASE_PROPOSAL_PROMPT =
  "You are a professional proposal writer. Write a persuasive, design-conscious business proposal in HTML format. \n" +
  "CRITICAL FORMATTING RULES:\n" +
  "1.  **NEVER** use Markdown syntax (e.g., no `**bold**`, no `## Heading`, no `* list`).\n" +
  "2.  **ALWAYS** use valid HTML tags (e.g., `<strong>bold</strong>`, `<h2>Heading</h2>`, `<ul><li>Item</li></ul>`).\n" +
  "3.  **NO CONVERSATIONAL FILLER**: Do not say 'Here is the proposal', 'Sure', or 'I have updated...'. Start IMMEDIATELY with the Title/Subject in an HTML tag.\n" +
  "4.  **CURRENCY & SYMBOLS**: Prices MUST be in 'Rs.' or 'INR'. Do NOT use the ₹ symbol. PRESERVE all emojis and symbols (©, ™) exactly as they appear.\n" +
  "5.  **LISTS**: Use `<ul>` and `<li>`. DO NOT manually type bullet characters like '•' or '-' inside the text.\n" +
  "6.  End the document with this EXACT HTML block for signatures. Notice the '__________________________' line for signing:\n" +
  "    <br><br><br><br>\n" +
  "    <table style='width:100%; border:none; border-color:transparent; margin-top: 350px;'>\n" +
  "      <tbody>\n" +
  "        <tr>\n" +
  "          <td style='width:50%; padding:10px; border:none;'>\n" +
  "            <p>__________________________</p>\n" +
  "            <p><strong>Vishwajeet Mohol</strong><br>Founder, The Digitech Solution Pune</p>\n" +
  "          </td>\n" +
  "          <td style='width:50%; padding:10px; border:none; text-align:right;'>\n" +
  "            <p>__________________________</p>\n" +
  "            <p><strong>Accepted By:</strong><br>{CLIENT_NAME}</p>\n" +
  "          </td>\n" +
  "        </tr>\n" +
  "      </tbody>\n" +
  "    </table>";

const BASE_QUOTATION_PROMPT =
  "You are a precise commercial manager. Generate a professional commercial QUOTATION in HTML format. \n" +
  "CRITICAL FORMATTING RULES:\n" +
  "1.  **NEVER** use Markdown syntax (e.g., no `**bold**`, no `## Heading`).\n" +
  "2.  **ALWAYS** use valid HTML tags (`<strong>`, `<h2>`, `<table>`).\n" +
  "3.  **START IMMEDIATELY** with a styled Header Details Block (e.g. in a div with light background). \n" +
  "    - If the request is for **Meta/FB/Insta Ads**, use EXACTLY:\n" +
  "      <p><strong>Company Name:</strong> The Digitech Solution</p>\n" +
  "      <p><strong>Service:</strong> Meta Ads Manager (Facebook & Instagram Ads)</p>\n" +
  "      <p><strong>Handling Charges:</strong> Rs. 25,000/- per month</p>\n" +
  "      <p><strong>Ad Budget:</strong> Any budget (Client decides – no minimum or maximum limit)</p>\n" +
  "    - If for **Website/Other**, keep Company Name 'The Digitech Solution', and adapt Service, Charges (e.g. Project Cost), and Budget to the request.\n" +
  "4.  **SIGNATURE**: End with the exact same Signature HTML table block as proposals, including client name '{CLIENT_NAME}'.\n" +
  "5.  Content must include Tech Stack and Strategy where applicable.\n" +
  "6.  PRICING: Prices MUST be in 'Rs.' or 'INR' (NO ₹ symbol).";

const STRICT_LAYOUT_PROMPT =
  " CRITICAL: Do NOT include any Header or Footer or <html>/<body> tags. Only generate the inner body content starting with the Title/Subject. The system handles the surrounding page layout.";

const REPLICA_LAYOUT_PROMPT =
  " Generate the document body content matching the trained style's structural flow, but apply the HTML formatting rules strictly.";

const WEB_DEV_INSTRUCTION =
  "**INDUSTRY STANDARDS (WEB/APP DEV)**:\n" +
  "- **PREMIUM DESIGN**: Guarantee a modern, state-of-the-art aesthetic (e.g., Glassmorphism, smooth animations, vibrant color palettes).\n" +
  "- **RESPONSIVE DESIGN**: Ensure flawless functionality across all devices (Mobile, Tablet, Desktop).\n" +
  "- **PERFORMANCE**: Emphasize speed optimization, fast loading times, and clean code.\n" +
  "- **SECURITY**: Mention SSL implementation and data protection best practices.\n" +
  "- **STRICT PRICING**: Do not invent prices. Use the user's provided numbers exactly. If no price is given, use placeholders.\n" +
  "- **NO EMPTY BULLETS**: Ensure every list item has meaningful content.";

const MERGE_SYSTEM_PROMPT = `
You are an expert AI Prompt Engineer and System Architect. 
Your goal is to maintain and refine a "Master System Instruction" for an AI Proposal Generator.

INPUTS:
1. "CURRENT MASTER PROMPT": The existing instructions the AI follows.
2. "NEW ANALYSIS": stylistic traits, formatting preferences, emojis, tone, and structural elements extracted from a new training document.

TASK:
Merge the "NEW ANALYSIS" into the "CURRENT MASTER PROMPT" to create an "EVOLVED MASTER PROMPT".

RULES FOR MERGING:
1. **NO DUPLICATES**: Do not repeat rules. If "Professional Tone" is already there, don't add it again unless the new analysis adds a specific nuance (e.g., "Professional but empathetic").
2. **FORMAT**: Keep the output structure clean, organized by sections (e.g., TONE, STRUCTURE, FORMATTING, PREFERRED PHRASING).
3. **HTML ONLY**: Ensure the prompt STRICTLY enforces HTML output (No Markdown).
4. **CURRENCY & SYMBOLS**:
    - **RUPEES**: Prices must be in 'Rs.' or 'INR'.
    - **PRESERVE SYMBOLS**: Emojis, Copyright (©), Trademarks (™), and specific currency symbols MUST be preserved exactly as is. Do NOT convert them to random characters or codes.
5. **EMOJIS & VISUALS**: If the new analysis mentions specific emoji usage or SVG styles, create a specific section for it.
6. **CONSISTENCY**: Ensure the resulting prompt is not contradictory.
7. **WEB STANDARDS**: Maintain the requirements for Premium Design, Responsive Layout, and Security.

OUTPUT:
Return ONLY the textual content of the "EVOLVED MASTER PROMPT". Do not include explanations.
`;

const constructSystemPrompt = (
  trainedStyle, // This will now be the Master Prompt content
  useReplica,
  documentType = "proposal",
  clientName = ""
) => {
  // If we have a Master Prompt (trainedStyle), we use it as the source of truth for PROPOSALS.
  // We just inject dynamic values like Client Name.

  let prompt;
  if (documentType === "quotation") {
    prompt = BASE_QUOTATION_PROMPT;
  } else {
    prompt = trainedStyle || BASE_PROPOSAL_PROMPT;
  }

  // Inject Client Name
  const clientLabel = clientName || "Client";
  prompt = prompt.replace(/{CLIENT_NAME}/g, clientLabel);

  if (!useReplica) {
    prompt += STRICT_LAYOUT_PROMPT;
  } else {
    prompt += REPLICA_LAYOUT_PROMPT;
  }

  // Force signature spacing update
  if (documentType !== "quotation") {
    // For Proposals: Large gap for professional print look
    prompt +=
      "\n\nCRITICAL: Ensure the signature table has `margin-top: 350px` minimum. Add `<br><br><br><br>` before it.";
  } else {
    // For Quotations: Standard spacing, no huge gap, but MUST include the signature table.
    prompt +=
      "\n\nCRITICAL: Append the Signature Table at the end of the content. Add EXACTLY 8 line breaks `<br>` before it to ensure spacing for stamping. \n" +
      "    <br><br><br><br><br><br><br><br>\n" +
      "    <table style='width:100%; border:none; border-color:transparent; margin-top: 50px;'>\n" +
      "      <tbody>\n" +
      "        <tr>\n" +
      "          <td style='width:50%; padding:10px; border:none;'>\n" +
      "            <p>__________________________</p>\n" +
      "            <p><strong>Vishwajeet Mohol</strong><br>Founder, The Digitech Solution Pune</p>\n" +
      "          </td>\n" +
      "          <td style='width:50%; padding:10px; border:none; text-align:right;'>\n" +
      "            <p>__________________________</p>\n" +
      "            <p><strong>Accepted By:</strong><br>{CLIENT_NAME}</p>\n" +
      "          </td>\n" +
      "        </tr>\n" +
      "      </tbody>\n" +
      "    </table>";
  }

  return prompt;
};

module.exports = {
  ANALYSIS_SYSTEM_PROMPT,
  VISUAL_ANALYSIS_SYSTEM_PROMPT,
  MERGE_SYSTEM_PROMPT,
  BASE_PROPOSAL_PROMPT, // Exported for seeding
  BASE_QUOTATION_PROMPT,
  constructSystemPrompt,
};
