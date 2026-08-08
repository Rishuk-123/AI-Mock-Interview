const evaluateAnswer = async ({
  question,
  answer,
  role,
  interviewType,
  difficulty,
}) => {
  if (!answer || !answer.trim()) {
    return {
      score: 0,
      feedback: "No answer was provided.",
      strengths: [],
      weaknesses: [
        "The question was not answered.",
      ],
      improvement:
        "Provide a clear and relevant answer to the question.",
    };
  }

  const answerLength = answer.trim().length;

  let score = 50;

  if (answerLength >= 100) {
    score += 10;
  }

  if (answerLength >= 200) {
    score += 10;
  }

  if (answerLength >= 400) {
    score += 10;
  }

  if (answerLength < 50) {
    score -= 20;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,

    feedback:
      "Your answer addresses the question. Try to provide more specific examples and explain your reasoning clearly.",

    strengths: [
      "Relevant response",
      "Clear communication",
    ],

    weaknesses: [
      "Could provide more specific examples",
      "Could explain the reasoning in more depth",
    ],

    improvement:
      "Use a specific project or real-world example and explain the problem, your approach, and the result.",
  };
};

export default evaluateAnswer;