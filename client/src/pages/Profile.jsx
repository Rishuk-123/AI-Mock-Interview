import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  CalendarDays,
  Building2,
  GraduationCap,
  Code2,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

function Profile() {
  const user = useAuthStore((state) => state.user);

  const fullName = user?.fullName || "john";
  const email = user?.email || "john123@gmail.com";

  const initial =
    fullName?.charAt(0)?.toUpperCase() || "U";

  const skills = [
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "C++",
    "NODE.JS",
    "REACT",
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">

        {/* ================= PAGE ================= */}
        <div className="w-full px-5 py-6 sm:px-7 lg:px-8">

          {/* ================= HEADER ================= */}
          <div className="mb-5 flex items-end justify-between">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Profile
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your personal, academic and technical information.
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <span className="text-base">✎</span>
              Edit Profile
            </button>

          </div>


          {/* ==================================================
              MAIN PROFILE BOX

              IMPORTANT:
              This is the ONLY outer box.
              It has margin on BOTH sides.
          ================================================== */}
          <div
            className="
              w-full
              overflow-hidden
              rounded-[22px]
              border
              border-slate-200
              bg-white
            "
          >

            {/* ================= PROFILE HEADER ================= */}

            <div className="flex min-h-[125px] items-center justify-between px-7 py-5">

              {/* Left */}
              <div className="flex items-center gap-5">

                <div
                  className="
                    flex
                    h-[82px]
                    w-[82px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-50
                    text-3xl
                    font-semibold
                    text-blue-600
                  "
                >
                  {initial}
                </div>

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Candidate
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={17} />
                    <span>{email}</span>
                  </div>

                </div>

              </div>


              {/* Right */}
              <div className="text-right">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account Status
                </p>

                <div className="mt-2 flex items-center justify-end gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm font-semibold text-emerald-600">
                    Account Active
                  </span>

                </div>

              </div>

            </div>


            {/* ================= DIVIDER ================= */}

            <div className="h-px bg-slate-200" />


            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <section className="px-7 py-6">

              <SectionTitle
                title="Personal Information"
                description="Your basic account information."
              />


              <div className="mt-6 grid grid-cols-1 gap-x-20 gap-y-7 md:grid-cols-2">

                <Info
                  icon={User}
                  label="Full Name"
                  value={fullName}
                />

                <Info
                  icon={Mail}
                  label="Email Address"
                  value={email}
                />

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

                    <p className="label">
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
                  value="11/8/2026"
                />

              </div>

            </section>


            {/* ================= DIVIDER ================= */}

            <div className="h-px bg-slate-200" />


            {/* ==================================================
                EDUCATION
            ================================================== */}

            <section className="px-7 py-6">

              <SectionTitle
                title="Education"
                description="Your academic background."
              />


              <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-3">

                <Info
                  icon={Building2}
                  label="College"
                  value="NIT JALANDHAR"
                />

                <Info
                  icon={GraduationCap}
                  label="Degree"
                  value="Btech"
                />

                <Info
                  icon={CalendarDays}
                  label="Graduation Year"
                  value="2028"
                />

              </div>

            </section>


            {/* ================= DIVIDER ================= */}

            <div className="h-px bg-slate-200" />


            {/* ==================================================
                TECHNICAL SKILLS
            ================================================== */}

            <section className="px-7 py-6">

              <div className="flex items-center gap-4">

                <Icon>
                  <Code2 size={19} />
                </Icon>

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
                    className="
                      rounded-md
                      border
                      border-blue-100
                      bg-blue-50
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-blue-600
                    "
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </section>


            {/* ================= DIVIDER ================= */}

            <div className="h-px bg-slate-200" />


            {/* ==================================================
                ADDITIONAL INFORMATION
            ================================================== */}

            <section className="px-7 py-6">

              <SectionTitle
                title="Additional Information"
                description="Other information in your profile."
              />


              <div className="mt-6 grid grid-cols-1 gap-x-20 gap-y-7 md:grid-cols-2">

                <Info
                  icon={User}
                  label="Gender"
                  value="Male"
                />

                <Info
                  icon={User}
                  label="Experience"
                  value="Fresher"
                />

                <Info
                  icon={Building2}
                  label="Department"
                  value="Information Technology"
                />

                <Info
                  icon={CalendarDays}
                  label="Profile Status"
                  value="Active"
                />

              </div>

            </section>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}


/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({ title, description }) {
  return (
    <div>

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* ============================================================
   INFORMATION ITEM
============================================================ */

function Info({ icon: IconComponent, label, value }) {
  return (
    <div className="flex items-start gap-4">

      <Icon>
        <IconComponent size={18} />
      </Icon>

      <div className="min-w-0">

        <p className="label">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   ICON BOX
============================================================ */

function Icon({ children }) {
  return (
    <div
      className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-slate-50
        text-slate-500
      "
    >
      {children}
    </div>
  );
}


export default Profile;