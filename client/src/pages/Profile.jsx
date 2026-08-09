import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  Building2,
  Pencil,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");

        const userData = response.data.user;

        setUser(userData);

        setFormData({
          fullName: userData?.fullName || "",
          college: userData?.college || "",
          degree: userData?.degree || "",
          graduationYear:
            userData?.graduationYear || "",
          skills:
            userData?.skills?.join(", ") || "",
        });
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData({
      fullName: user?.fullName || "",
      college: user?.college || "",
      degree: user?.degree || "",
      graduationYear:
        user?.graduationYear || "",
      skills:
        user?.skills?.join(", ") || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      college: user?.college || "",
      degree: user?.degree || "",
      graduationYear:
        user?.graduationYear || "",
      skills:
        user?.skills?.join(", ") || "",
    });

    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setSaving(true);

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await api.put(
        "/users/profile",
        {
          fullName: formData.fullName.trim(),
          college: formData.college.trim(),
          degree: formData.degree.trim(),
          graduationYear:
            formData.graduationYear,
          skills: skillsArray,
        }
      );

      setUser(response.data.user);

      setFormData({
        fullName:
          response.data.user?.fullName || "",
        college:
          response.data.user?.college || "",
        degree:
          response.data.user?.degree || "",
        graduationYear:
          response.data.user?.graduationYear ||
          "",
        skills:
          response.data.user?.skills?.join(
            ", "
          ) || "",
      });

      setEditing(false);

      toast.success(
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Loading profile...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your account information.
            </p>
          </div>

          {!editing && (
            <Button onClick={handleEdit}>
              <Pencil
                size={17}
                className="mr-2"
              />
              Edit Profile
            </Button>
          )}

        </div>

        {!editing ? (
          /* =========================
             VIEW PROFILE
          ========================== */
          <Card className="overflow-hidden p-0">

            {/* Profile Header */}
            <div className="flex flex-col items-center border-b border-slate-200 px-8 py-8">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={42} />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                {user?.fullName || "User"}
              </h2>

              <p className="mt-1 capitalize text-slate-500">
                {user?.role || "candidate"}
              </p>

            </div>

            {/* User Information */}
            <div className="space-y-4 p-8">

              {/* Name */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <User size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {user?.fullName ||
                      "Not available"}
                  </p>
                </div>

              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {user?.email ||
                      "Not available"}
                  </p>
                </div>

              </div>

              {/* Account Type */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Shield size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Account Type
                  </p>

                  <p className="mt-1 font-medium capitalize text-slate-900">
                    {user?.role ||
                      "candidate"}
                  </p>
                </div>

              </div>

              {/* College */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Building2 size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    College
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {user?.college ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* Degree */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <GraduationCap size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Degree
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {user?.degree ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* Graduation Year */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <span className="text-sm font-bold">
                    Y
                  </span>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Graduation Year
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {user?.graduationYear ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              {/* Skills */}
              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-sm text-slate-500">
                  Skills
                </p>

                {user?.skills?.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.skills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-1 font-medium text-slate-900">
                    No skills added
                  </p>
                )}

              </div>

            </div>
          </Card>
        ) : (
          /* =========================
             EDIT PROFILE
          ========================== */
          <Card className="p-8">

            <form
              onSubmit={handleSave}
              className="space-y-6"
            >

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email - Read Only */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Email cannot be changed here.
                </p>
              </div>

              {/* College */}
              <div>
                <label
                  htmlFor="college"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  College
                </label>

                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter your college"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Degree */}
              <div>
                <label
                  htmlFor="degree"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Degree
                </label>

                <input
                  id="degree"
                  name="degree"
                  type="text"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label
                  htmlFor="graduationYear"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Graduation Year
                </label>

                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={
                    formData.graduationYear
                  }
                  onChange={handleChange}
                  placeholder="e.g. 2027"
                  min="1900"
                  max="2100"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Skills */}
              <div>
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Skills
                </label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Node.js, MongoDB"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Separate skills with commas.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

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

            </form>

          </Card>
        )}

      </div>
    </MainLayout>
  );
}

export default Profile;