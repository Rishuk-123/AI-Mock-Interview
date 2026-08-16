import { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
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
      toast.error("Resume must be smaller than 5 MB");
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

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);

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
        throw new Error("Unable to open resume");
      }

      const blob = await response.blob();

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error("View resume error:", error);

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
        <div className="flex min-h-[500px] items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />

            <p className="text-sm font-medium text-slate-400">
              Loading resume...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-5xl bg-slate-950 text-white min-h-screen p-6">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <FileText
              size={20}
              className="text-blue-400"
            />

            <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">
              Resume Management
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Your Resume
          </h1>

          <p className="mt-2 max-w-2xl text-lg text-slate-400">
            Upload your latest resume so you can keep your
            profile ready for interviews.
          </p>
        </div>

        {/* MAIN CARD */}
        <Card className="overflow-hidden border-slate-800 bg-slate-900/80 p-0 shadow-xl backdrop-blur">

          {/* TOP SECTION */}
          <div className="border-b border-slate-800/80 px-8 py-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-950 text-blue-400 border border-blue-800/50 shadow-lg shadow-blue-500/10">
                <FileText size={38} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-white">
                {user?.resume
                  ? "Resume uploaded"
                  : "Upload your resume"}
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Upload your latest resume in PDF format.
                The maximum supported file size is 5 MB.
              </p>
            </div>
          </div>

          {/* UPLOADED RESUME */}
          {user?.resume ? (
            <div className="px-8 py-7">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  {/* FILE INFO */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-950/80 text-red-400 border border-red-800/50">
                      <FileText size={27} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-white">
                          Resume.pdf
                        </p>

                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-emerald-400"
                        />
                      </div>

                      <p className="mt-1 text-sm text-slate-400">
                        PDF document • Ready to view
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={handleViewResume}
                      disabled={viewing}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                    >
                      <ExternalLink size={17} />

                      {viewing
                        ? "Opening..."
                        : "View Resume"}
                    </Button>

                    <label className="cursor-pointer">
                      <span className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white">
                        <Upload size={17} />

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
            </div>
          ) : (

            /* UPLOAD STATE */
            <div className="px-8 py-8">
              <label className="block cursor-pointer">
                <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/60 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-blue-950/30">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-blue-400 border border-slate-800 shadow-sm">
                    <Upload size={26} />
                  </div>

                  <p className="mt-5 text-base font-semibold text-white">
                    {uploading
                      ? "Uploading your resume..."
                      : "Upload your resume"}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Click here to select a PDF file
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-400 shadow-sm">
                    <FileCheck2 size={15} />
                    PDF only • Maximum 5 MB
                  </div>
                </div>

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

          {/* FOOTER INFO */}
          <div className="border-t border-slate-800/80 bg-slate-950/60 px-8 py-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800/40">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Secure Resume Storage
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Your uploaded resume is associated with
                    your account.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800/40">
                  <FileCheck2 size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Supported Format
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    PDF files only, with a maximum size of 5 MB.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </Card>

      </div>
    </MainLayout>
  );
}

export default Resume;