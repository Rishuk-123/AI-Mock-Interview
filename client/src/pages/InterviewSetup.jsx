import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Briefcase,
  Building2,
  Brain,
  Gauge,
  Sparkles,
} from "lucide-react";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InterviewSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    interviewType: "Technical",
    difficulty: "Medium",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role.trim()) {
      toast.error("Please enter a job role");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/interviews", formData);

      toast.success("Interview created successfully");

      const interviewId = response.data.interview._id;

      navigate(`/interview/${interviewId}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl bg-slate-950 text-white min-h-screen p-6">

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={22}
              className="text-blue-400"
            />

            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              AI Interview Practice
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Start a New Interview
          </h1>

          <p className="mt-2 text-lg text-slate-400">
            Configure your interview and practice with an AI interviewer.
          </p>
        </div>

        {/* Main Card */}
        <Card className="overflow-hidden border-slate-800 bg-slate-900/80 p-0 shadow-xl backdrop-blur">

          {/* Card Header */}
          <div className="border-b border-slate-800/80 px-8 py-6">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/50">
                <Sparkles size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Interview Details
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Select the type of interview you want to practice.
                </p>
              </div>

            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div className="space-y-7 px-8 py-7">

              {/* Job Role + Company */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Job Role */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Briefcase
                      size={18}
                      className="text-blue-400"
                    />

                    <label className="text-sm font-semibold text-slate-300">
                      Job Role{" "}
                      <span className="text-red-400">*</span>
                    </label>
                  </div>

                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    className="h-12 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    The role you are preparing for.
                  </p>
                </div>

                {/* Company */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Building2
                      size={18}
                      className="text-blue-400"
                    />

                    <label className="text-sm font-semibold text-slate-300">
                      Company
                    </label>
                  </div>

                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Google, Microsoft, Amazon"
                    className="h-12 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Optional — helps personalize the interview.
                  </p>
                </div>

              </div>

              {/* Interview Settings */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-white">
                  Interview Settings
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Interview Type */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Brain
                        size={18}
                        className="text-blue-400"
                      />

                      <label className="text-sm font-semibold text-slate-300">
                        Interview Type
                      </label>
                    </div>

                    <select
                      name="interviewType"
                      value={formData.interviewType}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Technical" className="bg-slate-950 text-white">
                        Technical
                      </option>

                      <option value="Behavioral" className="bg-slate-950 text-white">
                        Behavioral
                      </option>

                      <option value="HR" className="bg-slate-950 text-white">
                        HR
                      </option>

                      <option value="Mixed" className="bg-slate-950 text-white">
                        Mixed
                      </option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Gauge
                        size={18}
                        className="text-blue-400"
                      />

                      <label className="text-sm font-semibold text-slate-300">
                        Difficulty
                      </label>
                    </div>

                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Easy" className="bg-slate-950 text-white">
                        Easy
                      </option>

                      <option value="Medium" className="bg-slate-950 text-white">
                        Medium
                      </option>

                      <option value="Hard" className="bg-slate-950 text-white">
                        Hard
                      </option>
                    </select>
                  </div>

                </div>
              </div>

            </div>

            {/* What You Can Expect */}
            <div className="border-t border-slate-800/80 bg-slate-950/60 px-8 py-6">

              <h3 className="mb-5 text-sm font-bold text-white">
                What you can expect
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Feature 1 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-blue-400 border border-blue-800/50">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-slate-200">
                      Relevant Questions
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Questions based on your selected role.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-blue-400 border border-blue-800/50">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-slate-200">
                      AI Evaluation
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Receive feedback on your answers.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-blue-400 border border-blue-800/50">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-slate-200">
                      Performance Score
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Track your interview performance.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Submit */}
            <div className="border-t border-slate-800/80 px-8 py-6">

              <Button
                type="submit"
                className="h-12 w-full text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                disabled={loading}
              >
                {loading
                  ? "Creating Interview..."
                  : "Start Interview"}

                {!loading && (
                  <span className="ml-2 text-xl">
                    →
                  </span>
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Your interview will be generated using your selections.
              </p>

            </div>

          </form>
        </Card>
      </div>
    </MainLayout>
  );
}

export default InterviewSetup;