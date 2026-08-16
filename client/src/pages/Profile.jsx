import { useState } from "react";
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
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

function Profile() {
  const user = useAuthStore((state) => state.user);

  const fullName = user?.fullName || "John Doe";
  const email = user?.email || "john.doe@example.com";
  const initial = fullName?.charAt(0)?.toUpperCase() || "U";

  // Dynamic user data with fallbacks
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="w-full px-5 py-6 sm:px-7 lg:px-8">
          {/* HEADER */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your personal, academic, and technical information.
              </p>
            </div>

            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>

          {/* MAIN PROFILE CARD */}
          <div className="w-full overflow-hidden rounded-[22px] border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur">
            {/* PROFILE BANNER / HEADER */}
            <div className="flex flex-col gap-5 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full bg-blue-950/80 border border-blue-800/50 text-3xl font-bold text-blue-400">
                  {initial}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {fullName}
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-slate-400">
                    Candidate
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
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
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-400">
                    Account Active
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-800/80" />

            {/* PERSONAL INFORMATION */}
            <section className="px-7 py-6">
              <SectionTitle
                title="Personal Information"
                description="Your basic account information."
              />

              <div className="mt-6 grid grid-cols-1 gap-x-20 gap-y-7 md:grid-cols-2">
                <Info icon={User} label="Full Name" value={fullName} />
                <Info icon={Mail} label="Email Address" value={email} />
                <Info
                  icon={ShieldCheck}
                  label="Account Type"
                  value="Candidate"
                />

                <div className="flex items-center gap-4">
                  <Icon>
                    <Lock size={18} />
                  </Icon>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Password
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm font-semibold tracking-[3px] text-white">
                        ••••••••
                      </span>
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
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

            <div className="h-px bg-slate-800/80" />

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

            <div className="h-px bg-slate-800/80" />

            {/* TECHNICAL SKILLS */}
            <section className="px-7 py-6">
              <div className="flex items-center gap-4">
                <Icon>
                  <Code2 size={19} />
                </Icon>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Technical Skills
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Technologies and skills in your profile.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-blue-800/50 bg-blue-950/60 px-3 py-1.5 text-xs font-semibold uppercase text-blue-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-800/80" />

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
    </MainLayout>
  );
}

/* SUBCOMPONENTS */

function SectionTitle({ title, description }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function Info({ icon: IconComponent, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <Icon>
        <IconComponent size={18} />
      </Icon>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function Icon({ children }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-blue-400 border border-slate-800">
      {children}
    </div>
  );
}

export default Profile;