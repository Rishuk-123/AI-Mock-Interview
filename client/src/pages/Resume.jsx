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
  BarChart2,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

// Configure worker source for Vite build compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// ATS Evaluation Dictionaries
const TECH_KEYWORDS = [
  "javascript", "react", "node", "express", "mongodb", "tailwind",
  "typescript", "git", "rest api", "html", "css", "c++", "python",
  "sql", "postgresql", "mysql", "docker", "aws", "redux"
];

const REQUIRED_SECTIONS = [
  "education", "experience", "skills", "projects"
];

const ACTION_VERBS = [
  "developed", "built", "implemented", "designed", "optimized",
  "created", "managed", "integrated", "lead", "architected"
];

function Resume() {
  const user = useAuthStore((state) => state.user);

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(user?.resumeUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fileInputRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    fileName: user?.resumeName || "Candidate_Resume.pdf",
    uploadedAt: "Recently",
    fileSize: "1.2 MB",
    atsScore: 82,
  });

  const [scoreBreakdown, setScoreBreakdown] = useState({
    keywordScore: 0,
    sectionScore: 0,
    actionVerbScore: 0,
  });

  const [analysisResult, setAnalysisResult] = useState({
    summary: "",
    strengths: [],
    improvements: [],
    keywordsFound: [],
  });

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Extract raw text from PDF
  const extractPdfText = async (selectedFile) => {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      text += pageText + " ";
    }

    return text.toLowerCase();
  };

  const handleFileSelected = async (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setIsAnalyzing(true);

    try {
      const extractedText = await extractPdfText(selectedFile);

      // 1. Section Formatting Score (30% weight)
      const foundSections = REQUIRED_SECTIONS.filter((sec) =>
        extractedText.includes(sec)
      );
      const sectionScore = Math.round((foundSections.length / REQUIRED_SECTIONS.length) * 30);

      // 2. Keyword Density Score (50% weight)
      const foundKeywords = TECH_KEYWORDS.filter((kw) =>
        extractedText.includes(kw)
      );
      const keywordScore = Math.round((foundKeywords.length / TECH_KEYWORDS.length) * 50);

      // 3. Action Verb & Impact Score (20% weight)
      const foundVerbs = ACTION_VERBS.filter((verb) =>
        extractedText.includes(verb)
      );
      const actionVerbScore = Math.round((foundVerbs.length / ACTION_VERBS.length) * 20);

      // Final Weighted Score
      const totalScore = Math.min(100, sectionScore + keywordScore + actionVerbScore);

      setScoreBreakdown({
        keywordScore,
        sectionScore,
        actionVerbScore,
      });

      const formattedKeywords = foundKeywords.map(
        (k) => k.charAt(0).toUpperCase() + k.slice(1)
      );

      setResumeData({
        fileName: selectedFile.name,
        uploadedAt: "Just now",
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        atsScore: totalScore,
      });

      const strengthsList = [];
      const improvementsList = [];

      if (foundSections.length === REQUIRED_SECTIONS.length) {
        strengthsList.push("Complete standard structure (Education, Experience, Skills, Projects)");
      } else {
        improvementsList.push(`Missing standard section headers: ${REQUIRED_SECTIONS.filter(s => !foundSections.includes(s)).join(", ")}`);
      }

      if (foundKeywords.length >= 5) {
        strengthsList.push(`Detected ${foundKeywords.length} relevant tech stack keywords`);
      } else {
        improvementsList.push("Low technical keyword density. Add specific frameworks, languages, and tools.");
      }

      if (foundVerbs.length >= 3) {
        strengthsList.push("Good usage of action verbs for project descriptions");
      } else {
        improvementsList.push("Enhance bullet points with strong action verbs (e.g., Optimized, Implemented)");
      }

      setAnalysisResult({
        summary: `Analyzed document text: Scored ${totalScore}/100 across section structure, keyword density, and impact phrasing.`,
        strengths: strengthsList,
        improvements: improvementsList,
        keywordsFound: formattedKeywords.length > 0 ? formattedKeywords : ["No Core Tech Keywords"],
      });
    } catch (err) {
      console.error("Parsing Error:", err);
      alert("Error reading PDF text. Please ensure the file is not password protected.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveResume = () => {
    if (fileUrl && fileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setResumeData(null);
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
                Multi-factor ATS compliance scoring, formatting checks, and keyword extraction.
              </p>
            </div>

            {resumeData && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
              >
                <RefreshCw size={16} />
                Re-upload Resume
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files[0] && handleFileSelected(e.target.files[0])}
            accept=".pdf"
            className="hidden"
          />

          {/* UPLOAD DROPZONE */}
          {!resumeData && !isAnalyzing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center transition hover:border-blue-400 hover:bg-slate-50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                <Upload size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Upload your PDF Resume
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Click to browse or drop your PDF here for instant ATS scoring
              </p>
            </div>
          )}

          {/* LOADING STATE */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 shadow-sm">
              <Sparkles size={32} className="animate-spin text-blue-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Running ATS Evaluation...
              </h3>
            </div>
          )}

          {/* ANALYSIS RESULTS */}
          {resumeData && !isAnalyzing && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-5">
                {/* FILE DETAILS */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
                      onClick={() => setShowPreviewModal(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <Eye size={15} /> Preview PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* OVERALL ATS SCORE */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <Target size={15} className="text-blue-600" /> ATS Compatibility Score
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        resumeData.atsScore >= 70
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-amber-100 bg-amber-50 text-amber-600"
                      }`}
                    >
                      {resumeData.atsScore >= 70 ? "Passed" : "Needs Work"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-5">
                    <div
                      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border text-2xl font-extrabold ${
                        resumeData.atsScore >= 70
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-amber-100 bg-amber-50 text-amber-600"
                      }`}
                    >
                      {resumeData.atsScore}%
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">
                        {resumeData.atsScore >= 70
                          ? "Great Match!"
                          : "Sub-optimal Match"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Based on technical keywords, section completeness, and action verbs.
                      </p>
                    </div>
                  </div>

                  {/* SCORE BREAKDOWN METRICS */}
                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between">
                      <span>Tech Keyword Density (50% max):</span>
                      <span className="text-slate-900 font-bold">{scoreBreakdown.keywordScore} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Section Structure (30% max):</span>
                      <span className="text-slate-900 font-bold">{scoreBreakdown.sectionScore} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Action Verbs & Impact (20% max):</span>
                      <span className="text-slate-900 font-bold">{scoreBreakdown.actionVerbScore} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FEEDBACK & KEYWORDS */}
              <div className="flex flex-col gap-6 lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <BarChart2 size={20} className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      AI Analysis & Detailed Breakdown
                    </h3>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                        <CheckCircle2 size={16} /> Key Strengths
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {analysisResult.strengths.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
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
                      <ul className="mt-3 space-y-2">
                        {analysisResult.improvements.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Award size={16} className="text-blue-600" /> Extracted Technical Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordsFound.map((keyword) => (
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

      {/* PREVIEW MODAL */}
      {showPreviewModal && fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">{resumeData?.fileName}</h3>
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
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
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