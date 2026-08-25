import { GoogleGenAI } from "@google/genai";
import pdfParse from "pdf-parse";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a resume file (PDF)." });
    }

    // Extract text from the uploaded PDF
    const parsedPdf = await pdfParse(req.file.buffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract readable text from the document. Please ensure it is not a scanned image.",
      });
    }

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an expert ATS (Applicant Tracking System) parser and resume evaluation engine.
Analyze the following resume and return ONLY a valid JSON object matching the schema below.

Resume Content:
"""
${resumeText}
"""

Schema:
{
  "atsScore": number (0-100),
  "scoreBreakdown": {
    "keywordDensityScore": number (0-50),
    "sectionStructureScore": number (0-30),
    "actionVerbsScore": number (0-20)
  },
  "verdict": "Great Match" | "Moderate Match" | "Needs Improvement",
  "keyStrengths": ["string", "string", "string"],
  "recommendedImprovements": ["string", "string", "string"],
  "extractedKeywords": ["string", "string", "string", "string", "string"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const analysis = JSON.parse(response.text);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while evaluating resume.",
      error: error.message,
    });
  }
};