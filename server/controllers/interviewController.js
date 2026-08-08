import Interview from "../models/Interview.js";
import evaluateAnswer from "../services/aiService.js";

export const createInterview = async (req, res) => {
  try {
    const {
      role,
      company,
      interviewType,
      difficulty,
    } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const interview = await Interview.create({
      user: req.user.id,
      role,
      company,
      interviewType,
      difficulty,
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
    const interviews = await Interview.find({
      user: req.user.id,
    }).sort({
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
        message: "Interview already started",
        interview,
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    const questions = [
      {
        question: `Tell me about yourself and your experience relevant to the ${interview.role} role.`,
      },
      {
        question: `What are your strongest technical skills for a ${interview.role} position?`,
      },
      {
        question:
          "Describe a challenging project you worked on and how you solved the problem.",
      },
      {
        question:
          "How do you handle debugging when your code is not working as expected?",
      },
      {
        question:
          "Where do you see yourself professionally in the next few years?",
      },
    ];

    const updatedInterview = await Interview.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        status: "scheduled",
      },
      {
        $set: {
          questions,
          status: "in-progress",
          startedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInterview) {
      const currentInterview = await Interview.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

      if (currentInterview?.status === "in-progress") {
        return res.status(200).json({
          success: true,
          message: "Interview already started",
          interview: currentInterview,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Interview could not be started",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview started successfully",
      interview: updatedInterview,
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

    if (
      questionIndex === undefined ||
      !answer ||
      !answer.trim()
    ) {
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

    if (
      questionIndex < 0 ||
      questionIndex >= interview.questions.length
    ) {
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

    const answeredQuestions = interview.questions.filter(
      (item) => item.answer && item.answer.trim()
    );

    if (answeredQuestions.length !== interview.questions.length) {
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

    const completedInterview = await Interview.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        status: "in-progress",
      },
      {
        $set: {
          status: "completed",
          overallScore,
          completedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!completedInterview) {
      return res.status(400).json({
        success: false,
        message: "Interview could not be completed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      interview: completedInterview,
    });
  } catch (error) {
    console.error("Finish interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to finish interview",
    });
  }
};
export const evaluateInterviewAnswer = async (
  req,
  res
) => {
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

    if (
      questionIndex < 0 ||
      questionIndex >= interview.questions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    const question =
      interview.questions[questionIndex];

    if (!question.answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const evaluation = await evaluateAnswer({
      question: question.question,
      answer: question.answer,
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
    });

    interview.questions[questionIndex].score =
      evaluation.score;

    interview.questions[questionIndex].feedback =
      evaluation.feedback;

    interview.questions[questionIndex].strengths =
      evaluation.strengths;

    interview.questions[questionIndex].weaknesses =
      evaluation.weaknesses;

    interview.questions[questionIndex].improvement =
      evaluation.improvement;

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      evaluation,
    });
  } catch (error) {
    console.error(
      "Evaluate answer error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to evaluate answer",
    });
  }
};