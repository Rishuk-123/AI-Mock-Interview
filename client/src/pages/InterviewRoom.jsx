import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const startRequested = useRef(false);

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);

        const interviewData = response.data.interview;

        if (!interviewData) {
          throw new Error("Interview data not found");
        }

        if (
          interviewData.status === "scheduled" &&
          !startRequested.current
        ) {
          startRequested.current = true;

          const startResponse = await api.post(
            `/interviews/${id}/start`
          );

          setInterview(startResponse.data.interview);
        } else {
          setInterview(interviewData);
        }
      } catch (error) {
        console.error("Interview loading error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load interview"
        );

        navigate("/interview");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/interviews/${id}/answer`, {
        questionIndex: currentQuestion,
        answer: answer.trim(),
      });

      setInterview((previous) => {
        if (!previous) {
          return previous;
        }

        const updatedQuestions = [
          ...(previous.questions || []),
        ];

        updatedQuestions[currentQuestion] = {
          ...updatedQuestions[currentQuestion],
          answer: answer.trim(),
        };

        return {
          ...previous,
          questions: updatedQuestions,
        };
      });

      toast.success("Answer saved");

      setAnswer("");

      const questions = interview?.questions || [];

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((previous) => previous + 1);
      } else {
        await finishInterview();
      }
    } catch (error) {
      console.error("Submit answer error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save answer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const finishInterview = async () => {
    try {
      const response = await api.post(
        `/interviews/${id}/finish`
      );

      toast.success("Interview completed");

      setInterview(response.data.interview);
    } catch (error) {
      console.error("Finish interview error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to finish interview"
      );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Loading interview...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!interview) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Interview not found.
          </p>
        </div>
      </MainLayout>
    );
  }

  const questions = interview.questions || [];

  if (questions.length === 0) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <p className="text-slate-600">
            No interview questions available.
          </p>

          <Button onClick={() => navigate("/interview")}>
            Back to Interview Setup
          </Button>
        </div>
      </MainLayout>
    );
  }

  const question = questions[currentQuestion];

  if (!question) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Question not found.
          </p>
        </div>
      </MainLayout>
    );
  }

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  const isCompleted =
    interview.status === "completed";

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-5xl">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            AI Interview
          </h1>

          <p className="mt-1 text-slate-500">
            {interview.role}

            {interview.company
              ? ` at ${interview.company}`
              : ""}
          </p>
        </div>

        {isCompleted ? (
          <Card className="p-8">
            <div className="text-center">

              <h2 className="text-2xl font-bold text-slate-900">
                Interview Completed
              </h2>

              <p className="mt-2 text-slate-500">
                You have successfully completed this
                interview.
              </p>

              <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full bg-blue-50">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {interview.overallScore}
                  </p>

                  <p className="text-sm text-slate-500">
                    Score
                  </p>
                </div>
              </div>

              <Button
                className="mt-8"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>

            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">

            <Card className="p-6 md:col-span-2">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Question
                  </p>

                  <p className="text-lg font-semibold text-slate-900">
                    {currentQuestion + 1} /{" "}
                    {questions.length}
                  </p>
                </div>

                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                  {interview.difficulty}
                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-6">

                <p className="text-lg leading-8 text-slate-800">
                  {question.question}
                </p>

              </div>

              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Your Answer
                </label>

                <textarea
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  placeholder="Type your answer here..."
                  rows={8}
                  className="w-full resize-none rounded-lg border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div className="mt-4 flex justify-end">

                <Button
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : isLastQuestion
                    ? "Finish"
                    : "Next Question"}
                </Button>

              </div>

            </Card>

            <Card className="h-fit p-6">

              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Interview Details
              </h2>

              <div className="space-y-5">

                <div>
                  <p className="text-sm text-slate-500">
                    Role
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {interview.role}
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
                    {interview.interviewType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Difficulty
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {interview.difficulty}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Progress
                  </p>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{
                        width: `${
                          ((currentQuestion + 1) /
                            questions.length) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {currentQuestion + 1} of{" "}
                    {questions.length} questions
                  </p>
                </div>

              </div>

            </Card>

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default InterviewRoom;