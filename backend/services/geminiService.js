
import axios from 'axios';
import dotenv from "dotenv"
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log(GEMINI_API_KEY)
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables. Gemini API calls will fail.');
}
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Generate a daily summary using Gemini API
 * @param {string} username
 * @param {object} stats
 * @param {object} extra
 * @param {string|null} systemPromptOverride
 * @returns {Promise<object>} summary JSON
 */
async function generateDailySummaryGemini(username, stats = {}, extra = {}, systemPromptOverride = null) {
  const { completed = 0, bookmarked = 0, lastVisit = null, completedQuestions = [], bookmarkedQuestions = [] } = stats;
  const recent = extra.recent || [];
  const recommended = extra.recommendations || [];

  let prompt;
  if (systemPromptOverride) {
    prompt = systemPromptOverride;
  } else {
    prompt = `
    Hey you are a coding master who help people in analysing their current progress

    what you can do is you are provided with the number of completed questions and number of bookmarked questions and also the array of completed questions and bookmarked questions. Now you want user to get a analysis of their daily progress so show them that you have completed this much questions and bookmarked this much questions and based on completed questions you got to know that user is now comfortable with these types of questions and with bookmarked questions, you have an idea that user will come to these questions again because they are good for future practice or may be user has find them difficult so accordingly give user recommendations and suggestions

    Generate a short daily summary for "${username}".\nStats:\n- completed: ${completed}\n- bookmarked: ${bookmarked}\n- lastVisit: ${lastVisit || 'unknown'}\n- completedQuestions: [${completedQuestions.length ? completedQuestions.join(', ') : 'none'}]\n- bookmarkedQuestions: [${bookmarkedQuestions.length ? bookmarkedQuestions.join(', ') : 'none'}]\n\nRecent bookmarks/titles: ${recent.length ? recent.join(', ') : 'none'}\nRecommended next problems: ${recommended.length ? recommended.join(', ') : 'none'}\n\nOutput structure:\n1) shortSummary (1-2 sentences)\n2) bullets (3 action suggestions)\n3) recommended (up to 3 recommended items with reason)\nReturn as JSON only (no extra commentary). Example:\n{\n "shortSummary": "...",\n "bullets": ["...", "...", "..."],\n "recommended": ["...", "..."]\n}`;
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    let text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
    text = text.trim();
    if (text.startsWith('```')) {
      
      text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
    }
    try {
      return JSON.parse(text);
    } catch (err) {
      return { raw: text };
    }
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error);
    return { raw: `Gemini API error: ${error?.message || error}` };
  }
}

export default generateDailySummaryGemini;
