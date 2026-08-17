import { useState, useEffect } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  CalendarDays,
  Building2,
  GraduationCap,
  Code2,
  Pencil,
  X,
  Check,
  Loader2,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

function Profile() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const loading = useAuthStore((state) => state.loading);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    degree: "",
    graduationYear: "",
    skills: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        college: user.college || "NIT Jalandhar",
        degree: user.degree || "B.Tech",
        graduationYear: user.graduationYear || "2028",
        skills: user.skills?.length
          ? user.skills.join(", ")
          : "HTML, CSS, JAVASCRIPT, C++, NODE.JS, REACT",
      });
    }
  }, [user, isEditing]);

  const fullName = user?.fullName || "John Doe";
  const email = user?.email || "john.doe@example.com";
  const initial = fullName?.charAt(0)?.toUpperCase() || "U";

  const academic = {
    college: user?.college || "NIT Jalandhar",
    degree: user?.degree || "B.Tech",
    graduationYear: user?.graduationYear || "2028",
  };

  const skills = user?.skills?.length
    ? user.skills
    : ["HTML", "CSS", "JAVASCRIPT", "C++", "NODE.JS", "REACT"];

  const additionalInfo = {
    gender: user?.gender || "Male",
    experience: user?.experience || "Fresher",
    department: user?.department || "Information Technology",
    profileStatus: user?.status || "Active",
    lastEntryDate: user?.lastEntryDate || "11/8/2026",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedPayload = {
      ...formData,
      skills: skillsArray,
    };

    if (updateProfile) {
      await updateProfile(updatedPayload);
    }
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-8">
          {/* HEADER WITH CORRECTED VERTICAL ALIGNMENT */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              onClick={() => setIsEditing(true)}
              className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>

          {/* MAIN CARD */}
          <div className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* BANNER */}
            <div className="flex flex-col gap-5 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold uppercase text-white shadow-md">
                  {initial}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {fullName}
                  </h2>
                  <p className="mt-0.5 text-sm font-medium capitalize text-slate-500">
                    {user?.role || "Candidate"}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={16} />
                    <span>{email}</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account Status
                </p>
                <div className="mt-1.5 flex items-center gap-2 sm:justify-end">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-600">
                    Account Active
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* PERSONAL INFO */}
            <section className="px-7 py-6">
              <SectionTitle
                title="Personal Information"
                description="Your basic account details."
              />

              <div className="mt-6 grid grid-cols-1 gap-x-20 gap-y-7 md:grid-cols-2">
                <Info icon={User} label="Full Name" value={fullName} />
                <Info icon={Mail} label="Email Address" value={email} />
                <Info
                  icon={ShieldCheck}
                  label="Account Type"
                  value={user?.role ? user.role.toUpperCase() : "CANDIDATE"}
                />

                <div className="flex items-center gap-4">
                  <IconContainer>
                    <Lock size={18} />
                  </IconContainer>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Password
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm font-semibold tracking-[3px] text-slate-900">
                        ••••••••
                      </span>
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <Info
                  icon={CalendarDays}
                  label="Last Entry Date"
                  value={additionalInfo.lastEntryDate}
                />
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* EDUCATION */}
            <section className="px-7 py-6">
              <SectionTitle
                title="Education"
                description="Your academic background."
              />

              <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-3">
                <Info
                  icon={Building2}
                  label="College"
                  value={academic.college}
                />
                <Info
                  icon={GraduationCap}
                  label="Degree"
                  value={academic.degree}
                />
                <Info
                  icon={CalendarDays}
                  label="Graduation Year"
                  value={academic.graduationYear}
                />
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* TECHNICAL SKILLS */}
            <section className="px-7 py-6">
              <div className="flex items-center gap-4">
                <IconContainer>
                  <Code2 size={19} />
                </IconContainer>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Technical Skills
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Technologies and skills in your profile.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ADDITIONAL INFORMATION */}
            <section className="px-7 py-6">
              <SectionTitle
                title="Additional Information"
                description="Other information in your profile."
              />

              <div className="mt-6 grid grid-cols-1 gap-x-20 gap-y-7 md:grid-cols-2">
                <Info
                  icon={User}
                  label="Gender"
                  value={additionalInfo.gender}
                />
                <Info
                  icon={User}
                  label="Experience"
                  value={additionalInfo.experience}
                />
                <Info
                  icon={Building2}
                  label="Department"
                  value={additionalInfo.department}
                />
                <Info
                  icon={CalendarDays}
                  label="Profile Status"
                  value={additionalInfo.profileStatus}
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Edit Profile Details
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <X size={16} /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Info({ icon: IconComponent, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <IconContainer>
        <IconComponent size={18} />
      </IconContainer>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function IconContainer({ children }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-blue-600">
      {children}
    </div>
  );
}

export default Profile;