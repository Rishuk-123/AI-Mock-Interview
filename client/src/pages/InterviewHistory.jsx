import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InterviewHistory() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");

        console.log(
          "Interview history:",
          response.data
        );

        setInterviews(
          response.data.interviews || []
        );
      } catch (error) {
        console.error(
          "Interview history error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load interview history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-green-50 text-green-600";
    }

    if (status === "in-progress") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-yellow-50 text-yellow-600";
  };

  const getStatusText = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    if (status === "completed") {
      return "Completed";
    }

    return "Scheduled";
  };

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return "text-green-600";
    }

    if (score >= 60) {
      return "text-blue-600";
    }

    return "text-red-600";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Loading interview history...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Interview History
          </h1>

          <p className="mt-2 text-slate-500">
            Review your previous interviews and
            performance.
          </p>
        </div>

        {/* Empty State */}
        {interviews.length === 0 ? (
          <Card className="p-10">
            <div className="text-center">

              <h2 className="text-xl font-semibold text-slate-900">
                No interviews yet
              </h2>

              <p className="mt-2 text-slate-500">
                Start your first mock interview to
                see your results here.
              </p>

              <Button
                className="mt-6"
                onClick={() =>
                  navigate("/interview")
                }
              >
                Start Interview
              </Button>

            </div>
          </Card>
        ) : (
          <div className="space-y-4">

            {interviews.map((interview) => {
              const score =
                interview.overallScore || 0;

              return (
                <Card
                  key={interview._id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    {/* Interview Information */}
                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-semibold text-slate-900">
                          {interview.role ||
                            "Interview"}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            interview.status
                          )}`}
                        >
                          {getStatusText(
                            interview.status
                          )}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {interview.company ||
                          "Company not specified"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                        <span>
                          Type:{" "}
                          <strong className="font-medium text-slate-700">
                            {interview.interviewType ||
                              "Not specified"}
                          </strong>
                        </span>

                        <span>
                          Difficulty:{" "}
                          <strong className="font-medium text-slate-700">
                            {interview.difficulty ||
                              "Not specified"}
                          </strong>
                        </span>

                        <span>
                          {interview.createdAt
                            ? new Date(
                                interview.createdAt
                              ).toLocaleDateString()
                            : "Date unavailable"}
                        </span>

                      </div>

                    </div>

                    {/* Score */}
                    <div className="flex shrink-0 items-center gap-6">

                      <div className="text-center">

                        <p className="text-xs text-slate-500">
                          Score
                        </p>

                        <p
                          className={`mt-1 text-2xl font-bold ${getScoreStyle(
                            score
                          )}`}
                        >
                          {interview.status ===
                          "completed"
                            ? score
                            : "--"}
                        </p>

                        <p className="text-xs text-slate-400">
                          / 100
                        </p>

                      </div>

                      {/* Action */}
                      <Button
                        onClick={() => {
                          if (
                            interview.status ===
                            "completed"
                          ) {
                            navigate(
                              `/interview/${interview._id}/results`
                            );
                          } else {
                            navigate(
                              `/interview/${interview._id}`
                            );
                          }
                        }}
                      >
                        {interview.status ===
                        "completed"
                          ? "View Results"
                          : "Continue"}
                      </Button>

                    </div>

                  </div>
                </Card>
              );
            })}

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default InterviewHistory;