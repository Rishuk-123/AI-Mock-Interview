import { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Resume() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState(false);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile...");

      const response = await api.get("/users/profile");

      console.log("Profile response:", response.data);

      setUser(response.data.user);
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);
      console.error("MESSAGE:", error.message);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load resume"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Resume must be smaller than 5 MB"
      );
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", file);

      const response = await api.post(
        "/users/resume",
        formData
      );

      setUser(response.data.user);

      toast.success(
        "Resume uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload resume"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleViewResume = async () => {
    if (!user?.resume) {
      toast.error("No resume uploaded");
      return;
    }

    try {
      setViewing(true);

      const response = await fetch(user.resume);

      if (!response.ok) {
        throw new Error(
          "Unable to open resume"
        );
      }

      const blob = await response.blob();

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const pdfUrl =
        URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error(
        "View resume error:",
        error
      );

      toast.error(
        "Unable to open resume. Please try again."
      );
    } finally {
      setViewing(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Loading resume...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Resume
          </h1>

          <p className="mt-2 text-slate-500">
            Upload and manage your resume.
          </p>
        </div>

        <Card className="p-8">

          {/* Resume Icon */}
          <div className="flex flex-col items-center text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FileText size={38} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              {user?.resume
                ? "Your Resume"
                : "Upload Your Resume"}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Upload your latest resume as a PDF.
              Maximum file size is 5 MB.
            </p>

          </div>

          {/* Resume Uploaded */}
          {user?.resume ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* File Information */}
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText size={22} />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      Resume PDF
                    </p>

                    <p className="text-sm text-slate-500">
                      Your resume is uploaded
                    </p>
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">

                  {/* View Resume */}
                  <Button
                    type="button"
                    onClick={handleViewResume}
                    disabled={viewing}
                  >
                    <ExternalLink
                      size={17}
                      className="mr-2"
                    />

                    {viewing
                      ? "Opening..."
                      : "View Resume"}
                  </Button>

                  {/* Replace Resume */}
                  <label className="cursor-pointer">

                    <span className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <Upload
                        size={17}
                        className="mr-2"
                      />

                      {uploading
                        ? "Uploading..."
                        : "Replace"}
                    </span>

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                    />

                  </label>

                </div>

              </div>

            </div>
          ) : (
            /* Upload Resume */
            <div className="mt-8 flex justify-center">

              <label className="cursor-pointer">

                <span className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700">
                  <Upload
                    size={18}
                    className="mr-2"
                  />

                  {uploading
                    ? "Uploading..."
                    : "Upload Resume"}
                </span>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />

              </label>

            </div>
          )}

          {/* Information */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">

            <p className="font-medium">
              Supported format
            </p>

            <p className="mt-1">
              PDF only, maximum size 5 MB.
            </p>

          </div>

        </Card>

      </div>
    </MainLayout>
  );
}

export default Resume;