import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Target,
  Award,
  ExternalLink,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

function Resume() {
  const user = useAuthStore((state) => state.user);

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(user?.resumeUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fileInputRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    fileName: user?.resumeName || "Candidate_Resume_2026.pdf",
    uploadedAt: "Aug 15, 2026",
    fileSize: "1.2 MB",
    atsScore: 82,
  });

  const [analysisResult, setAnalysisResult] = useState({
    summary:
      "Strong background in React, Node.js, and Full-Stack Architecture.",
    strengths: [
      "Quantifiable metrics included in projects",
      "Clean visual structure and section titles",
      "High keyword density for Full-Stack Developer roles",
    ],
    improvements: [
      "Include links to live project demos or GitHub repositories",
      "Add cloud deployment tools like AWS or Docker to technical skills",
    ],
    keywordsFound: [
      "JavaScript",
      "React.js",
      "Node.js",
      "MongoDB",
      "Express",
      "Tailwind CSS",
      "REST APIs",
    ],
  });

  // Create temporary Blob URL whenever a new file is uploaded locally
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    runAiAnalysis(selectedFile.name, selectedFile.size);
  };

  const runAiAnalysis = (fileName, fileSize) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResumeData({
        fileName: fileName,
        uploadedAt: "Just now",
        fileSize: `${(fileSize / (1024 * 1024)).toFixed(1)} MB`,
        atsScore: 88,
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleRemoveResume = () => {
    if (fileUrl && fileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setResumeData(null);
    setAnalysisResult(null);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Resume Analyzer
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Upload your resume for instant AI analysis, ATS scoring, and
                customized interview questions.
              </p>
            </div>

            {resumeData && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
              >
                <RefreshCw size={16} />
                Re-upload Resume
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          {/* DRAG & DROP AREA / UPLOAD SECTION */}
          {!resumeData && !isAnalyzing && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                <Upload size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Upload your PDF Resume
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Drag and drop your file here, or click to browse
              </p>
              <p className="mt-2 text-xs font-medium text-slate-400">
                Supports PDF files up to 5MB
              </p>
            </div>
          )}

          {/* LOADING STATE */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-16 shadow-sm">
              <div className="flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <Sparkles size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Analyzing Resume with AI...
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Parsing tech stack, checking ATS readiness, and generating
                recommendations.
              </p>
            </div>
          )}

          {/* RESUME DISPLAY & ATS RESULTS */}
          {resumeData && !isAnalyzing && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-6 lg:col-span-5">
                {/* FILE CARD */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                      <FileText size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-bold text-slate-900">
                        {resumeData.fileName}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {resumeData.fileSize} • Uploaded {resumeData.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!fileUrl) {
                          alert("Please upload a PDF file to preview.");
                          return;
                        }
                        setShowPreviewModal(true);
                      }}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <Eye size={15} /> Preview PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="flex cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                      title="Delete Resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* ATS SCORE CARD */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <Target size={15} className="text-blue-600" /> ATS
                      Compatibility Score
                    </span>
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                      Passed
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-2xl font-extrabold text-emerald-600">
                      {resumeData.atsScore}%
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">
                        Great ATS Match!
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        Your resume contains well-formatted headings and
                        recognizable technical skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6 lg:col-span-7">
                {/* STRENGTHS & IMPROVEMENTS */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        AI Evaluation & Feedback
                      </h3>
                      <p className="text-xs text-slate-500">
                        Automated insights based on your technical profile
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                        <CheckCircle2 size={16} /> Key Strengths
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {analysisResult?.strengths.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs font-medium text-slate-700"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-amber-600">
                        <AlertCircle size={16} /> Recommended Improvements
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {analysisResult?.improvements.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs font-medium text-slate-700"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* KEYWORDS */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Award size={16} className="text-blue-600" /> Extracted
                    Technical Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult?.keywordsFound.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase text-blue-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {showPreviewModal && fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {resumeData?.fileName}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Open in new tab <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100">
              <iframe
                src={fileUrl}
                title="PDF Document Preview"
                className="h-full w-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Resume;