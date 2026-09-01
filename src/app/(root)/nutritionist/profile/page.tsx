
"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  BriefcaseBusiness,
  ShieldCheck,
  Pencil,
  Save,
  X,
  Menu,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

export default function NutritionistProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    phone: "+251 91 234 5678",
    location: "Addis Ababa, Ethiopia",
    specialization: "Clinical Nutrition",
    experience: "5 years",
    education: "BSc in Nutrition and Dietetics",
    institution: "Addis Ababa University",
    licenseNumber: "NUT-2024-00125",
    consultationPrice: "500 ETB",
    bio: "Certified nutritionist focused on helping clients build sustainable and healthy eating habits through personalized nutrition plans.",
  });

  const [formData, setFormData] = useState(profile);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEdit() {
    setFormData(profile);
    setIsEditing(true);
  }

  function handleCancel() {
    setFormData(profile);
    setIsEditing(false);
  }

  function handleSave() {
    setProfile(formData);
    setIsEditing(false);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center">
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
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
                Manage your professional information and account details.
              </p>
            </div>

            {/* Edit / Save Buttons */}
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
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-xl border border-[#2D312E]/10 bg-white px-4 py-3 font-body text-[12px] font-semibold text-[#2D312E]/60 transition hover:bg-[#FAF9F6]"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[12px] font-semibold text-white transition hover:bg-[#2D312E]"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Header */}
          <section className="mb-6 overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* Green Banner */}
            <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#2D312E] via-[#3D5A4C] to-[#4E876E]">
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#DCC48E]/15" />

              <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[#DCC48E]/10 blur-2xl" />
            </div>

            {/* Profile Information */}
            <div className="px-5 py-6 sm:px-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <UserRound size={36} />
                  </div>

                  <div>
                    <h2 className="font-display text-[23px] text-[#2D312E]">
                      {profile.fullName}
                    </h2>

                    <p className="font-body mt-1 text-[11px] text-[#2D312E]/45">
                      {profile.specialization}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <ShieldCheck
                        size={14}
                        className="text-[#3D5A4C]"
                      />

                      <span className="font-body text-[10px] font-semibold text-[#3D5A4C]">
                        Verified Nutritionist
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
              <h2 className="font-display text-[20px] text-[#2D312E]">
                Personal Information
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Your basic contact information.
              </p>
            </div>

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
                isEditing={isEditing}
                onChange={handleChange}
                type="email"
              />

              <ProfileField
                icon={<Phone size={17} />}
                label="Phone Number"
                name="phone"
                value={formData.phone}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<MapPin size={17} />}
                label="Location"
                name="location"
                value={formData.location}
                isEditing={isEditing}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Professional Details */}
          <section className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
              <h2 className="font-display text-[20px] text-[#2D312E]">
                Professional Details
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Your professional background and credentials.
              </p>
            </div>

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
              />

              <ProfileField
                icon={<GraduationCap size={17} />}
                label="Education"
                name="education"
                value={formData.education}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<GraduationCap size={17} />}
                label="Institution"
                name="institution"
                value={formData.institution}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<ShieldCheck size={17} />}
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<span className="text-[10px] font-bold">ETB</span>}
                label="Consultation Price (per session)"
                name="consultationPrice"
                value={formData.consultationPrice}
                isEditing={isEditing}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* About Me */}
          <section className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="border-b border-[#2D312E]/[0.06] px-5 py-5 sm:px-6">
              <h2 className="font-display text-[20px] text-[#2D312E]">
                About Me
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                A short introduction clients can see.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#2D312E]/10 bg-[#FAF9F6] px-4 py-3 font-body text-[12px] leading-5 text-[#2D312E] outline-none transition focus:border-[#3D5A4C]"
                />
              ) : (
                <p className="font-body text-[12px] leading-6 text-[#2D312E]/60">
                  {profile.bio}
                </p>
              )}
            </div>
          </section>

          {/* Verification Status */}
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
                  Your professional credentials have been verified. Your
                  profile is currently active and visible to clients.
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4E876E]" />

                  <span className="font-body text-[9px] font-bold text-[#3D5A4C]">
                    Verified
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

/* -------------------------------- */
/* Profile Field                    */
/* -------------------------------- */

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          className="w-full rounded-xl border border-[#2D312E]/10 bg-[#FAF9F6] px-4 py-3 font-body text-[12px] text-[#2D312E] outline-none transition focus:border-[#3D5A4C]"
        />
      ) : (
        <div className="rounded-xl bg-[#FAF9F6] px-4 py-3">
          <p className="font-body text-[12px] text-[#2D312E]/70">
            {value}
          </p>
        </div>
      )}
    </div>
  );
}

