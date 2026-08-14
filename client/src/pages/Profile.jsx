import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Building2,
  GraduationCap,
  CalendarDays,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import MainLayout from "../layouts/MainLayout";
import api from "../services/api";


function Profile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    degree: "",
    graduationYear: "",
    skills: "",
  });


  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");

      const profile = response.data.user;

      setUser(profile);

      setFormData({
        fullName: profile?.fullName || "",
        college: profile?.college || "",
        degree: profile?.degree || "",
        graduationYear: profile?.graduationYear || "",
        skills: Array.isArray(profile?.skills)
          ? profile.skills.join(", ")
          : profile?.skills || "",
      });

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


  useEffect(() => {
    fetchProfile();
  }, []);


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = () => {
    setFormData({
      fullName: user?.fullName || "",
      college: user?.college || "",
      degree: user?.degree || "",
      graduationYear: user?.graduationYear || "",
      skills: Array.isArray(user?.skills)
        ? user.skills.join(", ")
        : user?.skills || "",
    });

    setEditing(true);
  };


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      college: user?.college || "",
      degree: user?.degree || "",
      graduationYear: user?.graduationYear || "",
      skills: Array.isArray(user?.skills)
        ? user.skills.join(", ")
        : user?.skills || "",
    });

    setEditing(false);
  };


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        fullName: formData.fullName.trim(),
        college: formData.college.trim(),
        degree: formData.degree.trim(),
        graduationYear: formData.graduationYear,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await api.put(
        "/users/profile",
        payload
      );

      setUser(response.data.user);

      toast.success("Profile updated successfully");

      setEditing(false);

    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // INITIAL
  // =========================================================

  const initial =
    user?.fullName?.charAt(0)?.toUpperCase() || "U";


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading profile...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <MainLayout>

      <div className="mx-auto w-full max-w-6xl">

        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              Account Settings
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your account, education and technical skills.
            </p>

          </div>


          {!editing && (
            <Button
              type="button"
              onClick={handleEdit}
              className="shrink-0"
            >
              <Pencil
                size={17}
                className="mr-2"
              />

              Edit Profile
            </Button>
          )}

        </div>


        {/* ================================================= */}
        {/* EDIT MODE */}
        {/* ================================================= */}

        {editing ? (

          <form
            onSubmit={handleSave}
            className="space-y-6"
          >

            {/* EDIT PERSONAL DETAILS */}

            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-lg font-bold text-slate-900">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal and academic information.
                </p>

              </div>


              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                {/* Full Name */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-11"
                  />
                </div>


                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <Input
                    value={user?.email || ""}
                    disabled
                    className="h-11 bg-slate-50"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Email cannot be changed.
                  </p>
                </div>


                {/* College */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    College
                  </label>

                  <Input
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. NIT JALANDHAR"
                    className="h-11"
                  />
                </div>


                {/* Degree */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Degree
                  </label>

                  <Input
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech"
                    className="h-11"
                  />
                </div>


                {/* Graduation Year */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Graduation Year
                  </label>

                  <Input
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="e.g. 2028"
                    className="h-11"
                  />
                </div>


                {/* Skills */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Technical Skills
                  </label>

                  <Input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="HTML, CSS, JavaScript, React"
                    className="h-11"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Separate skills using commas.
                  </p>
                </div>

              </div>


              {/* EDIT ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X
                    size={17}
                    className="mr-2"
                  />

                  Cancel
                </Button>


                <Button
                  type="submit"
                  disabled={saving}
                >
                  <Save
                    size={17}
                    className="mr-2"
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Button>

              </div>

            </Card>

          </form>

        ) : (

          /* ================================================= */
          /* VIEW MODE */
          /* ================================================= */

          <div className="space-y-6">

            {/* ================================================= */}
            {/* PROFILE SUMMARY */}
            {/* ================================================= */}

            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">

                {/* User */}

                <div className="flex items-center gap-5">

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
                    {initial}
                  </div>


                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {user?.fullName || "User"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Candidate
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 size={16} />
                      Account Active
                    </div>

                  </div>

                </div>


                {/* Account Type */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                    <ShieldCheck size={19} />
                  </div>


                  <div>

                    <p className="text-xs font-medium text-slate-400">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      Candidate
                    </p>

                  </div>

                </div>

              </div>

            </Card>


            {/* ================================================= */}
            {/* PERSONAL + EDUCATION */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

              {/* PERSONAL INFORMATION */}

              <Card className="h-fit self-start overflow-hidden border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <h2 className="text-lg font-bold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your basic account information.
                  </p>

                </div>


                <div>

                  <ProfileInfo
                    icon={User}
                    label="Full Name"
                    value={user?.fullName}
                  />

                  <ProfileInfo
                    icon={Mail}
                    label="Email Address"
                    value={user?.email}
                  />

                </div>

              </Card>


              {/* EDUCATION */}

              <Card className="h-fit self-start overflow-hidden border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <h2 className="text-lg font-bold text-slate-900">
                    Education
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your academic background.
                  </p>

                </div>


                <div>

                  <ProfileInfo
                    icon={Building2}
                    label="College"
                    value={user?.college}
                  />

                  <ProfileInfo
                    icon={GraduationCap}
                    label="Degree"
                    value={user?.degree}
                  />

                  <ProfileInfo
                    icon={CalendarDays}
                    label="Graduation Year"
                    value={user?.graduationYear}
                  />

                </div>

              </Card>

            </div>


            {/* ================================================= */}
            {/* TECHNICAL SKILLS */}
            {/* ================================================= */}

            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Code2 size={19} />
                </div>


                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Technical Skills
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Technologies and skills in your profile.
                  </p>

                </div>

              </div>


              <div className="p-6">

                {user?.skills?.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {user.skills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                    <p className="text-sm text-slate-500">
                      No technical skills added yet.
                    </p>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Add skills
                    </button>

                  </div>

                )}

              </div>

            </Card>

          </div>

        )}

      </div>

    </MainLayout>
  );
}


// =============================================================
// PROFILE INFORMATION ROW
// =============================================================

function ProfileInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={18} />
      </div>


      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
          {value || "Not specified"}
        </p>

      </div>

    </div>
  );
}


export default Profile;