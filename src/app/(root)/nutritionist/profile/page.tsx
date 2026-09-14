"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Award,
  GraduationCap,
  BriefcaseBusiness,
  ShieldCheck,
  Pencil,
  Save,
  X,
  Menu,
  ArrowLeft,
  Star,
  BadgeCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

import {
  getNutritionistProfile,
  updateNutritionistProfile,
  type NutritionistProfileResponse,
} from "@/app/libs/api/client";

/* =========================================================
   FRONTEND PROFILE TYPE
========================================================= */

type NutritionistProfile = {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  bio: string;
  specialization: string;
  qualification: string;
  experience: string;
  licenseNumber: string;
  profilePicture: string | null;
  isVerified: boolean;
  rating: string;
  consultationPrice: string;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   MAP BACKEND → FRONTEND
========================================================= */

function mapProfile(
  data: NutritionistProfileResponse
): NutritionistProfile {
  return {
    id: data.id,
    userId: data.user,
    fullName: data.full_name,
    email: data.email,
    bio: data.bio || "",
    specialization: data.specialization || "",
    qualification: data.qualification || "",
    experience: String(data.years_of_experience ?? 0),
    licenseNumber: data.license_number || "",
    profilePicture: data.profile_picture,
    isVerified: data.is_verified,
    rating: data.rating || "0.00",
    consultationPrice: data.consultation_fee || "0.00",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function NutritionistProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] =
    useState<NutritionistProfile | null>(null);

  const [formData, setFormData] =
    useState<NutritionistProfile | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(
    null
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const data = await getNutritionistProfile();

        const mappedProfile = mapProfile(data);

        setProfile(mappedProfile);
        setFormData(mappedProfile);
      } catch (err: unknown) {
        console.error(
          "Failed to load nutritionist profile:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    if (!formData) return;

    const { name, value } = e.target;

    setFormData((current) =>
      current
        ? {
            ...current,
            [name]: value,
          }
        : current
    );
  }

  /* =========================================================
     EDIT
  ========================================================= */

  function handleEdit() {
    if (!profile) return;

    setFormData({ ...profile });
    setIsEditing(true);
    setSaveMessage(null);
    setSaveSuccess(false);
  }

  /* =========================================================
     CANCEL
  ========================================================= */

  function handleCancel() {
    if (!profile) return;

    setFormData({ ...profile });
    setIsEditing(false);
    setSaveMessage(null);
    setSaveSuccess(false);
  }

  /* =========================================================
     SAVE - FIXED
  ========================================================= */

async function handleSave() {
  if (!formData) return;

  try {
    setSaving(true);
    setSaveMessage(null);
    setSaveSuccess(false); // Reset success state
    setError(null);

    const yearsOfExperience = parseInt(
      formData.experience.replace(/\D/g, ""),
      10
    );

    if (isNaN(yearsOfExperience)) {
      throw new Error("Please enter a valid number of years of experience.");
    }

    const updatedProfile = await updateNutritionistProfile({
      full_name: formData.fullName.trim(),
      bio: formData.bio.trim(),
      specialization: formData.specialization.trim(),
      qualification: formData.qualification.trim(),
      years_of_experience: yearsOfExperience,
      consultation_fee: formData.consultationPrice.trim(),
    });

    const mappedProfile = mapProfile(updatedProfile);

    setProfile(mappedProfile);
    setFormData(mappedProfile);
    setIsEditing(false);

    // Set success message and success state to true
    setSaveMessage("Your profile has been updated successfully.");
    setSaveSuccess(true); // <-- THIS IS THE FIX
  } catch (err) {
    console.error("Failed to update nutritionist profile:", err);

    setSaveMessage(
      err instanceof Error
        ? err.message
        : "Unable to update your profile."
    );
    setSaveSuccess(false); // Ensure error state is false
  } finally {
    setSaving(false);
  }
}

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F0EC]">
                <Loader2
                  size={22}
                  className="animate-spin text-[#3D5A4C]"
                />
              </div>

              <h2 className="font-display mt-4 text-[20px] text-[#2D312E]">
                Loading your profile
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/45">
                Getting your professional information...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !profile || !formData) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
            <Link
              href="/nutritionist/dashboard"
              className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>

            <div className="rounded-2xl border border-red-200 bg-white p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <AlertCircle size={20} />
                </div>

                <div>
                  <h2 className="font-display text-[20px] text-[#2D312E]">
                    Unable to load profile
                  </h2>

                  <p className="font-body mt-2 text-[12px] leading-5 text-[#2D312E]/60">
                    {error ||
                      "Something went wrong while loading your profile."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}

      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <Link
          href="/nutritionist/dashboard"
          className="flex items-center"
        >
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Back */}

          <Link
            href="/nutritionist/dashboard"
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          {/* Page Header */}

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[#4E876E]">
                Account
              </p>

              <h1 className="font-display mt-1 text-[28px] text-[#2D312E]">
                My Profile
              </h1>

              <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
                Manage your professional information and account
                details.
              </p>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-fit items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[12px] font-semibold text-white transition hover:bg-[#2D312E]"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl border border-[#2D312E]/10 bg-white px-4 py-3 font-body text-[12px] font-semibold text-[#2D312E]/60 transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[12px] font-semibold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Save Message - Fixed */}
          {saveMessage && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 ${
                saveSuccess
                  ? "border-[#4E876E]/20 bg-[#E9F0EC]"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {saveSuccess ? (
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-[#4E876E]"
                />
              ) : (
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-500"
                />
              )}

              <p
                className={`font-body text-[11px] leading-5 ${
                  saveSuccess
                    ? "text-[#3D5A4C]"
                    : "text-red-600"
                }`}
              >
                {saveMessage}
              </p>
            </div>
          )}

          {/* Profile Hero */}

          <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#2D312E] via-[#3D5A4C] to-[#4E876E]">
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#DCC48E]/15" />

              <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[#DCC48E]/10 blur-2xl" />
            </div>

            <div className="px-5 py-6 sm:px-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={profile.fullName}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0EC] text-[#3D5A4C]">
                      <UserRound size={36} />
                    </div>
                  )}

                  <div>
                    <h2 className="font-display text-[23px] text-[#2D312E]">
                      {profile.fullName}
                    </h2>

                    <p className="font-body mt-1 text-[11px] text-[#2D312E]/45">
                      {profile.specialization}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {profile.isVerified && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck
                            size={14}
                            className="text-[#3D5A4C]"
                          />

                          <span className="font-body text-[10px] font-semibold text-[#3D5A4C]">
                            Verified Nutritionist
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Star
                          size={13}
                          className="fill-[#DCC48E] text-[#DCC48E]"
                        />

                        <span className="font-body text-[10px] font-semibold text-[#2D312E]/60">
                          {profile.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FAF9F6] px-4 py-3">
                  <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                    Profile ID
                  </p>

                  <p className="font-body mt-1 text-[12px] font-semibold text-[#3D5A4C]">
                    #{profile.id}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information */}

          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <SectionHeader
              title="Personal Information"
              description="Your basic account information."
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <ProfileField
                icon={<UserRound size={17} />}
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<Mail size={17} />}
                label="Email Address"
                name="email"
                value={formData.email}
                isEditing={false}
                onChange={handleChange}
                type="email"
              />
            </div>
          </section>

          {/* Professional Details */}

          <section className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <SectionHeader
              title="Professional Details"
              description="Your professional background and credentials."
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <ProfileField
                icon={<Award size={17} />}
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<BriefcaseBusiness size={17} />}
                label="Years of Experience"
                name="experience"
                value={formData.experience}
                isEditing={isEditing}
                onChange={handleChange}
                type="number"
              />

              <ProfileField
                icon={<GraduationCap size={17} />}
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<ShieldCheck size={17} />}
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                isEditing={false}
                onChange={handleChange}
              />

            <ProfileField
              icon={
                <span className="text-[10px] font-bold">
                  ETB
                </span>
              }
              label="Consultation Price (per session)"
              name="consultationPrice"
              value={formData.consultationPrice}
              isEditing={isEditing}
              onChange={handleChange}
              type="number"
            />

              {/* Verification */}

              <div>
                <label className="mb-2 flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
                  <span className="text-[#4E876E]">
                    <BadgeCheck size={17} />
                  </span>

                  Verification Status
                </label>

                <div className="rounded-xl bg-[#FAF9F6] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        profile.isVerified
                          ? "bg-[#4E876E]"
                          : "bg-[#DCC48E]"
                      }`}
                    />

                    <p className="font-body text-[12px] font-semibold text-[#2D312E]/70">
                      {profile.isVerified
                        ? "Verified"
                        : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Overview */}

          <section className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <SectionHeader
              title="Professional Overview"
              description="Your current professional account metrics."
            />

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-xl bg-[#FAF9F6] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCC48E]/20 text-[#4E876E]">
                    <Star
                      size={18}
                      className="fill-[#DCC48E]"
                    />
                  </div>

                  <div>
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                      Rating
                    </p>

                    <p className="font-display mt-1 text-[20px] text-[#2D312E]">
                      {profile.rating}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#FAF9F6] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div>
                    <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/35">
                      Consultation Fee
                    </p>

                    <p className="font-display mt-1 text-[20px] text-[#2D312E]">
                      {profile.consultationPrice} ETB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Me */}

          <section className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <SectionHeader
              title="About Me"
              description="A short introduction clients can see."
            />

            <div className="p-5 sm:p-6">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell clients a little about yourself..."
                  className="w-full resize-none rounded-xl border border-[#2D312E]/10 bg-[#FAF9F6] px-4 py-3 font-body text-[12px] leading-5 text-[#2D312E] outline-none transition focus:border-[#3D5A4C]"
                />
              ) : (
                <p className="font-body text-[12px] leading-6 text-[#2D312E]/60">
                  {profile.bio ||
                    "No professional biography has been added yet."}
                </p>
              )}
            </div>
          </section>

          {/* Verification */}

          <section className="mt-6 rounded-2xl border border-[#DCC48E]/30 bg-[#DCC48E]/10 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCC48E]/30 text-[#4E876E]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3 className="font-body text-[12px] font-bold text-[#2D312E]">
                  Professional Verification
                </h3>

                <p className="font-body mt-1 text-[11px] leading-5 text-[#2D312E]/55">
                  {profile.isVerified
                    ? "Your professional credentials have been verified. Your profile is currently active and visible to clients."
                    : "Your professional credentials have not yet been verified."}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      profile.isVerified
                        ? "bg-[#4E876E]"
                        : "bg-[#DCC48E]"
                    }`}
                  />

                  <span className="font-body text-[9px] font-bold text-[#3D5A4C]">
                    {profile.isVerified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
      <h2 className="font-display text-[20px] text-[#2D312E]">
        {title}
      </h2>

      <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  icon,
  label,
  name,
  value,
  isEditing,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40">
        <span className="text-[#4E876E]">{icon}</span>

        {label}
      </label>

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={
            type === "number"
              ? "0"
              : undefined
          }
          step={
            type === "number"
              ? "0.01"
              : undefined
          }
          className="w-full rounded-xl border border-[#2D312E]/10 bg-[#FAF9F6] px-4 py-3 font-body text-[12px] text-[#2D312E] outline-none transition focus:border-[#3D5A4C]"
        />
      ) : (
        <div className="rounded-xl bg-[#FAF9F6] px-4 py-3">
          <p className="font-body text-[12px] text-[#2D312E]/70">
            {value || "Not provided"}
          </p>
        </div>
      )}
    </div>
  );
}