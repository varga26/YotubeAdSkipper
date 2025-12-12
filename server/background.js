// background.js
import express from "express";
import fetch from "node-fetch";
import { TranscriptList } from '@osiris-ai/youtube-captions-sdk';
import { fetchTranscript } from "youtube-transcript-plus";
import { AdSegment, initializeDatabase } from "./config.js";
import { promt } from "./promt.js";
import dotenv from 'dotenv';
dotenv.config()
const app = express();
app.use(express.json());

const API = process.env.GEMINI_API_KEY
/**
 * Fetches the actual transcript content for a specific video and language.
 * @param {string} videoId - The YouTube Video ID.
 * @param {string} lang - The language code (e.g., 'en', 'de').
 * @returns {Promise<string>} - Stringified JSON of the transcript.
 */
async function sub_pars(videoId, lang) {
    const sub = await fetchTranscript(videoId, { lang: lang });
    // const sub = await fetchTranscript(videoId, { lang: lang })
    //   .then(transcript => console.log(transcript))
    //   .catch(console.error);
    const jsonString = JSON.stringify(sub);
    return jsonString;
}

/**
 * Retrieves available caption tracks (manual and generated) for a video.
 * @param {string} videoId 
 * @returns {Promise<Object>} - Object containing arrays of manual and generated languages.
 */
async function getAvailableLanguages(videoId) {
    const transcriptList = await TranscriptList.fetch(videoId);

    const manualLangs = Object.values(transcriptList.manual).map(t => ({
        code: t.languageCode,
        name: t.language
    }));

    const generatedLangs = Object.values(transcriptList.generated).map(t => ({
        code: t.languageCode,
        name: t.language
    }));

    return { manual: manualLangs, generated: generatedLangs };
}

/**
 * Selects the best language for analysis based on a priority list.
 * It prefers major languages like English, German, French, etc.
 * @param {Object} languages - The object returned from getAvailableLanguages.
 * @returns {string|null} - The best matching language code or null.
 */
function chooseBestLanguage(languages) {
    const manualLangs = Object.values(languages.manual || {});
    const generatedLangs = Object.values(languages.generated || {});
    const allLangs = [...manualLangs, ...generatedLangs];

    // Normalize codes to 2 characters (e.g., 'en-US' -> 'en')
    const langCodes = allLangs.map(l => l.code.slice(0, 2).toLowerCase());

    const priority = ['en', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'ru', 'ja', 'zh', 'ko'];

    // Check if any available language matches the priority list
    for (const p of priority) {
        if (langCodes.includes(p)) return p;
    }

    // Fallback to the first available language if no priority match found
    return langCodes[0] || null;
}

// ====== (Commented out deprecated fetch functions) ======
// async function fetchSubtitles(videoId) { ... }
// async function text_pars(params) { ... }

/**
 * Sends the subtitles to Google Gemini LLM to identify ad segments.
 * @param {string} subtitles - The raw subtitle text/JSON.
 * @returns {Promise<Array>} - Parsed array of ad segments.
 */
async function analyzeTextWithLLM(subtitles) {
    
    // SECURITY WARNING: It is unsafe to hardcode API keys in production code. 
    // Consider using process.env.GEMINI_API_KEY
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                // Combines the system prompt with the subtitle data
                                text: `${promt} ${subtitles}`
                            }
                        ]
                    }
                ],
                // Enforces JSON response format from the model
                generationConfig: { 
                    responseMimeType: "application/json" 
                }
            })
        }
    );

    const data = await res.json(); 

    // Check for API errors
    if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
    }

    // Extract the text content from the Gemini candidate response
    const jsonOutputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonOutputText) {
        // If the model didn't return text (e.g., due to safety filters)
        console.error("LLM did not return text content:", data);
        throw new Error("LLM failed to generate valid content.");
    }

    // Parse the JSON string returned by the LLM into a JavaScript object
    try {
        const resultSegments = JSON.parse(jsonOutputText);
        console.log("LLM Result Parsed:", resultSegments);
        return resultSegments;
    } catch (parseError) {
        console.error("Failed to parse JSON output from LLM:", jsonOutputText);
        throw new Error(`Invalid JSON format from LLM: ${parseError.message}`);
    }
}

/**
 * Main API Endpoint: /analyze/:videoId
 * Orchestrates the caching, fetching, and analysis flow.
 */
app.post("/analyze/:videoId", async (req, res) => {
    const videoId = req.params.videoId;

    try {
        console.log("[Server] Request for:", videoId);

        // 1. Check Database Cache (using Sequelize)
        // If we already analyzed this video, return the stored segments.
        const cachedRow = await AdSegment.findByPk(videoId);
        if (cachedRow) {
            console.log("[Server] Cached result returned.");
            // The Sequelize model getter automatically parses row.segments
            return res.json(cachedRow.segments); 
        }

        // 2. If not cached, fetch available languages
        const languages = await getAvailableLanguages(videoId);
        
        // 3. Select the best language for the LLM
        const lang = chooseBestLanguage(languages);

        // 4. Download subtitles
        const subtitles = await sub_pars(videoId, lang);
        
        // 5. Send to LLM for analysis
        const segments = await analyzeTextWithLLM(subtitles);

        // 6. Save result to Database for future requests
        await AdSegment.create({ videoId, segments });

        // 7. Send response to client
        res.json(segments);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || "Internal Server Error" });
    }
});


// ====== 4. Server Start ======
// Initialize the database connection before listening for requests
initializeDatabase().then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
});

export function ss() {
  console.log("Функція ss викликана");
}

// Код виконається лише якщо файл запущено напряму
if (import.meta.main) {
  console.log("Файл запущено напряму!");
  ss();
}