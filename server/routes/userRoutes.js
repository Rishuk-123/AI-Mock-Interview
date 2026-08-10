import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  getProfile,
  updateProfile,
  uploadResume,
} from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.post(
  "/resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

export default router;