import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
      weaknesses: ["The question was not answered."],
      improvement: "Provide a clear and relevant answer.",
    };
  }

  const prompt = `
You are an expert interviewer evaluating a candidate's answer.

Job Role: ${role}
Interview Type: ${interviewType}
Difficulty: ${difficulty}

Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate based on:
1. Relevance
2. Technical correctness
3. Clarity
4. Depth
5. Communication
6. Practical understanding

Return ONLY valid JSON with no markdown formatting or backticks.

Use exactly this structure:
{
  "score": 0,
  "feedback": "Short overall evaluation",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2"
  ],
  "improvement": "Specific advice for improving the answer"
}

Rules:
- score must be an integer from 0 to 100
- feedback should be concise
- provide 2 to 3 strengths
- provide 2 to 3 weaknesses
- provide specific improvement advice
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional technical interviewer. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" }, // Enforce JSON mode if supported by Groq setup
    });

    let text = completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("Empty AI response");
    }

    // Strip Markdown code blocks if present (e.g., ```json ... ```)
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    let evaluation;

    try {
      evaluation = JSON.parse(text);
    } catch (parseError) {
      console.error("AI JSON parsing error:", parseError);
      console.error("AI raw response:", text);
      throw new Error("AI returned invalid JSON");
    }

    return {
      score: Math.max(
        0,
        Math.min(100, Number(evaluation.score) || 0)
      ),
      feedback: evaluation.feedback || "",
      strengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths
        : [],
      weaknesses: Array.isArray(evaluation.weaknesses)
        ? evaluation.weaknesses
        : [],
      improvement: evaluation.improvement || "",
    };
  } catch (error) {
    console.error("Groq evaluation error:", error);
    throw new Error("AI evaluation failed");
  }
};

export default evaluateAnswer;