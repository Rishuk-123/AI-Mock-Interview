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

router.post("/", authMiddleware, createInterview);

router.get("/", authMiddleware, getMyInterviews);

router.get("/:id", authMiddleware, getInterviewById);
router.post("/:id/start", authMiddleware, startInterview);

router.post("/:id/answer", authMiddleware, submitAnswer);
router.post("/:id/evaluate", authMiddleware, evaluateInterviewAnswer);
router.post("/:id/finish", authMiddleware, finishInterview);

export default router;
