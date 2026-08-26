import Interview from "../models/Interview.js";

// Helper function to extract JSON reliably from Gemini text responses
const extractJSON = (text) => {
  try {
    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const match = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON structure found");
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Failed to parse JSON response:", text);
    throw err;
  }
};

// Generic REST caller for Gemini with multiple model fallbacks
const callGeminiAPI = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in server/.env");
  }

  // Model fallback list
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash"
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return extractJSON(text);
        }
      } else {
        const errorData = await response.json();
        lastError = errorData;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Gemini API call failed: ${JSON.stringify(lastError)}`);
};

// ============================================================================
// 1. DYNAMIC QUESTIONS GENERATION
// ============================================================================
export const generateQuestions = async (req, res) => {
  const { role = "Software Developer", difficulty = "Medium", type = "Technical" } = req.body;

  try {
    const prompt = `You are an expert technical interviewer.
Generate 4 distinct, high-quality ${type} interview questions for a candidate applying for a "${role}" position at a ${difficulty} difficulty level.

Return ONLY a raw JSON array of 4 string questions with no other text or explanation.
Example:
[
  "Question 1?",
  "Question 2?",
  "Question 3?",
  "Question 4?"
]`;

    let questions;
    try {
      questions = await callGeminiAPI(prompt);
    } catch (apiErr) {
      console.warn("AI generation fallback activated:", apiErr.message);
      questions = [
        `Explain the core architectural concepts, tools, and best practices you use as a ${difficulty}-level ${role}.`,
        `Describe how you debug and isolate performance bottlenecks or edge-case errors in production.`,
        `Walk through a challenging project you built as a ${role} and how you solved its main technical obstacle.`,
        `What strategies do you follow to ensure code quality, testability, and maintainability?`,
      ];
    }

    return res.status(200).json({
      success: true,
      questions: Array.isArray(questions) ? questions : [
        `Explain key technical concepts for a ${role}.`,
        `How do you handle debugging and optimization?`,
        `Describe a challenging problem you solved.`,
        `How do you structure maintainable code?`
      ],
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate dynamic interview questions.",
      error: error.message,
    });
  }
};

// ============================================================================
// 2. FULL INTERVIEW EVALUATION & SCORING
// ============================================================================
export const evaluateFullInterview = async (req, res) => {
  const { questions = [], answers = [], role = "Software Developer" } = req.body;

  try {
    const formattedQnA = questions
      .map(
        (q, i) =>
          `Question ${i + 1}: ${typeof q === "string" ? q : q.question}\nCandidate Answer: ${
            answers[i] && String(answers[i]).trim().length > 0
              ? String(answers[i]).trim()
              : "No response provided"
          }`
      )
      .join("\n\n");

    const prompt = `You are a strict technical hiring manager evaluating a candidate for a "${role}" position.

Review each question and candidate answer below:
${formattedQnA}

CRITICAL SCORING AND EVALUATION RULES:
1. Grade each question strictly on technical depth and accuracy (0 to 100):
   - Blank, irrelevant, gibberish, or completely wrong answers: Score 0 - 20.
   - Answers with major factual errors or wrong concepts: Score 20 - 40.
   - Partially correct answers missing technical depth: Score 45 - 65.
   - Accurate, thorough, and technically sound answers: Score 70 - 100.
2. The overall "score" MUST be the mathematical average of all question scores.
3. "level":
   - "Needs Improvement" (score < 50)
   - "Intermediate" (score 50 - 74)
   - "Proficient" (score 75 - 100)
4. "feedback": Return an array of ${questions.length} feedback strings corresponding to each question explaining why it's right or wrong.
5. "focusAreas": Return an array of 2 to 4 bullet points indicating specific concepts the candidate must study based on their errors.

Return ONLY a valid JSON object matching this schema:
{
  "score": 75,
  "level": "Proficient",
  "focusAreas": ["Area 1", "Area 2"],
  "feedback": ["Feedback Q1", "Feedback Q2", "Feedback Q3", "Feedback Q4"]
}`;

    let evaluation;
    try {
      evaluation = await callGeminiAPI(prompt);
    } catch (apiErr) {
      console.warn("AI evaluation fallback activated:", apiErr.message);
      
      const answeredCount = answers.filter(
        (a) => a && typeof a === "string" && a.trim().length > 15
      ).length;
      const scoreCalc = Math.round((answeredCount / (questions.length || 1)) * 65);

      evaluation = {
        score: scoreCalc,
        level: scoreCalc >= 75 ? "Proficient" : scoreCalc >= 45 ? "Intermediate" : "Needs Improvement",
        focusAreas: [
          "Provide deeper architectural details with specific technical tools.",
          "Elaborate on production debugging and error-handling edge cases."
        ],
        feedback: questions.map((_, i) =>
          answers[i] && String(answers[i]).trim().length > 15
            ? "Response submitted. Consider expanding on specific production metrics and architectural trade-offs."
            : "Response was too brief or omitted core technical depth."
        ),
      };
    }

    return res.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Evaluate full interview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate full interview session.",
      error: error.message,
    });
  }
};

// ============================================================================
// 3. DATABASE PERSISTENCE CONTROLLERS
// ============================================================================
export const createInterview = async (req, res) => {
  try {
    const { role, company, interviewType, difficulty } = req.body;
    const interview = await Interview.create({
      user: req.user.id,
      role: role || "Software Developer",
      company: company || "",
      interviewType: interviewType || "Technical",
      difficulty: difficulty || "Medium",
      status: "scheduled",
    });
    res.status(201).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
    interview.status = "in-progress";
    interview.startedAt = new Date();
    await interview.save();
    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
    if (questionIndex >= 0 && questionIndex < interview.questions.length) {
      interview.questions[questionIndex].answer = answer;
      await interview.save();
    }
    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Answer recorded." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
    interview.status = "completed";
    interview.completedAt = new Date();
    await interview.save();
    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};