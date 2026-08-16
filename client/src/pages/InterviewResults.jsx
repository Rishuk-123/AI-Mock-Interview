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
  Sparkles,
  Briefcase,
  Building2,
  Brain,
  Gauge,
  BarChart3,
  ArrowRight,
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
        <div className="flex min-h-[500px] items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />

            <p className="text-sm font-medium text-slate-400">
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
      return "text-emerald-400";
    }

    if (score >= 60) {
      return "text-blue-400";
    }

    return "text-red-400";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) {
      return "bg-emerald-950/60 border border-emerald-800/50";
    }

    if (score >= 60) {
      return "bg-blue-950/60 border border-blue-800/50";
    }

    return "bg-red-950/60 border border-red-800/50";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) {
      return {
        title: "Outstanding performance!",
        text: "You demonstrated excellent knowledge, reasoning, and communication.",
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

  const scoreMessage = getScoreMessage(overallScore);

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl bg-slate-950 text-white min-h-screen p-6">
        {/* HEADER */}
        <div className="mb-7">
          <button
            onClick={() => navigate("/history")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Interview History
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
                  <Trophy size={17} />
                </div>

                <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                  Interview Completed
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Your Interview Results
              </h1>

              <p className="mt-2 text-lg text-slate-400">
                {interview.role || "Interview"}
                {interview.company ? ` at ${interview.company}` : ""}
              </p>
            </div>

            <Button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
            >
              Start New Interview
              <ArrowRight size={17} />
            </Button>
          </div>
        </div>

        {/* SCORE HERO */}
        <Card className="mb-6 overflow-hidden border-slate-800 bg-slate-900/80 p-0 shadow-xl backdrop-blur">
          <div className="grid bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 md:grid-cols-2">
            {/* SCORE */}
            <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-200">
                <Sparkles size={17} />
                Overall Performance
              </div>

              <div
                className="relative flex h-48 w-48 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#ffffff ${overallScore}%, rgba(255,255,255,0.18) ${overallScore}% 100%)`,
                }}
              >
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-slate-950">
                  <span className="text-5xl font-extrabold text-white">
                    {overallScore}
                  </span>

                  <span className="mt-1 text-sm text-slate-400">
                    out of 100
                  </span>
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                {scoreMessage.title}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">
                {scoreMessage.text}
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 border-t border-white/10 md:border-l md:border-t-0">
              <div className="flex flex-col justify-center border-b border-r border-white/10 p-7">
                <Target size={22} className="mb-4 text-blue-300" />
                <p className="text-3xl font-extrabold text-white">
                  {questions.length}
                </p>
                <p className="mt-1 text-sm text-blue-100">Total Questions</p>
              </div>

              <div className="flex flex-col justify-center border-b border-white/10 p-7">
                <CheckCircle2 size={22} className="mb-4 text-emerald-400" />
                <p className="text-3xl font-extrabold text-white">
                  {completedQuestions}
                </p>
                <p className="mt-1 text-sm text-blue-100">Answered</p>
              </div>

              <div className="flex flex-col justify-center border-r border-white/10 p-7">
                <TrendingUp size={22} className="mb-4 text-emerald-400" />
                <p className="text-3xl font-extrabold text-white">
                  {strongAnswers}
                </p>
                <p className="mt-1 text-sm text-blue-100">Strong Answers</p>
              </div>

              <div className="flex flex-col justify-center p-7">
                <CircleAlert size={22} className="mb-4 text-amber-300" />
                <p className="text-3xl font-extrabold text-white">
                  {improvementAnswers}
                </p>
                <p className="mt-1 text-sm text-blue-100">Need Improvement</p>
              </div>
            </div>
          </div>
        </Card>

        {/* INTERVIEW DETAILS SUMMARY */}
        <Card className="mb-6 border-slate-800 bg-slate-900/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800/40">
              <MessageSquareText size={21} />
            </div>

            <div>
              <h2 className="font-bold text-white">Interview Summary</h2>
              <p className="mt-1 text-sm text-slate-400">
                Details about your interview session
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Briefcase size={16} />
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Role
                </p>
              </div>
              <p className="mt-3 font-semibold text-white">
                {interview.role || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 size={16} />
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Company
                </p>
              </div>
              <p className="mt-3 font-semibold text-white">
                {interview.company || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Brain size={16} />
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Type
                </p>
              </div>
              <p className="mt-3 font-semibold text-white">
                {interview.interviewType || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Gauge size={16} />
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Difficulty
                </p>
              </div>
              <p className="mt-3 font-semibold text-white">
                {interview.difficulty || "Not specified"}
              </p>
            </div>
          </div>
        </Card>

        {/* PERFORMANCE OVERVIEW BARS */}
        <Card className="mb-8 border-slate-800 bg-slate-900/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <BarChart3 size={21} />
            </div>

            <div>
              <h2 className="font-bold text-white">Performance Overview</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your score across individual questions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((item, index) => {
              const score = item.score || 0;

              return (
                <div
                  key={item._id || index}
                  className="flex items-center gap-4"
                >
                  <div className="flex w-20 shrink-0 items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300">
                      {index + 1}
                    </span>

                    <span className="text-sm font-semibold text-slate-300">
                      Q{index + 1}
                    </span>
                  </div>

                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        score >= 80
                          ? "bg-emerald-500"
                          : score >= 60
                            ? "bg-blue-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>

                  <span
                    className={`w-12 text-right text-sm font-bold ${getScoreColor(
                      score
                    )}`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* QUESTION-BY-QUESTION EVALUATION */}
        <div className="mb-8">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800/40">
                <MessageSquareText size={21} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Question-by-Question Evaluation
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review your answers and AI-generated feedback.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {questions.length === 0 ? (
              <Card className="border-slate-800 bg-slate-900/80 p-10 text-center">
                <p className="text-slate-400">
                  No questions found for this interview.
                </p>
              </Card>
            ) : (
              questions.map((item, index) => {
                const score = item.score || 0;

                return (
                  <Card
                    key={item._id || index}
                    className="overflow-hidden border-slate-800 bg-slate-900/80 p-0 shadow-lg backdrop-blur"
                  >
                    {/* QUESTION HEADER */}
                    <div className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-5">
                      <div className="flex items-start justify-between gap-5">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-600/20">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Question {index + 1}
                            </p>

                            <h3 className="mt-1 text-lg font-semibold leading-7 text-white">
                              {item.question}
                            </h3>
                          </div>
                        </div>

                        {/* SCORE BADGE */}
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

                          <p className="text-[10px] font-semibold text-slate-400">
                            / 100
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      {/* ANSWER */}
                      <div className="mb-6">
                        <div className="mb-3 flex items-center gap-2">
                          <MessageSquareText
                            size={17}
                            className="text-slate-400"
                          />

                          <p className="text-sm font-bold text-slate-200">
                            Your Answer
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
                          <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                            {item.answer || "No answer provided"}
                          </p>
                        </div>
                      </div>

                      {/* AI FEEDBACK */}
                      {item.feedback && (
                        <div className="mb-6 rounded-xl border border-blue-900/50 bg-blue-950/40 p-5">
                          <div className="flex items-center gap-2">
                            <Lightbulb
                              size={18}
                              className="text-blue-400"
                            />

                            <p className="font-bold text-blue-300">
                              AI Feedback
                            </p>
                          </div>

                          <p className="mt-3 text-sm leading-7 text-blue-200/90">
                            {item.feedback}
                          </p>
                        </div>
                      )}

                      {/* STRENGTHS + WEAKNESSES */}
                      <div className="grid gap-5 md:grid-cols-2">
                        {/* STRENGTHS */}
                        {item.strengths?.length > 0 && (
                          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/40 p-5">
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                size={18}
                                className="text-emerald-400"
                              />

                              <p className="font-bold text-emerald-300">
                                Strengths
                              </p>
                            </div>

                            <ul className="mt-3 space-y-2">
                              {item.strengths.map(
                                (strength, strengthIndex) => (
                                  <li
                                    key={strengthIndex}
                                    className="flex gap-2 text-sm leading-6 text-emerald-200/90"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                    <span>{strength}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* WEAKNESSES */}
                        {item.weaknesses?.length > 0 && (
                          <div className="rounded-xl border border-amber-900/50 bg-amber-950/40 p-5">
                            <div className="flex items-center gap-2">
                              <CircleAlert
                                size={18}
                                className="text-amber-400"
                              />

                              <p className="font-bold text-amber-300">
                                Areas to Improve
                              </p>
                            </div>

                            <ul className="mt-3 space-y-2">
                              {item.weaknesses.map(
                                (weakness, weaknessIndex) => (
                                  <li
                                    key={weaknessIndex}
                                    className="flex gap-2 text-sm leading-6 text-amber-200/90"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                    <span>{weakness}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* IMPROVEMENT */}
                      {item.improvement && (
                        <div className="mt-5 rounded-xl border border-purple-900/50 bg-purple-950/40 p-5">
                          <div className="flex items-center gap-2">
                            <TrendingUp
                              size={18}
                              className="text-purple-400"
                            />

                            <p className="font-bold text-purple-300">
                              How to Improve
                            </p>
                          </div>

                          <p className="mt-3 text-sm leading-7 text-purple-200/90">
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

        {/* BOTTOM ACTIONS */}
        <div className="mb-8 flex flex-col-reverse gap-3 border-t border-slate-800/80 pt-6 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/history")}
            className="flex items-center justify-center border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={17} className="mr-2" />
            Interview History
          </Button>

          <Button
            onClick={() => navigate("/interview")}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
          >
            Start New Interview
            <ArrowRight size={17} className="ml-2" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

export default InterviewResults;