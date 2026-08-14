import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Brain,
  CheckCircle2,
  Clock3,
  Gauge,
  Building2,
  Briefcase,
  MessageSquareText,
  ArrowRight,
  Sparkles,
  Send,
  Trophy,
} from "lucide-react";

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
  const [evaluation, setEvaluation] = useState(null);

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

      const evaluationResponse = await api.post(
        `/interviews/${id}/evaluate`,
        {
          questionIndex: currentQuestion,
        }
      );

      const evaluation =
        evaluationResponse.data.evaluation;

      setEvaluation(evaluation);

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
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          improvement: evaluation.improvement,
        };

        return {
          ...previous,
          questions: updatedQuestions,
        };
      });

      toast.success(
        `AI Score: ${evaluation.score}/100`
      );

      setAnswer("");

      const questions = interview?.questions || [];

      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setEvaluation(null);
          setCurrentQuestion(
            (previous) => previous + 1
          );
        }, 2500);
      } else {
        setTimeout(async () => {
          await finishInterview();
        }, 2500);
      }
    } catch (error) {
      console.error(
        "Submit/evaluation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to evaluate answer"
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
      setEvaluation(null);

      navigate(`/interview/${id}/results`);
    } catch (error) {
      console.error(
        "Finish interview error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to finish interview"
      );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-600">
              Preparing your interview...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!interview) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center">
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
        <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MessageSquareText size={26} />
          </div>

          <p className="text-slate-600">
            No interview questions available.
          </p>

          <Button
            onClick={() =>
              navigate("/interview")
            }
          >
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
        <div className="flex min-h-[500px] items-center justify-center">
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

  const progress =
    ((currentQuestion + 1) / questions.length) *
    100;

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles
                  size={19}
                  className="text-blue-600"
                />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Live AI Interview
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {interview.role}
              </h1>

              {interview.company && (
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Building2 size={15} />

                  {interview.company}
                </p>
              )}
            </div>

            {!isCompleted && (
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                  <Clock3
                    size={16}
                    className="text-blue-600"
                  />

                  Question {currentQuestion + 1} of{" "}
                  {questions.length}
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                  {interview.difficulty}
                </div>

              </div>
            )}

          </div>

          {/* Progress */}

          {!isCompleted && (
            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Interview Progress</span>

                <span>
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* COMPLETED */}
        {/* ================================================= */}

        {isCompleted ? (

          <Card className="overflow-hidden p-0 shadow-sm">

            <div className="px-8 py-14 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Trophy size={38} />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-slate-900">
                Interview Completed
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-slate-500">
                You have successfully completed this
                AI mock interview. Review your detailed
                feedback and performance score.
              </p>

              <div className="mx-auto mt-8 flex h-36 w-36 items-center justify-center rounded-full bg-blue-50">
                <div>
                  <p className="text-4xl font-bold text-blue-600">
                    {interview.overallScore}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Overall Score
                  </p>
                </div>
              </div>

              <Button
                className="mt-8"
                onClick={() =>
                  navigate(
                    `/interview/${id}/results`
                  )
                }
              >
                View Detailed Results
                <ArrowRight
                  size={18}
                  className="ml-2"
                />
              </Button>

            </div>

          </Card>

        ) : (

          /* ================================================= */
          /* ACTIVE INTERVIEW */
          /* ================================================= */

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ================================================= */}
            {/* MAIN INTERVIEW */}
            {/* ================================================= */}

            <div className="lg:col-span-2">

              <Card className="overflow-hidden p-0 shadow-sm">

                {/* Question Header */}

                <div className="border-b border-slate-200 px-7 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Brain size={21} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Interview Question
                      </p>

                      <p className="text-sm font-semibold text-slate-900">
                        Question {currentQuestion + 1}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Question */}

                <div className="px-7 py-7">

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-7">

                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <Sparkles size={17} />

                      AI Interviewer
                    </div>

                    <p className="text-xl font-semibold leading-8 text-slate-900">
                      {question.question}
                    </p>

                  </div>

                  {/* Answer */}

                  <div className="mt-7">

                    <div className="mb-3 flex items-center justify-between">

                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <MessageSquareText
                          size={17}
                          className="text-blue-600"
                        />

                        Your Answer
                      </label>

                      <span className="text-xs text-slate-400">
                        {answer.length} characters
                      </span>

                    </div>

                    <textarea
                      value={answer}
                      onChange={(e) =>
                        setAnswer(e.target.value)
                      }
                      placeholder="Type your answer here. Explain your approach clearly and provide examples where relevant..."
                      rows={10}
                      disabled={submitting}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100"
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-slate-400">
                        Take your time and give a clear,
                        structured answer.
                      </p>

                      <Button
                        onClick={
                          handleSubmitAnswer
                        }
                        disabled={submitting}
                        className="flex h-11 items-center justify-center gap-2 px-6"
                      >
                        {submitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                            AI is evaluating...
                          </>
                        ) : (
                          <>
                            {isLastQuestion
                              ? "Finish Interview"
                              : "Submit Answer"}

                            <Send size={17} />
                          </>
                        )}
                      </Button>

                    </div>

                  </div>

                  {/* ================================================= */}
                  {/* AI EVALUATION */}
                  {/* ================================================= */}

                  {evaluation && (
                    <div className="mt-7 overflow-hidden rounded-2xl border border-blue-200 bg-blue-50">

                      <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Sparkles size={20} />
                          </div>

                          <div>
                            <h2 className="font-bold text-slate-900">
                              AI Evaluation
                            </h2>

                            <p className="text-xs text-slate-500">
                              Feedback on your answer
                            </p>
                          </div>

                        </div>

                        <div className="rounded-xl bg-white px-4 py-2 text-xl font-bold text-blue-600 shadow-sm">
                          {evaluation.score}/100
                        </div>

                      </div>

                      <div className="space-y-5 p-6">

                        {/* Feedback */}

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Feedback
                          </p>

                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {evaluation.feedback}
                          </p>
                        </div>

                        {/* Strengths */}

                        {evaluation.strengths?.length >
                          0 && (
                          <div>

                            <p className="text-sm font-bold text-emerald-700">
                              Strengths
                            </p>

                            <ul className="mt-2 space-y-2">
                              {evaluation.strengths.map(
                                (
                                  strength,
                                  index
                                ) => (
                                  <li
                                    key={index}
                                    className="flex gap-2 text-sm text-slate-600"
                                  >
                                    <CheckCircle2
                                      size={17}
                                      className="mt-0.5 shrink-0 text-emerald-500"
                                    />

                                    {strength}
                                  </li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                        {/* Weaknesses */}

                        {evaluation.weaknesses?.length >
                          0 && (
                          <div>

                            <p className="text-sm font-bold text-amber-700">
                              Areas to Improve
                            </p>

                            <ul className="mt-2 space-y-2">
                              {evaluation.weaknesses.map(
                                (
                                  weakness,
                                  index
                                ) => (
                                  <li
                                    key={index}
                                    className="flex gap-2 text-sm text-slate-600"
                                  >
                                    <span className="mt-1 text-amber-500">
                                      •
                                    </span>

                                    {weakness}
                                  </li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                        {/* Improvement */}

                        {evaluation.improvement && (
                          <div className="rounded-xl bg-white p-4">

                            <p className="text-sm font-bold text-slate-800">
                              Improvement Suggestion
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {evaluation.improvement}
                            </p>

                          </div>
                        )}

                        {!isLastQuestion && (
                          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />

                            Moving to the next question...
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </Card>

            </div>

            {/* ================================================= */}
            {/* SIDE PANEL */}
            {/* ================================================= */}

            <div className="space-y-5">

              {/* Interview Details */}

              <Card className="p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Briefcase size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Interview Details
                    </h2>

                    <p className="text-xs text-slate-400">
                      Current session
                    </p>
                  </div>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Role
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {interview.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Company
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {interview.company ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Type
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                        <MessageSquareText
                          size={14}
                          className="text-blue-600"
                        />

                        {interview.interviewType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Level
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                        <Gauge
                          size={14}
                          className="text-blue-600"
                        />

                        {interview.difficulty}
                      </p>
                    </div>

                  </div>

                </div>

              </Card>

              {/* Progress Card */}

              <Card className="p-6 shadow-sm">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Your Progress
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Keep going!
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 size={19} />
                  </div>

                </div>

                <div className="mb-3 flex items-end justify-between">

                  <p className="text-3xl font-bold text-slate-900">
                    {currentQuestion + 1}
                    <span className="text-base font-medium text-slate-400">
                      {" "}
                      / {questions.length}
                    </span>
                  </p>

                  <p className="text-sm font-semibold text-blue-600">
                    {Math.round(progress)}%
                  </p>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-5 space-y-2">

                  {questions.map(
                    (item, index) => {

                      const answered =
                        item.answer ||
                        item.score !== undefined;

                      return (
                        <div
                          key={
                            item._id ||
                            index
                          }
                          className="flex items-center gap-3"
                        >

                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                              index ===
                              currentQuestion
                                ? "bg-blue-600 text-white"
                                : answered
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {answered &&
                            index !==
                              currentQuestion ? (
                              <CheckCircle2
                                size={15}
                              />
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div
                            className={`h-px flex-1 ${
                              index <
                              currentQuestion
                                ? "bg-emerald-200"
                                : "bg-slate-100"
                            }`}
                          />

                        </div>
                      );
                    }
                  )}

                </div>

              </Card>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default InterviewRoom;