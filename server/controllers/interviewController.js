import { GoogleGenerativeAI } from "@google/generative-ai";
import Interview from "../models/Interview.js";
import evaluateAnswer from "../services/aiService.js";

// Initialize Gemini with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================================================
// STANDALONE AI HELPER CONTROLLERS (Unsaved / Frontend Real-time Sessions)
// ============================================================================

// @desc    Generate dynamic interview questions via Gemini AI
// @route   POST /api/interview/generate-questions
// @access  Public / Private
export const generateQuestions = async (req, res) => {
  try {
    const { role = "Software Engineer", difficulty = "Medium", type = "Technical" } = req.body;

    const prompt = `You are an expert technical interviewer. Generate 4 distinct, high-quality ${type} interview questions for a candidate applying for a "${role}" position at a ${difficulty} difficulty level.

Return ONLY a JSON array of strings containing the questions.
Example output: ["Question 1?", "Question 2?", "Question 3?", "Question 4?"]`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const questions = JSON.parse(text);

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate dynamic interview questions.",
    });
  }
};

// @desc    Evaluate full interview session & generate focus areas / per-question feedback
// @route   POST /api/interview/evaluate
// @access  Public / Private
export const evaluateFullInterview = async (req, res) => {
  try {
    const { questions, answers, role = "Software Developer" } = req.body;

    if (!questions || !answers || !Array.isArray(questions) || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Questions and answers arrays are required.",
      });
    }

    const formattedQnA = questions
      .map((q, i) => `Q${i + 1}: ${q}\nCandidate Answer: ${answers[i] || "No answer provided"}`)
      .join("\n\n");

    const prompt = `You are an expert technical interviewer evaluating a candidate for a "${role}" role.

Analyze the following interview questions and candidate answers carefully:
${formattedQnA}

Evaluation Guidelines:
1. Accurately score answers based on technical depth, relevance, and accuracy.
2. If the user provides solid, accurate technical explanations (e.g., mentioning React, TypeScript, state management, memoization, browser devtools), reward them with high scores (75-95).
3. If an answer is random gibberish (e.g. "ekcnkrmlo", "kVN KFNIV"), penalize that specific question with low score and explain that it is unreadable.
4. "score": Calculate a global composite score from 0 to 100 reflecting overall performance.
5. "level": Return "Needs Improvement" (below 50), "Intermediate" (50-74), or "Proficient" (75-100).
6. "focusAreas": Provide 2-4 specific bullet points on key topics the candidate should study or expand upon.
7. "feedback": Provide an array of helpful, constructive feedback strings corresponding EXACTLY to each question in order (length must be ${questions.length}).

Return ONLY a valid JSON object matching this schema:
{
  "score": 85,
  "level": "Proficient",
  "focusAreas": ["Mention specific state management tools like Redux or Zustand", "Elaborate on performance metrics when discussing optimization"],
  "feedback": [
    "Great overview of core frontend technologies like React and TypeScript. Good mention of writing clean code.",
    "Solid explanation of React optimization techniques including memoization and component restructuring.",
    "Good workflow steps using DevTools and logs for debugging production environments."
  ]
}`;

    // Force JSON output via generationConfig
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const evaluation = JSON.parse(text);

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
// DATABASE PERSISTENCE CONTROLLERS (Saved User Interviews)
// ============================================================================

const generateDefaultQuestions = (role, company, interviewType, difficulty) => {
  const companyPrefix = company ? `at ${company}` : "";
  const level = difficulty || "Intermediate";

  return [
    {
      question: `Tell me about yourself and your background relevant to the ${role} position ${companyPrefix}.`,
    },
    {
      question: `For a ${level} ${role} role, what core technical concepts or tools do you consider most essential and why?`,
    },
    {
      question: `Describe a challenging project you worked on as a ${role}. What obstacle did you face, and how did you resolve it?`,
    },
    {
      question: `How do you approach testing, debugging, and code quality in a fast-paced environment ${companyPrefix}?`,
    },
    {
      question: `What strategies do you use to collaborate effectively with cross-functional team members?`,
    },
  ];
};

export const createInterview = async (req, res) => {
  try {
    const { role, company, interviewType, difficulty } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const interview = await Interview.create({
      user: req.user.id,
      role,
      company: company || "",
      interviewType: interviewType || "Technical",
      difficulty: difficulty || "Intermediate",
      status: "scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create interview",
    });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get interview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview",
    });
  }
};

export const startInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status === "in-progress") {
      return res.status(200).json({
        success: true,
        message: "Interview already in progress",
        interview,
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    const questions = generateDefaultQuestions(
      interview.role,
      interview.company,
      interview.interviewType,
      interview.difficulty
    );

    interview.questions = questions;
    interview.status = "in-progress";
    interview.startedAt = new Date();

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview started successfully",
      interview,
    });
  } catch (error) {
    console.error("Start interview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;

    if (questionIndex === undefined || !answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question index and answer are required",
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Interview is not in progress",
      });
    }

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    interview.questions[questionIndex].answer = answer.trim();
    await interview.save();

    res.status(200).json({
      success: true,
      message: "Answer saved successfully",
      question: interview.questions[questionIndex],
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  try {
    const { questionIndex } = req.body;

    if (questionIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "Question index is required",
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    const question = interview.questions[questionIndex];

    if (!question.answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required before evaluation",
      });
    }

    const evaluation = await evaluateAnswer({
      question: question.question,
      answer: question.answer,
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
    });

    interview.questions[questionIndex].score = evaluation.score || 0;
    interview.questions[questionIndex].feedback = evaluation.feedback || "";
    interview.questions[questionIndex].strengths = evaluation.strengths || [];
    interview.questions[questionIndex].weaknesses = evaluation.weaknesses || [];
    interview.questions[questionIndex].improvement = evaluation.improvement || "";

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      evaluation,
    });
  } catch (error) {
    console.error("Evaluate answer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to evaluate answer",
    });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    const unanswered = interview.questions.some(
      (item) => !item.answer || !item.answer.trim()
    );

    if (unanswered) {
      return res.status(400).json({
        success: false,
        message: "Please answer all questions before finishing",
      });
    }

    const totalScore = interview.questions.reduce(
      (sum, item) => sum + (item.score || 0),
      0
    );

    const overallScore =
      interview.questions.length > 0
        ? Math.round(totalScore / interview.questions.length)
        : 0;

    interview.status = "completed";
    interview.overallScore = overallScore;
    interview.completedAt = new Date();

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      interview,
    });
  } catch (error) {
    console.error("Finish interview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to finish interview",
    });
  }
};