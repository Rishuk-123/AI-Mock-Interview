import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Briefcase, Building2, Brain, Gauge } from "lucide-react";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
      <div className="mx-auto w-full max-w-xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Start a New Interview
          </h1>

          <p className="mt-2 text-slate-500">
            Configure your interview and get ready to practice.
          </p>
        </div>

        <Card className="p-6 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" />

                <label className="text-sm font-medium text-slate-700">
                  Job Role
                </label>
              </div>

              <Input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" />

                <label className="text-sm font-medium text-slate-700">
                  Company
                </label>
              </div>

              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Brain size={18} className="text-blue-600" />

                <label className="text-sm font-medium text-slate-700">
                  Interview Type
                </label>
              </div>

              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="Behavioral">
                  Behavioral
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Mixed">
                  Mixed
                </option>
              </select>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Gauge size={18} className="text-blue-600" />

                <label className="text-sm font-medium text-slate-700">
                  Difficulty
                </label>
              </div>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating Interview..."
                : "Start Interview"}
            </Button>

          </form>

        </Card>

      </div>
    </MainLayout>
  );
}

export default InterviewSetup;