import { useState, useEffect, useMemo } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Calendar,
  ShieldCheck,
  Code2,
  Briefcase,
  CheckCircle2,
  Edit3,
  Lock,
  Copy,
  Check,
  Sparkles,
  Flame,
  Trophy,
  Activity,
  X,
  Save,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token) || localStorage.getItem("token");
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const displayName = user?.fullName || user?.name || "Candidate";

  const userEmail = useMemo(() => {
    return (
      user?.email ||
      JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user
        ?.email ||
      "candidate@example.com"
    );
  }, [user?.email]);

  const [interviews, setInterviews] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Profile Form State dynamically populated from the logged-in user object
  const [formData, setFormData] = useState({
    fullName: displayName,
    email: userEmail,
    college: user?.college || "Not Specified",
    degree: user?.degree || "Not Specified",
    department: user?.department || "Not Specified",
    graduationYear: user?.graduationYear ? String(user.graduationYear) : "N/A",
    gender: user?.gender || "Not Specified",
    experience: user?.experience || "Fresher",
    skills: Array.isArray(user?.skills) && user.skills.length > 0 ? user.skills : ["GENERAL"],
  });

  const [newSkillInput, setNewSkillInput] = useState("");

  // Fetch account-specific interview history
  useEffect(() => {
    let isMounted = true;

    const fetchUserHistory = async () => {
      setLoadingStats(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        let serverRecords = [];

        if (token) {
          try {
            const res = await fetch(`${baseUrl}/api/interviews/history`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.interviews)) {
              serverRecords = data.interviews;
            }
          } catch (err) {
            console.warn("Backend fetch failed, reading user-scoped storage:", err);
          }
        }

        const userStorageKey = `recent_interviews_${userEmail}`;
        const localRecords = JSON.parse(
          localStorage.getItem(userStorageKey) || "[]"
        );

        const combined = [...serverRecords, ...localRecords];
        const unique = Array.from(
          new Map(
            combined.map((item) => [
              item.id || item._id || `${item.role}_${item.date}`,
              item,
            ])
          ).values()
        );

        if (isMounted) {
          setInterviews(unique);
        }
      } catch (err) {
        console.error("Failed to load interview history:", err);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    fetchUserHistory();

    return () => {
      isMounted = false;
    };
  }, [userEmail, token]);

  const totalInterviews = interviews.length;

  const validScores = interviews
    .map((i) => i.score ?? i.overallScore ?? i.evaluation?.score)
    .filter((s) => typeof s === "number" && !isNaN(s));

  const avgScore =
    validScores.length > 0
      ? Math.round(validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length)
      : 0;

  const getStatusText = (score, count) => {
    if (count === 0) return { label: "No Data", color: "text-slate-400" };
    if (score >= 75) return { label: "Ready", color: "text-emerald-600" };
    if (score >= 50) return { label: "Learning", color: "text-amber-500" };
    return { label: "Needs Prep", color: "text-red-500" };
  };

  const status = getStatusText(avgScore, totalInterviews);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(formData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const formatted = newSkillInput.toUpperCase().trim();
    if (formatted && !formData.skills.includes(formatted)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, formatted],
      }));
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleOpenEditModal = () => {
    setFormData({
      fullName: user?.fullName || user?.name || "",
      email: user?.email || userEmail,
      college: user?.college || "",
      degree: user?.degree || "",
      department: user?.department || "",
      graduationYear: user?.graduationYear ? String(user.graduationYear) : "",
      gender: user?.gender || "Female",
      experience: user?.experience || "Fresher",
      skills: Array.isArray(user?.skills) && user.skills.length > 0 ? user.skills : [],
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (typeof updateProfile === "function") {
        await updateProfile(formData);
      } else {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        if (token) {
          await fetch(`${baseUrl}/api/users/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });
        }
      }
    } catch (err) {
      console.warn("Failed to persist profile to server:", err);
    }
    setIsEditModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8 lg:p-10 font-sans">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* PAGE TITLE & EDIT BUTTON */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your personal, academic, and technical information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenEditModal}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          {/* MAIN PROFILE CARD */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-10">
            
            {/* 1. PROFILE HEADER SECTION WITH STAT CARDS */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-5">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-black text-white shadow-lg shadow-blue-500/20 ring-4 ring-blue-50">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "U"}
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                    <CheckCircle2 size={14} />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl font-black text-slate-900">
                      {formData.fullName}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      <Sparkles size={12} /> Candidate
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span>{formData.email}</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="ml-1 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                      title="Copy Email"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Account Active
                  </p>
                </div>
              </div>

              {/* Right: Quick Stat Cards */}
              <div className="flex items-center gap-3">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/70 p-2 text-center shadow-xs">
                  <Flame size={18} className="text-blue-600" />
                  <div className="mt-1 text-lg font-black text-slate-900">
                    {loadingStats ? <Loader2 size={16} className="animate-spin text-blue-600" /> : totalInterviews}
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Interviews</p>
                </div>

                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/70 p-2 text-center shadow-xs">
                  <Trophy size={18} className="text-indigo-600" />
                  <div className="mt-1 text-lg font-black text-indigo-600">
                    {loadingStats ? <Loader2 size={16} className="animate-spin text-indigo-600" /> : `${avgScore}%`}
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Avg Score</p>
                </div>

                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/70 p-2 text-center shadow-xs">
                  <Activity size={18} className={status.color} />
                  <div className={`mt-1 text-base font-black ${status.color}`}>
                    {loadingStats ? <Loader2 size={16} className="animate-spin" /> : status.label}
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                </div>
              </div>
            </div>

            {/* 2. PERSONAL INFORMATION */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-400">Your basic account details.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <User size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 truncate">{formData.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 truncate">{formData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Type</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">CANDIDATE</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Lock size={18} />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-800 tracking-widest">••••••••</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. EDUCATION SECTION */}
            <div className="space-y-4 border-t border-slate-100 pt-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Education</h3>
                <p className="text-xs text-slate-400">Your academic background.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">College</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 truncate">{formData.college}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <GraduationCap size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">{formData.degree}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduation Year</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">{formData.graduationYear}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. TECHNICAL SKILLS SECTION */}
            <div className="space-y-4 border-t border-slate-100 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Technical Skills</h3>
                  <p className="text-xs text-slate-400">Technologies and skills in your profile.</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Code2 size={16} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2 text-xs font-bold uppercase text-blue-700 transition hover:bg-blue-100/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. ADDITIONAL INFORMATION SECTION */}
            <div className="space-y-4 border-t border-slate-100 pt-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Additional Information</h3>
                <p className="text-xs text-slate-400">Other details in your profile.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <User size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">{formData.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Briefcase size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">{formData.experience}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">{formData.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile Status</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">Active</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">College / University</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Graduation Year</label>
                  <input
                    type="text"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700">Technical Skills</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. DOCKER"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-400 hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 cursor-pointer"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}