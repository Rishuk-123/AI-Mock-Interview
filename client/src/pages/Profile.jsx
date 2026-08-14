import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  Calendar,
  Building2,
  GraduationCap,
  Code2,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  Pencil,
} from "lucide-react";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Profile error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-sm font-medium text-slate-500">
            Loading profile...
          </div>
        </div>
      </MainLayout>
    );
  }

  const fullName = user?.fullName || "User";

  const initial =
    fullName.charAt(0)?.toUpperCase() || "U";

  const email = user?.email || "Not available";

  const accountType =
    user?.accountType ||
    user?.role ||
    "Candidate";

  const graduationYear =
    user?.graduationYear || "Not available";

  const college =
    user?.college ||
    user?.education?.college ||
    "Not available";

  const degree =
    user?.degree ||
    user?.education?.degree ||
    "Not available";

  const skills =
    user?.skills ||
    user?.technicalSkills ||
    [];

  const lastEntryDate =
    user?.lastEntryDate ||
    user?.lastLogin ||
    user?.updatedAt;

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-7 flex items-end justify-between gap-4">

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              Account Settings
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your personal, academic and technical information.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>

        </div>

        {/* =====================================================
            MAIN PROFILE CARD
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* =================================================
              PROFILE HEADER
          ================================================== */}
          <section className="px-7 py-7 lg:px-9">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              {/* User */}
              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600 ring-8 ring-blue-50/60">
                  {initial}
                </div>

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {accountType}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={16} />
                    <span>{email}</span>
                  </div>

                </div>
              </div>

              {/* Account Status */}
              <div className="sm:text-right">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account Status
                </p>

                <div className="mt-2 flex items-center gap-2 sm:justify-end">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm font-semibold text-emerald-600">
                    Account Active
                  </span>

                </div>

              </div>

            </div>

          </section>

          <div className="border-t border-slate-200" />

          {/* =================================================
              PERSONAL INFORMATION
          ================================================== */}
          <section className="px-7 py-7 lg:px-9">

            <div className="mb-6">

              <h3 className="text-xl font-bold text-slate-900">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your basic account information.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-x-16 gap-y-7 md:grid-cols-2">

              {/* Full Name */}
              <InfoItem
                icon={User}
                label="Full Name"
                value={fullName}
              />

              {/* Email */}
              <InfoItem
                icon={Mail}
                label="Email Address"
                value={email}
              />

              {/* Account Type */}
              <InfoItem
                icon={ShieldCheck}
                label="Account Type"
                value={accountType}
              />

              {/* Password */}
              <div className="flex items-start gap-4">

                <IconBox icon={Lock} />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Password
                  </p>

                  <div className="mt-1 flex items-center gap-3">

                    <span className="font-semibold tracking-[0.2em] text-slate-900">
                      ••••••••
                    </span>

                    <button
                      type="button"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Change
                    </button>

                  </div>
                </div>

              </div>

              {/* Last Entry */}
              <InfoItem
                icon={Calendar}
                label="Last Entry Date"
                value={formatDate(lastEntryDate)}
              />

            </div>

          </section>

          <div className="border-t border-slate-200" />

          {/* =================================================
              EDUCATION
          ================================================== */}
          <section className="px-7 py-7 lg:px-9">

            <div className="mb-6">

              <h3 className="text-xl font-bold text-slate-900">
                Education
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your academic background.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

              <InfoItem
                icon={Building2}
                label="College"
                value={college}
              />

              <InfoItem
                icon={GraduationCap}
                label="Degree"
                value={degree}
              />

              <InfoItem
                icon={Calendar}
                label="Graduation Year"
                value={graduationYear}
              />

            </div>

          </section>

          <div className="border-t border-slate-200" />

          {/* =================================================
              TECHNICAL SKILLS
          ================================================== */}
          <section className="px-7 py-7 lg:px-9">

            <div className="mb-5 flex items-start gap-4">

              <IconBox icon={Code2} />

              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  Technical Skills
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Technologies and skills in your profile.
                </p>

              </div>

            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">

                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-600"
                  >
                    {typeof skill === "string"
                      ? skill
                      : skill.name}
                  </span>
                ))}

              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No technical skills added yet.
              </p>
            )}

          </section>

          <div className="border-t border-slate-200" />

          {/* =================================================
              ADDITIONAL INFORMATION
          ================================================== */}
          <section className="px-7 py-7 lg:px-9">

            <div className="mb-6">

              <h3 className="text-xl font-bold text-slate-900">
                Additional Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Additional details from your profile.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-x-16 gap-y-7 md:grid-cols-2">

              <InfoItem
                icon={User}
                label="Gender"
                value={
                  user?.gender || "Not available"
                }
              />

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={
                  user?.phone ||
                  user?.phoneNumber ||
                  "Not available"
                }
              />

              <InfoItem
                icon={MapPin}
                label="Location"
                value={
                  user?.location || "Not available"
                }
              />

              <InfoItem
                icon={Globe}
                label="Language"
                value={
                  user?.language ||
                  user?.languages ||
                  "Not available"
                }
              />

              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={
                  user?.dateOfBirth
                    ? formatDate(user.dateOfBirth)
                    : "Not available"
                }
              />

              <InfoItem
                icon={Briefcase}
                label="Experience Level"
                value={
                  user?.experienceLevel ||
                  user?.experience ||
                  "Fresher"
                }
              />

            </div>

          </section>

        </div>

      </div>
    </MainLayout>
  );
}


/* =========================================================
   SMALL REUSABLE COMPONENTS
========================================================= */

function IconBox({ icon: Icon }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
      <Icon size={20} strokeWidth={1.8} />
    </div>
  );
}


function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-4">

      <IconBox icon={Icon} />

      <div className="min-w-0">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
}


export default Profile;