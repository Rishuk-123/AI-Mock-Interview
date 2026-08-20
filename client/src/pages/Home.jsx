import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  FileText,
  History,
  BarChart2,
  Heart,
} from "lucide-react";

// Reusable Scroll Animation Wrapper
function ScrollFrame({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const capabilities = [
    {
      title: "AI Interview Evaluation",
      description:
        "Instant feedback on communication, technical accuracy, and structural clarity.",
      icon: <Cpu className="text-blue-600" size={26} />,
      badge: "AI Powered",
    },
    {
      title: "Interview History & Analytics",
      description:
        "Log past sessions, review detailed scores, and monitor progress over time.",
      icon: <BarChart2 className="text-blue-600" size={26} />,
      badge: "Tracking",
    },
    {
      title: "Resume-Based Mock Interviews",
      description:
        "Upload your resume to receive AI questions targeted directly at your experience.",
      icon: <FileText className="text-blue-600" size={26} />,
      badge: "Customized",
    },
    {
      title: "Downloadable Results",
      description:
        "Export key takeaways, identified strengths, and area-by-area feedback summaries.",
      icon: <History className="text-blue-600" size={26} />,
      badge: "Reports",
    },
  ];

  const interviewModes = [
    {
      title: "HR Interview Mode",
      description:
        "Behavioral and situational questions assessing communication and problem-solving.",
    },
    {
      title: "Technical Mode",
      description:
        "Deep technical questions targeted to specific software engineering and tech roles.",
    },
    {
      title: "Credit System",
      description:
        "Flexible pay-as-you-go credit management powered by Razorpay checkout.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <div>
        {/* PUBLIC NAVBAR */}
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-12 shadow-xs">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white text-sm shadow-md shadow-blue-600/30">
              AI
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              InterviewPro
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
          <ScrollFrame>
            <div className="mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 border border-blue-100 mb-6">
                <Sparkles size={14} /> AI-Powered Preparation
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900">
                Ace Your Next Interview with{" "}
                <span className="text-blue-600">AI Feedback</span>
              </h1>
              <p className="mt-6 text-lg font-medium text-slate-600">
                Practice real-time mock interviews, receive instant feedback,
                and refine your responses with smart analytics.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
                >
                  Get Started Free <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </ScrollFrame>
        </section>

        {/* ADVANCED AI CAPABILITIES SECTION */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <ScrollFrame>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Advanced AI <span className="text-blue-600">Capabilities</span>
              </h2>
            </div>
          </ScrollFrame>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((item, index) => (
              <ScrollFrame key={item.title} delay={index * 0.1}>
                <div className="flex items-start gap-5 rounded-3xl bg-white p-8 border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-200 h-full">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                    {item.icon}
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mb-2">
                      {item.badge}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollFrame>
            ))}
          </div>
        </section>

        {/* MULTIPLE INTERVIEW MODES SECTION */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">
          <ScrollFrame>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Multiple Interview <span className="text-blue-600">Modes</span>
              </h2>
            </div>
          </ScrollFrame>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewModes.map((mode, index) => (
              <ScrollFrame key={mode.title} delay={index * 0.1}>
                <div className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-200 h-full">
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 font-bold text-sm">
                      0{index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {mode.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                </div>
              </ScrollFrame>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Creator Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs shadow-xs">
              AI
            </div>
            <span className="text-sm font-semibold text-slate-700">
              © {new Date().getFullYear()} InterviewPro. Created by{" "}
              <span className="font-bold text-slate-900">Rishu Kesharwani</span>
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <button
              onClick={() => navigate("/pricing")}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
