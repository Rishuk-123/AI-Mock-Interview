import Interview from "../models/Interview.js";
import evaluateAnswer from "../services/aiService.js";

// Helper to generate context-aware questions
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

// @desc    Create a new interview session
// @route   POST /api/interviews
// @access  Private
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

// @desc    Get all interviews for logged-in user
// @route   GET /api/interviews
// @access  Private
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

// @desc    Get single interview details by ID
// @route   GET /api/interviews/:id
// @access  Private
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

// @desc    Start an interview & populate initial questions
// @route   POST /api/interviews/:id/start
// @access  Private
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

// @desc    Submit answer for a specific question index
// @route   POST /api/interviews/:id/answer
// @access  Private
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

// @desc    Evaluate individual question answer via AI
// @route   POST /api/interviews/:id/evaluate
// @access  Private
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

// @desc    Complete interview session & calculate overall score
// @route   POST /api/interviews/:id/finish
// @access  Private
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