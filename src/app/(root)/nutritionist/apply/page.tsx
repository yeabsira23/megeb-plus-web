"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  IdCard,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";

type FormData = {
  fullName: string;
  email: string;
  phone: string;

  currentRole: string;
  yearsOfExperience: string;
  specialization: string;

  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;

  credentialType: string;
  credentialNumber: string;

  insuranceProvider: string;
  policyNumber: string;
  insuranceExpiration: string;
  coverageLimit: string;

  degree: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;

  declaration: boolean;
};

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",

  currentRole: "",
  yearsOfExperience: "",
  specialization: "",

  licenseNumber: "",
  licenseState: "",
  licenseExpiration: "",

  credentialType: "",
  credentialNumber: "",

  insuranceProvider: "",
  policyNumber: "",
  insuranceExpiration: "",
  coverageLimit: "",

  degree: "",
  institution: "",
  fieldOfStudy: "",
  graduationYear: "",

  declaration: false,
};

const steps = [
  {
    number: 1,
    label: "Personal",
    icon: UserRound,
  },
  {
    number: 2,
    label: "Professional",
    icon: BriefcaseBusiness,
  },
  {
    number: 3,
    label: "Credentials",
    icon: Award,
  },
  {
    number: 4,
    label: "Submit",
    icon: ClipboardCheck,
  },
];

