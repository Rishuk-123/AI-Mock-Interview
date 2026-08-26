import express from "express";
import {
  createInterview,
  getMyInterviews,
  getInterviewById,
  startInterview,
  submitAnswer,
  finishInterview,
  evaluateInterviewAnswer,
  generateQuestions,
  evaluateFullInterview,
} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================================================
// 1. DYNAMIC AI & REAL-TIME EVALUATION ROUTES
// ============================================================================

// Dynamic question generation endpoints
router.post("/generate-questions", generateQuestions);
router.post("/frontend-questions", generateQuestions);
router.post("/backend-questions", generateQuestions);

// Full interview analysis, scoring, and feedback generation
router.post("/evaluate", evaluateFullInterview);

// ============================================================================
// 2. USER-SPECIFIC & STATIC GET/POST ROUTES (MUST BE ABOVE /:id)
// ============================================================================

// Create a new interview session
router.post("/", authMiddleware, createInterview);

// Fetch all interviews belonging to the logged-in user (root & /history)
router.get("/", authMiddleware, getMyInterviews);
router.get("/history", authMiddleware, getMyInterviews);

// ============================================================================
// 3. PARAMETERIZED ROUTES (MUST BE AT THE BOTTOM)
// ============================================================================

// Start an interview session
router.post("/:id/start", authMiddleware, startInterview);

// Submit user answer to a specific question
router.post("/:id/answer", authMiddleware, submitAnswer);

// Evaluate individual question answer with AI feedback
router.post("/:id/evaluate", authMiddleware, evaluateInterviewAnswer);

// Complete the interview session and calculate final score
router.post("/:id/finish", authMiddleware, finishInterview);

// Fetch details for a specific interview by its MongoDB ObjectId
router.get("/:id", authMiddleware, getInterviewById);

export default router;