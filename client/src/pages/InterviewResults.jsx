import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  MessageSquareText,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
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
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading your results...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!interview) {
    return null;
  }

  const questions = interview.questions || [];
  const overallScore = interview.overallScore || 0;

  const completedQuestions = questions.filter(
    (item) => item.answer?.trim()
  ).length;

  const strongAnswers = questions.filter(
    (item) => (item.score || 0) >= 80
  ).length;

  const improvementAnswers = questions.filter(
    (item) => (item.score || 0) < 60
  ).length;

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-600";
    }

    if (score >= 60) {
      return "text-blue-600";
    }

    return "text-red-500";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) {
      return "bg-green-50";
    }

    if (score >= 60) {
      return "bg-blue-50";
    }

    return "bg-red-50";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) {
      return {
        title: "Outstanding performance!",
        text: "You demonstrated strong knowledge and communication throughout the interview.",
      };
    }

    if (score >= 80) {
      return {
        title: "Excellent performance!",
        text: "You performed very well. A little more practice can make you even stronger.",
      };
    }

    if (score >= 60) {
      return {
        title: "Good performance!",
        text: "You have a solid foundation. Focus on the improvement areas to increase your score.",
      };
    }

    return {
      title: "Keep practicing!",
      text: "Use the feedback below to identify your weak areas and improve your next interview.",
    };
  };

  const scoreMessage = getScoreMessage(
    overallScore
  );

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/history")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Interview History
        </button>

        {/* Header */}
        <div className="mb-8">

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                <Trophy size={14} />
                Interview Completed
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Interview Results
              </h1>

              <p className="mt-2 text-slate-500">
                {interview.role || "Interview"}
                {interview.company
                  ? ` at ${interview.company}`
                  : ""}
              </p>
            </div>

            <Button
              onClick={() => navigate("/interview")}
            >
              Start New Interview
            </Button>

          </div>

        </div>

        {/* Top Score Section */}
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-0 text-white shadow-lg">

          <div className="grid md:grid-cols-2">

            {/* Score */}
            <div className="flex flex-col items-center justify-center px-8 py-10 md:py-12">

              <p className="text-sm font-medium text-blue-100">
                Overall Performance
              </p>

              <div
                className="relative mt-5 flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#ffffff ${overallScore}%, rgba(255,255,255,0.18) ${overallScore}% 100%)`,
                }}
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-blue-700">
                  <span className="text-5xl font-bold">
                    {overallScore}
                  </span>

                  <span className="mt-1 text-sm text-blue-100">
                    out of 100
                  </span>
                </div>
              </div>

              <h2 className="mt-6 text-xl font-bold">
                {scoreMessage.title}
              </h2>

              <p className="mt-2 max-w-md text-center text-sm leading-6 text-blue-100">
                {scoreMessage.text}
              </p>

            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-px bg-white/10">

              <div className="flex flex-col justify-center p-7">
                <Target
                  size={22}
                  className="mb-4 text-blue-200"
                />

                <p className="text-3xl font-bold">
                  {questions.length}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  Total Questions
                </p>
              </div>

              <div className="flex flex-col justify-center p-7">
                <CheckCircle2
                  size={22}
                  className="mb-4 text-green-300"
                />

                <p className="text-3xl font-bold">
                  {completedQuestions}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  Answered
                </p>
              </div>

              <div className="flex flex-col justify-center p-7">
                <TrendingUp
                  size={22}
                  className="mb-4 text-green-300"
                />

                <p className="text-3xl font-bold">
                  {strongAnswers}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  Strong Answers
                </p>
              </div>

              <div className="flex flex-col justify-center p-7">
                <CircleAlert
                  size={22}
                  className="mb-4 text-yellow-300"
                />

                <p className="text-3xl font-bold">
                  {improvementAnswers}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  Need Improvement
                </p>
              </div>

            </div>

          </div>

        </Card>

        {/* Interview Summary */}
        <Card className="mb-8 p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MessageSquareText size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Interview Summary
              </h2>

              <p className="text-sm text-slate-500">
                Details about this interview session
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {interview.role ||
                  "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Company
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {interview.company ||
                  "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Interview Type
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {interview.interviewType ||
                  "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Difficulty
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {interview.difficulty ||
                  "Not specified"}
              </p>
            </div>

          </div>

        </Card>

        {/* Question Evaluation */}
        <div className="mb-8">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Question-by-Question Evaluation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your answers and AI-generated feedback.
            </p>
          </div>

          <div className="space-y-5">

            {questions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-500">
                  No questions found for this interview.
                </p>
              </Card>
            ) : (
              questions.map((item, index) => {

                const score = item.score || 0;

                return (
                  <Card
                    key={item._id || index}
                    className="overflow-hidden"
                  >

                    {/* Question Header */}
                    <div className="border-b border-slate-100 bg-slate-50/70 p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex gap-4">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                            {index + 1}
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Question {index + 1}
                            </p>

                            <h3 className="mt-1 text-lg font-semibold leading-7 text-slate-900">
                              {item.question}
                            </h3>
                          </div>

                        </div>

                        {/* Score */}
                        <div
                          className={`shrink-0 rounded-xl px-4 py-2 text-center ${getScoreBackground(
                            score
                          )}`}
                        >
                          <p
                            className={`text-xl font-bold ${getScoreColor(
                              score
                            )}`}
                          >
                            {score}
                          </p>

                          <p className="text-[10px] font-medium text-slate-400">
                            / 100
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Answer */}
                    <div className="p-6">

                      <div className="mb-6">

                        <div className="mb-2 flex items-center gap-2">
                          <MessageSquareText
                            size={17}
                            className="text-slate-400"
                          />

                          <p className="text-sm font-semibold text-slate-800">
                            Your Answer
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                            {item.answer ||
                              "No answer provided"}
                          </p>
                        </div>

                      </div>

                      {/* AI Feedback */}
                      {item.feedback && (
                        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/60 p-5">

                          <div className="flex items-center gap-2">
                            <Lightbulb
                              size={18}
                              className="text-blue-600"
                            />

                            <p className="font-semibold text-blue-900">
                              AI Feedback
                            </p>
                          </div>

                          <p className="mt-3 text-sm leading-7 text-blue-900/80">
                            {item.feedback}
                          </p>

                        </div>
                      )}

                      {/* Strengths / Weaknesses */}
                      <div className="grid gap-5 md:grid-cols-2">

                        {/* Strengths */}
                        {item.strengths?.length > 0 && (
                          <div className="rounded-xl border border-green-100 bg-green-50/60 p-5">

                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                size={18}
                                className="text-green-600"
                              />

                              <p className="font-semibold text-green-800">
                                Strengths
                              </p>
                            </div>

                            <ul className="mt-3 space-y-2">

                              {item.strengths.map(
                                (
                                  strength,
                                  strengthIndex
                                ) => (
                                  <li
                                    key={strengthIndex}
                                    className="flex gap-2 text-sm leading-6 text-green-800/80"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                                    <span>
                                      {strength}
                                    </span>
                                  </li>
                                )
                              )}

                            </ul>

                          </div>
                        )}

                        {/* Weaknesses */}
                        {item.weaknesses?.length > 0 && (
                          <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-5">

                            <div className="flex items-center gap-2">
                              <CircleAlert
                                size={18}
                                className="text-orange-600"
                              />

                              <p className="font-semibold text-orange-800">
                                Areas to Improve
                              </p>
                            </div>

                            <ul className="mt-3 space-y-2">

                              {item.weaknesses.map(
                                (
                                  weakness,
                                  weaknessIndex
                                ) => (
                                  <li
                                    key={weaknessIndex}
                                    className="flex gap-2 text-sm leading-6 text-orange-800/80"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />

                                    <span>
                                      {weakness}
                                    </span>
                                  </li>
                                )
                              )}

                            </ul>

                          </div>
                        )}

                      </div>

                      {/* Improvement */}
                      {item.improvement && (
                        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50/60 p-5">

                          <div className="flex items-center gap-2">
                            <TrendingUp
                              size={18}
                              className="text-purple-600"
                            />

                            <p className="font-semibold text-purple-800">
                              How to Improve
                            </p>
                          </div>

                          <p className="mt-3 text-sm leading-7 text-purple-900/80">
                            {item.improvement}
                          </p>

                        </div>
                      )}

                    </div>

                  </Card>
                );
              })
            )}

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

          <Button
            variant="outline"
            onClick={() => navigate("/history")}
          >
            <ArrowLeft
              size={17}
              className="mr-2"
            />
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