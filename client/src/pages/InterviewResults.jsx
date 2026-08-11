import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InterviewResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(
          `/interviews/${id}`
        );

        const interviewData =
          response.data.interview;

        if (!interviewData) {
          throw new Error("Interview not found");
        }

        setInterview(interviewData);
      } catch (error) {
        console.error(
          "Results loading error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load results"
        );

        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Loading results...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!interview) {
    return null;
  }

  const questions = interview.questions || [];
  const overallScore = interview.overallScore || 0;

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Interview Results
          </h1>

          <p className="mt-2 text-slate-500">
            {interview.role || "Interview"}
            {interview.company
              ? ` at ${interview.company}`
              : ""}
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6 p-8">
          <div className="text-center">

            <p className="text-sm font-medium text-slate-500">
              Overall Score
            </p>

            <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-full bg-blue-50">
              <div>
                <p className="text-4xl font-bold text-blue-600">
                  {overallScore}
                </p>

                <p className="text-sm text-slate-500">
                  / 100
                </p>
              </div>
            </div>

            <p className="mt-4 text-slate-600">
              {overallScore >= 80
                ? "Excellent performance!"
                : overallScore >= 60
                ? "Good performance. Keep improving!"
                : "Keep practicing and improving!"}
            </p>

          </div>
        </Card>

        {/* Interview Summary */}
        <Card className="mb-6 p-6">

          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Interview Summary
          </h2>

          <div className="grid gap-5 md:grid-cols-4">

            <div>
              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {interview.role || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Company
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {interview.company ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Type
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {interview.interviewType ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Difficulty
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {interview.difficulty ||
                  "Not specified"}
              </p>
            </div>

          </div>

        </Card>

        {/* Question Results */}
        <div className="space-y-6">

          <h2 className="text-xl font-semibold text-slate-900">
            Question-by-Question Evaluation
          </h2>

          {questions.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-slate-500">
                No questions found for this interview.
              </p>
            </Card>
          ) : (
            questions.map((item, index) => (

              <Card
                key={item._id || index}
                className="p-6"
              >

                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Question {index + 1}
                    </p>

                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {item.question}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full bg-blue-50 px-4 py-2 font-bold text-blue-600">
                    {item.score || 0}/100
                  </div>

                </div>

                {/* Candidate Answer */}
                <div className="mt-6 rounded-lg bg-slate-50 p-5">

                  <p className="text-sm font-semibold text-slate-700">
                    Your Answer
                  </p>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.answer ||
                      "No answer provided"}
                  </p>

                </div>

                {/* AI Feedback */}
                {item.feedback && (
                  <div className="mt-5">

                    <p className="text-sm font-semibold text-slate-800">
                      AI Feedback
                    </p>

                    <p className="mt-2 leading-7 text-slate-600">
                      {item.feedback}
                    </p>

                  </div>
                )}

                {/* Strengths */}
                {item.strengths?.length > 0 && (
                  <div className="mt-5">

                    <p className="text-sm font-semibold text-slate-800">
                      Strengths
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">

                      {item.strengths.map(
                        (strength, strengthIndex) => (
                          <li key={strengthIndex}>
                            {strength}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}

                {/* Weaknesses */}
                {item.weaknesses?.length > 0 && (
                  <div className="mt-5">

                    <p className="text-sm font-semibold text-slate-800">
                      Areas to Improve
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">

                      {item.weaknesses.map(
                        (weakness, weaknessIndex) => (
                          <li key={weaknessIndex}>
                            {weakness}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}

                {/* Improvement */}
                {item.improvement && (
                  <div className="mt-5">

                    <p className="text-sm font-semibold text-slate-800">
                      Improvement Suggestion
                    </p>

                    <p className="mt-2 leading-7 text-slate-600">
                      {item.improvement}
                    </p>

                  </div>
                )}

              </Card>

            ))
          )}

        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">

          <Button
            variant="outline"
            onClick={() => navigate("/history")}
          >
            Interview History
          </Button>

          <Button
            onClick={() => navigate("/interview")}
          >
            Start New Interview
          </Button>

        </div>

      </div>
    </MainLayout>
  );
}

export default InterviewResults;