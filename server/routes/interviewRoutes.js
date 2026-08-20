import express from "express";
import {
  createInterview,
  getMyInterviews,
  getInterviewById,
  startInterview,
  submitAnswer,
  finishInterview,
  evaluateInterviewAnswer,
} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new interview session (validates & deducts 1 credit)
router.post("/", authMiddleware, createInterview);

// Fetch all interviews belonging to the logged-in user
router.get("/", authMiddleware, getMyInterviews);

// Fetch details for a specific interview
router.get("/:id", authMiddleware, getInterviewById);

// Start an interview session
router.post("/:id/start", authMiddleware, startInterview);

// Submit user answer to a specific question
router.post("/:id/answer", authMiddleware, submitAnswer);

// Evaluate individual question answer with AI feedback
router.post("/:id/evaluate", authMiddleware, evaluateInterviewAnswer);

// Complete the interview session and calculate final score
router.post("/:id/finish", authMiddleware, finishInterview);

export default router;