export default function NutritionistApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.declaration) {
      return;
    }

    // Backend API will be connected here later.
    setSubmitted(true);
  };

  if (submitted) {
    return <ApplicationSubmitted />;
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* HEADER */}
      

      <header className="border-b border-[#2D312E]/[0.07] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* Megeb+ Logo */}
          <div className="flex items-center">
            <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
              Megeb
            </span>

            <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
              +
            </span>
          </div>

          {/* Back to Login */}
          <a
            href="/auth/login"
            className="font-body inline-flex items-center gap-2 text-[13px] font-semibold text-[#2D312E]/65 transition hover:text-[#4E876E]"
          >
            <ArrowLeft size={16} />
            Back to Login
          </a>
        </div>
      </header>
      {/* HERO */}
    
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)",
        }}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(220,196,142,0.25) 0%, rgba(220,196,142,0) 70%)",
              filter: "blur(15px)",
            }}
          />

          <div className="absolute -right-28 top-10 h-[330px] w-[330px] rounded-full border border-[#DCC48E]/15" />

          <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full border border-[#CCD6C4]/10" />

          <div className="absolute right-[15%] top-[30%] grid grid-cols-4 gap-2 opacity-25">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-[#DCC48E]"
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-11 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <ShieldCheck size={15} className="text-[#DCC48E]" />

              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#CCD6C4]">
                Professional Verification
              </span>
            </div>

            <h1 className="font-display text-[34px] leading-[1.12] text-white sm:text-[42px]">
              Become a Megeb+ Nutritionist
            </h1>

            <p className="font-body mt-4 max-w-2xl text-[14px] leading-6 text-white/60 sm:text-[15px]">
              Join our network of qualified nutrition professionals. Submit
              your credentials and our team will review your application before
              you create your account.
            </p>
          </div>
        </div>
      </section>
      {/* PROGRESS*/}
      <section className="border-b border-[#2D312E]/[0.07] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5 lg:px-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const completed = currentStep > step.number;
              const active = currentStep === step.number;
              const Icon = step.icon;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">

                    {/* Step Circle */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        completed
                          ? "border-[#3D5A4C] bg-[#3D5A4C] text-white"
                          : active
                            ? "border-[#3D5A4C] bg-[#E9F0EC] text-[#3D5A4C]"
                            : "border-[#CCD6C4] bg-white text-[#2D312E]/35"
                      }`}
                    >
                      {completed ? (
                        <Check size={18} strokeWidth={2.5} />
                      ) : (
                        <Icon size={17} />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="mt-2 hidden text-center sm:block">
                      <p
                        className={`font-body text-[10px] font-bold uppercase tracking-[0.12em] ${
                          completed || active
                            ? "text-[#4E876E]"
                            : "text-[#2D312E]/35"
                        }`}
                      >
                        Step {step.number}
                      </p>

                      <p
                        className={`font-body mt-0.5 text-[12px] font-semibold ${
                          completed || active
                            ? "text-[#2D312E]"
                            : "text-[#2D312E]/35"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="mx-2 h-[2px] w-8 sm:mx-4 sm:w-16">
                      <div
                        className={`h-full transition-all duration-500 ${
                          currentStep > step.number
                            ? "bg-[#3D5A4C]"
                            : "bg-[#CCD6C4]/50"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Step Label */}
          <p className="font-body mt-3 text-center text-[11px] font-semibold text-[#2D312E]/45 sm:hidden">
            Step {currentStep} of 4 · {steps[currentStep - 1].label}
          </p>
        </div>
      </section>

    
      {/* FORM  */}

      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        <form onSubmit={handleSubmit}>

          {/* STEP 1 — PERSONAL */}
          
          {currentStep === 1 && (
            <FormSection
              number="01"
              icon={<UserRound size={20} />}
              title="Personal Information"
              description="Tell us a little about yourself."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 ..."
                  required
                />
              </div>
            </FormSection>
          )}

          {/* STEP 2 — PROFESSIONAL*/}
          {currentStep === 2 && (
            <FormSection
              number="02"
              icon={<BriefcaseBusiness size={20} />}
              title="Professional Information"
              description="Tell us about your professional background and experience."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Current Professional Role"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  placeholder="e.g. Clinical Nutritionist"
                  required
                />

                <Input
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    label="Area of Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Clinical nutrition, sports nutrition"
                    required
                  />
                </div>
              </div>
            </FormSection>
          )}

          {/* STEP 3 — CREDENTIALS  */}
  
          {currentStep === 3 && (
            <div className="space-y-6">

              <div className="mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h2 className="font-display text-[24px] text-[#2D312E]">
                      Professional Credentials
                    </h2>

                    <p className="font-body mt-1 text-[13px] text-[#2D312E]/50">
                      Provide the documents required for professional
                      verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* State License */}
              <CredentialCard
                icon={<IdCard size={20} />}
                title="State License (LDN/CD)"
                description="Legal compliance to practice. Your license must be active with no active disciplinary actions."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter license number"
                    required
                  />

                  <Input
                    label="State / Jurisdiction"
                    name="licenseState"
                    value={formData.licenseState}
                    onChange={handleChange}
                    placeholder="Enter state or jurisdiction"
                    required
                  />

                  <Input
                    label="Expiration Date"
                    name="licenseExpiration"
                    type="date"
                    value={formData.licenseExpiration}
                    onChange={handleChange}
                    required
                  />

                  <FileUpload
                    label="State License"
                    helperText="PDF, JPG or PNG · Max 10MB"
                  />
                </div>
              </CredentialCard>

              {/* National Credential */}
              <CredentialCard
                icon={<Award size={20} />}
                title="National Credential (RDN/CNS)"
                description="Core qualification verification through the appropriate credentialing organization."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectInput
                    label="Credential Type"
                    name="credentialType"
                    value={formData.credentialType}
                    onChange={handleChange}
                    required
                    options={[
                      {
                        label: "Select credential",
                        value: "",
                      },
                      {
                        label: "RDN — Registered Dietitian Nutritionist",
                        value: "RDN",
                      },
                      {
                        label: "CNS — Certified Nutrition Specialist",
                        value: "CNS",
                      },
                    ]}
                  />

                  <Input
                    label="Credential Number"
                    name="credentialNumber"
                    value={formData.credentialNumber}
                    onChange={handleChange}
                    placeholder="Enter credential number"
                    required
                  />

                  <div className="md:col-span-2">
                    <FileUpload
                      label="National Credential"
                      helperText="Verified via CDR / BCNS portal"
                    />
                  </div>
                </div>
              </CredentialCard>

              {/* Insurance */}
              <CredentialCard
                icon={<FileCheck2 size={20} />}
                title="Certificate of Insurance (COI)"
                description="Legal and financial liability coverage. Provide an active policy with adequate coverage."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Insurance Provider"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    placeholder="Enter provider name"
                    required
                  />

                  <Input
                    label="Policy Number"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    placeholder="Enter policy number"
                    required
                  />

                  <Input
                    label="Expiration Date"
                    name="insuranceExpiration"
                    type="date"
                    value={formData.insuranceExpiration}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Coverage Limit"
                    name="coverageLimit"
                    value={formData.coverageLimit}
                    onChange={handleChange}
                    placeholder="e.g. $1,000,000"
                    required
                  />

                  <div className="md:col-span-2">
                    <FileUpload
                      label="Certificate of Insurance"
                      helperText="Upload your current COI"
                    />
                  </div>
                </div>
              </CredentialCard>

              {/* Degree */}
              <CredentialCard
                icon={<GraduationCap size={20} />}
                title="Degree / Transcript"
                description="Verification of your foundational education."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. BSc Nutrition"
                    required
                  />

                  <Input
                    label="Institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="University or institution"
                    required
                  />

                  <Input
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    placeholder="e.g. Nutrition and Dietetics"
                    required
                  />

                  <Input
                    label="Graduation Year"
                    name="graduationYear"
                    type="number"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="e.g. 2022"
                    required
                  />

                  <div className="md:col-span-2">
                    <FileUpload
                      label="Degree / Transcript"
                      helperText="Upload your degree or official transcript"
                    />
                  </div>
                </div>
              </CredentialCard>
            </div>
          )}
          {/* STEP 4 — REVIEW & SUBMIT  */}
          {currentStep === 4 && (
            <div className="space-y-6">

              <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.25)]">

                <div className="border-b border-[#2D312E]/[0.06] bg-[#E9F0EC]/50 px-6 py-6 sm:px-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white">
                      <ClipboardCheck size={20} />
                    </div>

                    <div>
                      <h2 className="font-display text-[23px] text-[#2D312E]">
                        Review & Submit
                      </h2>

                      <p className="font-body mt-1 text-[13px] leading-5 text-[#2D312E]/55">
                        Review your information and confirm your application
                        before submitting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#2D312E]/[0.06]">
                  <ReviewRow
                    icon={<UserRound size={17} />}
                    title="Personal Information"
                    values={[
                      formData.fullName || "Not provided",
                      formData.email || "Not provided",
                      formData.phone || "Not provided",
                    ]}
                  />

                  <ReviewRow
                    icon={<BriefcaseBusiness size={17} />}
                    title="Professional Information"
                    values={[
                      formData.currentRole || "Not provided",
                      formData.specialization || "Not provided",
                      formData.yearsOfExperience
                        ? `${formData.yearsOfExperience} years of experience`
                        : "Not provided",
                    ]}
                  />

                  <ReviewRow
                    icon={<ShieldCheck size={17} />}
                    title="Credentials"
                    values={[
                      formData.licenseNumber
                        ? "State License provided"
                        : "State License not provided",

                      formData.credentialNumber
                        ? `${formData.credentialType} credential provided`
                        : "National credential not provided",

                      formData.insuranceProvider
                        ? "Insurance information provided"
                        : "Insurance information not provided",

                      formData.degree
                        ? `${formData.degree} · ${formData.institution}`
                        : "Degree information not provided",
                    ]}
                  />
                </div>
              </section>

              {/* Declaration */}
              <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">

                <div className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] px-6 py-5 sm:px-7">
                  <h3 className="font-display text-[19px] text-[#2D312E]">
                    Declaration
                  </h3>

                  <p className="font-body mt-1 text-[12.5px] text-[#2D312E]/50">
                    Please confirm before submitting your application.
                  </p>
                </div>

                <div className="p-6 sm:p-7">
                  <label className="flex cursor-pointer items-start gap-4">

                    <span className="relative mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        name="declaration"
                        checked={formData.declaration}
                        onChange={handleChange}
                        required
                        className="peer sr-only"
                      />

                      <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[#2D312E]/20 bg-white transition peer-checked:border-[#3D5A4C] peer-checked:bg-[#3D5A4C]">
                        <Check
                          size={13}
                          strokeWidth={3}
                          className="text-white opacity-0 transition peer-checked:opacity-100"
                        />
                      </span>
                    </span>

                    <span className="font-body text-[13px] font-medium leading-6 text-[#2D312E]/70">
                      I confirm that the information and documents I have
                      provided are accurate and current. I understand that
                      Megeb+ may verify my credentials before approving my
                      application.
                    </span>

                  </label>
                </div>
              </section>

              {/* What happens next */}
              <section className="rounded-2xl border border-[#DCC48E]/30 bg-[#DCC48E]/10 p-5 sm:p-6">
                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={20}
                    className="mt-0.5 flex-shrink-0 text-[#4E876E]"
                  />

                  <div>
                    <h3 className="font-body text-[13px] font-bold text-[#2D312E]">
                      What happens after you apply?
                    </h3>

                    <p className="font-body mt-1 text-[12.5px] leading-5 text-[#2D312E]/60">
                      Your application will be reviewed by the Megeb+ team.
                      If your credentials are approved, you will receive
                      instructions to set up your nutritionist account.
                    </p>
                  </div>

                </div>
              </section>
            </div>
          )}

          {/* BUTTONS */}
        
          <div className="mt-7 flex items-center justify-between gap-4">

            {currentStep > 1 ? (
              <button
                type="button"
                onClick={previousStep}
                className="font-body inline-flex items-center gap-2 rounded-xl border border-[#2D312E]/15 bg-white px-5 py-3 text-[13px] font-semibold text-[#2D312E]/70 transition hover:border-[#3D5A4C]/30 hover:text-[#3D5A4C]"
              >
                <ChevronLeft size={17} />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="font-body group inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4E876E] hover:shadow-md"
              >
                Continue

                <ChevronRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            ) : (
              <button
                type="submit"
                className="font-body group inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4E876E] hover:shadow-md"
              >
                Submit Application

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            )}
          </div>

          <p className="font-body mt-6 text-center text-[11px] text-[#2D312E]/35">
            Your information will be used only for professional verification
            and application review.
          </p>
        </form>
      </div>
    </main>
  );
}
/* FORM SECTION */

function FormSection({
  number,
  icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.25)]">

      <div className="border-b border-[#2D312E]/[0.06] px-6 py-6 sm:px-7">
        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">

              <span className="font-body text-[10px] font-bold tracking-[0.15em] text-[#DCC48E]">
                STEP {number}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#CCD6C4]" />

              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4E876E]">
                Required
              </span>

            </div>

            <h2 className="font-display mt-1 text-[23px] text-[#2D312E]">
              {title}
            </h2>

            <p className="font-body mt-1 text-[13px] leading-5 text-[#2D312E]/50">
              {description}
            </p>
          </div>

        </div>
      </div>

      <div className="p-6 sm:p-7">
        {children}
      </div>

    </section>
  );
}
/* CREDENTIAL CARD  */

function CredentialCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm transition hover:shadow-md">

      <div className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6]/50 px-6 py-5 sm:px-7">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              {icon}
            </div>

            <div>
              <h3 className="font-display text-[18px] text-[#2D312E]">
                {title}
              </h3>

              <p className="font-body mt-1 max-w-2xl text-[12px] leading-5 text-[#2D312E]/50">
                {description}
              </p>
            </div>

          </div>

          <span className="hidden flex-shrink-0 rounded-full bg-[#E9F0EC] px-3 py-1 font-body text-[9px] font-bold uppercase tracking-[0.1em] text-[#3D5A4C] sm:block">
            Required
          </span>

        </div>
      </div>

      <div className="p-6 sm:p-7">
        {children}
      </div>

    </section>
  );
}
/* INPUT*/

type InputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
};

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
}: InputProps) {
  return (
    <div>

      <label
        htmlFor={name}
        className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75"
      >
        {label}

        {required && (
          <span className="ml-1 text-[#4E876E]">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13.5px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 hover:border-[#2D312E]/20 focus:border-[#3D5A4C] focus:bg-white focus:ring-4 focus:ring-[#3D5A4C]/10"
      />

    </div>
  );
}
/* SELECT */

function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75"
      >
        {label}

        {required && (
          <span className="ml-1 text-[#4E876E]">
            *
          </span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13.5px] text-[#2D312E] outline-none transition hover:border-[#2D312E]/20 focus:border-[#3D5A4C] focus:bg-white focus:ring-4 focus:ring-[#3D5A4C]/10"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

    </div>
  );
}

/* FILE UPLOAD */

function FileUpload({
  label,
  helperText,
}: {
  label: string;
  helperText: string;
}) {
  return (
    <div>

      <label className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
        Upload {label}

        <span className="ml-1 text-[#4E876E]">
          *
        </span>
      </label>

      <label className="group flex min-h-[78px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#2D312E]/20 bg-[#FAF9F6]/60 px-4 py-3.5 transition hover:border-[#4E876E] hover:bg-[#E9F0EC]/40">

        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#4E876E]">
          <Upload
            size={18}
            className="transition-transform group-hover:-translate-y-0.5"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-body text-[12.5px] font-semibold text-[#2D312E]/75">
            Choose a file
          </p>

          <p className="font-body mt-0.5 truncate text-[10.5px] text-[#2D312E]/40">
            {helperText}
          </p>
        </div>

        <FileText
          size={18}
          className="flex-shrink-0 text-[#2D312E]/25"
        />

        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          required
        />

      </label>
    </div>
  );
}
/* REVIEW ROW */
function ReviewRow({
  icon,
  title,
  values,
}: {
  icon: React.ReactNode;
  title: string;
  values: string[];
}) {
  return (
    <div className="flex gap-4 px-6 py-5 sm:px-7">

      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#4E876E]">
        {icon}
      </div>

      <div className="min-w-0">

        <h3 className="font-body text-[12px] font-bold text-[#2D312E]">
          {title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {values.map((value, index) => (
            <p
              key={index}
              className="font-body text-[11.5px] text-[#2D312E]/55"
            >
              {value}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}
/* SUCCESS SCREEN  */

function ApplicationSubmitted() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-5 py-10">

      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#2D312E]/[0.07] bg-white shadow-[0_25px_60px_-20px_rgba(45,49,46,0.25)]">

        {/* Success Header */}
        <div
          className="relative overflow-hidden px-6 py-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)",
          }}
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#DCC48E]/15" />

          <div className="relative">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DCC48E]">
              <CheckCircle2
                size={42}
                strokeWidth={1.8}
                className="text-[#3D5A4C]"
              />
            </div>

            <h1 className="font-display mt-5 text-[28px] text-white">
              Application Submitted
            </h1>

            <p className="font-body mt-3 text-[13px] leading-6 text-white/60">
              Thank you for applying to become a Megeb+ nutritionist.
            </p>

          </div>
        </div>

        {/* Success Content */}
        <div className="p-7 text-center sm:p-9">

          <div className="rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-5">

            <p className="font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#4E876E]">
              Application Status
            </p>

            <p className="font-display mt-2 text-[18px] text-[#2D312E]">
              Pending Review
            </p>

            <p className="font-body mt-2 text-[12px] leading-5 text-[#2D312E]/55">
              Our team will review your credentials and contact you once a
              decision has been made.
            </p>

          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#FAF9F6] p-4 text-left">

            <FileText
              size={18}
              className="mt-0.5 flex-shrink-0 text-[#4E876E]"
            />

            <p className="font-body text-[12px] leading-5 text-[#2D312E]/55">
              If your application is approved, you will receive instructions
              to set up your Megeb+ nutritionist account.
            </p>

          </div>

          <a
            href="/auth/login"
            className="font-body mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#4E876E]"
          >
            Back to Login
            <ArrowRight size={16} />
          </a>

        </div>
      </div>
    </main>
  );
}