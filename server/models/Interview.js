import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    interviewType: {
      type: String,
      enum: ["Technical", "Behavioral", "HR", "Mixed"],
      default: "Technical",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },

        feedback: {
          type: String,
          default: "",
        },

        strengths: {
          type: [String],
          default: [],
        },

        weaknesses: {
          type: [String],
          default: [],
        },

        improvement: {
          type: String,
          default: "",
        },
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    duration: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"],
      default: "scheduled",
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
