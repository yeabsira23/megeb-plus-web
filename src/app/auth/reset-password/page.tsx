"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
Lock,
Eye,
EyeOff,
Check,
ArrowLeft,
ShieldCheck,
} from "lucide-react";

import { resetPassword } from "@/app/libs/api/auth";

export default function ResetPasswordPage() {
return ( <Suspense fallback={null}> <ResetPasswordContent /> </Suspense>
);
}

function ResetPasswordContent() {
const router = useRouter();
const searchParams = useSearchParams();

// Email is passed from the OTP verification page.
const email = searchParams.get("email") || "";

const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

// Password validation
const passwordRequirements = {
length: password.length >= 8,
uppercase: /[A-Z]/.test(password),
lowercase: /[a-z]/.test(password),
number: /[0-9]/.test(password),
};

const isPasswordValid =
passwordRequirements.length &&
passwordRequirements.uppercase &&
passwordRequirements.lowercase &&
passwordRequirements.number;

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
e.preventDefault();


setError("");

if (!email) {
  setError(
    "Your reset session is missing an email address. Please start the password reset process again."
  );
  return;
}

if (!password || !confirmPassword) {
  setError("Please fill in both password fields.");
  return;
}

if (!isPasswordValid) {
  setError(
    "Please make sure your password meets all the requirements."
  );
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

setLoading(true);

try {
  await resetPassword(
    email,
    password,
    confirmPassword
  );

  setSuccess(true);
} catch (err) {
  console.error("Unable to reset password:", err);

  if (
    err &&
    typeof err === "object" &&
    "response" in err
  ) {
    const errorObj = err as {
      response?: {
        data?: {
          detail?: string;
          message?: string;
          confirm_new_password?: string[];
        };
      };
    };

    const backendError =
      errorObj.response?.data;

    setError(
      backendError?.detail ||
        backendError?.message ||
        backendError?.confirm_new_password?.[0] ||
        "Unable to reset your password. Please try again."
    );
  } else {
    setError(
      "Unable to reset your password. Please try again."
    );
  }
} finally {
  setLoading(false);
}


}

// Success screen
if (success) {
return ( <main className="min-h-screen w-full flex bg-[#FAF9F6]">


    {/* LEFT SIDE */}
    <section
      className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-12"
      style={{
        background:
          "linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)",
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">

        <div
          className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(220,196,142,0.38) 0%, rgba(220,196,142,0) 68%)",
            filter: "blur(20px)",
          }}
        />

        <div
          className="absolute top-[35%] -left-52 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(204,214,196,0.25) 0%, rgba(204,214,196,0) 68%)",
            filter: "blur(25px)",
          }}
        />

        <div className="absolute -right-32 top-[18%] w-[430px] h-[430px] rounded-full border border-[#DCC48E]/20" />

        <div className="absolute -right-20 top-[25%] w-[330px] h-[330px] rounded-full border border-white/10" />

        <div className="absolute -left-40 bottom-[5%] w-[380px] h-[380px] rounded-full border border-[#CCD6C4]/15" />

        <div className="absolute top-[18%] right-[18%] grid grid-cols-4 gap-2 opacity-40">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-[#DCC48E]"
            />
          ))}
        </div>

        <div className="absolute top-[34%] left-[12%] w-16 h-px bg-[#DCC48E]/40" />

        <div className="absolute top-[34%] left-[12%] w-px h-16 bg-[#DCC48E]/40" />
      </div>

      {/* BRAND */}
      <div className="flex items-center relative z-10">
        <span className="font-display text-[38px] font-bold tracking-tight text-[#DCC48E]">
          Megeb
        </span>

        <span className="ml-1 font-display text-[44px] font-black leading-none text-[#DCC48E]">
          +
        </span>
      </div>

      {/* TEXT */}
      <div className="relative z-10 max-w-sm">
        <div className="w-8 h-[2px] bg-[#DCC48E] mb-5" />

        <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#CCD6C4] mb-4">
          Account Security
        </p>

        <h1 className="font-display text-white text-[42px] leading-[1.12]">
          Your account is secure.
        </h1>

        <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
          Your password has been updated successfully.
          You can now sign in with your new password.
        </p>
      </div>

      {/* SECURITY DECORATION */}
      <div className="absolute right-[8%] top-[43%] w-[230px] h-[230px]">

        <div className="absolute inset-0 rounded-full bg-[#DCC48E]/10 blur-3xl" />

        <div className="absolute inset-[5px] rounded-full border-[10px] border-white/20 bg-white/[0.07] backdrop-blur-sm">

          <div className="absolute inset-3 rounded-full border border-white/10" />

          <div className="absolute top-8 left-10 w-14 h-8 rounded-[100%_0] bg-[#CCD6C4]/80 rotate-[25deg]" />

          <div className="absolute top-12 left-[85px] w-12 h-7 rounded-[0_100%] bg-[#4E876E]/80 rotate-[-15deg]" />

          <div className="absolute top-[70px] right-9 w-12 h-7 rounded-[100%_0] bg-[#CCD6C4]/70 rotate-[65deg]" />

          <div className="absolute top-[88px] left-[75px] w-10 h-10 rounded-full bg-[#DCC48E]/80" />

          <div className="absolute left-[55px] bottom-10 w-[100px] h-[50px] rounded-b-[60px] bg-white/10 border-b-2 border-[#DCC48E]/50" />

          <div className="absolute bottom-[60px] left-[70px] w-4 h-4 rounded-full bg-[#4E876E]" />

          <div className="absolute bottom-[73px] left-[94px] w-3 h-3 rounded-full bg-[#DCC48E]" />

          <div className="absolute bottom-[58px] left-[115px] w-5 h-5 rounded-full bg-[#CCD6C4]" />

        </div>

        <div className="absolute -right-12 top-4 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">

          <p className="font-body text-[9px] uppercase tracking-[0.18em] text-[#CCD6C4]">
            Protected
          </p>

          <p className="font-display text-sm text-white mt-0.5">
            Account
          </p>

        </div>

        <div className="absolute -left-3 bottom-2 w-11 h-11 rounded-full bg-[#DCC48E] flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-5 h-5 text-[#2D312E]" />
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="relative z-10 font-body text-white/35 text-xs">
        © {new Date().getFullYear()} Megeb+
      </div>
    </section>

    {/* RIGHT SIDE */}
    <section className="flex-1 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-[400px]">

        {/* MOBILE LOGO */}
        <div className="flex items-center md:hidden mb-8">

          <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
            +
          </span>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(61,90,76,0.18)] border border-[#2D312E]/[0.06] overflow-hidden">

          <div className="h-[3px] bg-gradient-to-r from-[#3D5A4C] via-[#4E876E] to-[#DCC48E]" />

          <div className="p-9">

            <div className="w-12 h-12 rounded-full bg-[#E9F0EC] flex items-center justify-center mb-5">
              <Check
                size={24}
                strokeWidth={2.2}
                className="text-[#3D5A4C]"
              />
            </div>

            <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
              Password Updated
            </p>

            <h2 className="font-display text-[#2D312E] text-[26px] mb-2">
              Password reset successful
            </h2>

            <p className="font-body text-[#2D312E]/50 text-[13.5px] leading-5">
              Your password has been changed successfully.
              You can now sign in using your new password.
            </p>

            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="font-body w-full mt-7 flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 transition hover:bg-[#4E876E] hover:shadow-[0_8px_20px_-4px_rgba(61,90,76,0.4)]"
            >
              Continue to sign in
            </button>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 pt-5 border-t border-[#2D312E]/[0.07] text-center">

          <p className="font-body text-[12.5px] text-[#2D312E]/50">
            © {new Date().getFullYear()} Megeb+. All rights reserved.
          </p>

        </div>

      </div>
    </section>
  </main>
);


}

return ( <main className="min-h-screen w-full flex bg-[#FAF9F6]">


  {/* LEFT SIDE */}
  <section
    className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-12"
    style={{
      background:
        "linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)",
    }}
  >

    {/* Decorative background */}
    <div className="absolute inset-0 pointer-events-none">

      <div
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(220,196,142,0.38) 0%, rgba(220,196,142,0) 68%)",
          filter: "blur(20px)",
        }}
      />

      <div
        className="absolute top-[35%] -left-52 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(204,214,196,0.25) 0%, rgba(204,214,196,0) 68%)",
          filter: "blur(25px)",
        }}
      />

      <div className="absolute -right-32 top-[18%] w-[430px] h-[430px] rounded-full border border-[#DCC48E]/20" />

      <div className="absolute -right-20 top-[25%] w-[330px] h-[330px] rounded-full border border-white/10" />

      <div className="absolute -left-40 bottom-[5%] w-[380px] h-[380px] rounded-full border border-[#CCD6C4]/15" />

      <div className="absolute top-[18%] right-[18%] grid grid-cols-4 gap-2 opacity-40">

        {Array.from({ length: 16 }).map((_, index) => (
          <span
            key={index}
            className="w-1.5 h-1.5 rounded-full bg-[#DCC48E]"
          />
        ))}

      </div>

      <div className="absolute top-[34%] left-[12%] w-16 h-px bg-[#DCC48E]/40" />

      <div className="absolute top-[34%] left-[12%] w-px h-16 bg-[#DCC48E]/40" />

    </div>

    {/* BRAND */}
    <div className="flex items-center relative z-10">

      <span className="font-display text-[38px] font-bold tracking-tight text-[#DCC48E]">
        Megeb
      </span>

      <span className="ml-1 font-display text-[44px] font-black leading-none text-[#DCC48E]">
        +
      </span>

    </div>

    {/* TEXT */}
    <div className="relative z-10 max-w-sm">

      <div className="w-8 h-[2px] bg-[#DCC48E] mb-5" />

      <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#CCD6C4] mb-4">
        Account Security
      </p>

      <h1 className="font-display text-white text-[42px] leading-[1.12]">
        Create a new password.
      </h1>

      <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
        Keep your Megeb+ account secure with a strong
        and memorable password.
      </p>

    </div>

    {/* SECURITY DECORATION */}
    <div className="absolute right-[8%] top-[43%] w-[230px] h-[230px]">

      <div className="absolute inset-0 rounded-full bg-[#DCC48E]/10 blur-3xl" />

      <div className="absolute inset-[5px] rounded-full border-[10px] border-white/20 bg-white/[0.07] backdrop-blur-sm">

        <div className="absolute inset-3 rounded-full border border-white/10" />

        <div className="absolute top-8 left-10 w-14 h-8 rounded-[100%_0] bg-[#CCD6C4]/80 rotate-[25deg]" />

        <div className="absolute top-12 left-[85px] w-12 h-7 rounded-[0_100%] bg-[#4E876E]/80 rotate-[-15deg]" />

        <div className="absolute top-[70px] right-9 w-12 h-7 rounded-[100%_0] bg-[#CCD6C4]/70 rotate-[65deg]" />

        <div className="absolute top-[88px] left-[75px] w-10 h-10 rounded-full bg-[#DCC48E]/80" />

        <div className="absolute left-[55px] bottom-10 w-[100px] h-[50px] rounded-b-[60px] bg-white/10 border-b-2 border-[#DCC48E]/50" />

        <div className="absolute bottom-[60px] left-[70px] w-4 h-4 rounded-full bg-[#4E876E]" />

        <div className="absolute bottom-[73px] left-[94px] w-3 h-3 rounded-full bg-[#DCC48E]" />

        <div className="absolute bottom-[58px] left-[115px] w-5 h-5 rounded-full bg-[#CCD6C4]" />

      </div>

      <div className="absolute -right-12 top-4 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">

        <p className="font-body text-[9px] uppercase tracking-[0.18em] text-[#CCD6C4]">
          Secure
        </p>

        <p className="font-display text-sm text-white mt-0.5">
          Account
        </p>

      </div>

      <div className="absolute -left-3 bottom-2 w-11 h-11 rounded-full bg-[#DCC48E] flex items-center justify-center shadow-lg">
        <ShieldCheck className="w-5 h-5 text-[#2D312E]" />
      </div>

    </div>

    {/* COPYRIGHT */}
    <div className="relative z-10 font-body text-white/35 text-xs">
      © {new Date().getFullYear()} Megeb+
    </div>

  </section>

  {/* RIGHT SIDE */}
  <section className="flex-1 flex items-center justify-center px-6 py-12">

    <div className="w-full max-w-[400px]">

      {/* MOBILE LOGO */}
      <div className="flex items-center md:hidden mb-8">

        <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
          Megeb
        </span>

        <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
          +
        </span>

      </div>

      {/* BACK TO LOGIN */}
      <button
        type="button"
        onClick={() => router.push("/auth/login")}
        className="font-body mb-5 flex items-center gap-2 text-[12.5px] font-medium text-[#4E876E] transition hover:text-[#3D5A4C]"
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>

      {/* RESET CARD */}
      <div className="bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(61,90,76,0.18)] border border-[#2D312E]/[0.06] overflow-hidden">

        <div className="h-[3px] bg-gradient-to-r from-[#3D5A4C] via-[#4E876E] to-[#DCC48E]" />

        <div className="p-9">

          {/* HEADER ICON */}
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F4F1]">

            <ShieldCheck
              size={21}
              strokeWidth={2}
              className="text-[#4E876E]"
            />

          </div>

          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
            Account Security
          </p>

          <h2 className="font-display text-[#2D312E] text-[26px] mb-1">
            Reset password
          </h2>

          <p className="font-body text-[#2D312E]/50 text-[13.5px] mb-7">
            Create a new password for your Megeb+ account.
          </p>

          {/* EMAIL INFO */}
          {email && (
            <div className="mb-5 rounded-xl bg-[#FAF9F6]/70 border border-[#2D312E]/[0.05] px-4 py-3">

              <p className="font-body text-[11px] text-[#2D312E]/45 mb-1">
                Resetting password for
              </p>

              <p className="font-body text-[13px] font-semibold text-[#2D312E]/75 break-all">
                {email}
              </p>

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NEW PASSWORD */}
            <div>

              <label
                htmlFor="password"
                className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-1.5"
              >
                New password
              </label>

              <div className="relative">

                <Lock
                  size={17}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-11 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                  style={{
                    paddingTop: "11px",
                    paddingBottom: "11px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* PASSWORD REQUIREMENTS */}
            <div className="rounded-xl bg-[#FAF9F6]/70 border border-[#2D312E]/[0.05] p-4">

              <p className="font-body mb-3 text-[11.5px] font-semibold text-[#2D312E]/75">
                Password must contain:
              </p>

              <div className="grid grid-cols-1 gap-2">

                <Requirement
                  valid={passwordRequirements.length}
                  text="At least 8 characters"
                />

                <Requirement
                  valid={passwordRequirements.uppercase}
                  text="At least one uppercase letter"
                />

                <Requirement
                  valid={passwordRequirements.lowercase}
                  text="At least one lowercase letter"
                />

                <Requirement
                  valid={passwordRequirements.number}
                  text="At least one number"
                />

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-1.5"
              >
                Confirm new password
              </label>

              <div className="relative">

                <Lock
                  size={17}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-11 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                  style={{
                    paddingTop: "11px",
                    paddingBottom: "11px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              {/* PASSWORD MISMATCH */}
              {confirmPassword &&
                password !== confirmPassword && (
                  <p className="font-body mt-2 text-[12px] text-[#EB5757]">
                    Passwords do not match.
                  </p>
                )}

              {/* PASSWORD MATCH */}
              {confirmPassword &&
                password === confirmPassword &&
                isPasswordValid && (
                  <p className="font-body mt-2 flex items-center gap-1 text-[12px] text-[#4E876E]">
                    <Check size={14} />
                    Passwords match.
                  </p>
                )}

            </div>

            {/* ERROR */}
            {error && (
              <p
                role="alert"
                className="font-body text-[13px] text-[#EB5757] bg-[#EB5757]/8 border border-[#EB5757]/20 rounded-lg px-3 py-2"
              >
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="font-body w-full flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 mt-1 transition hover:bg-[#4E876E] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Resetting…"
                : "Reset password"}
            </button>

          </form>

        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 pt-5 border-t border-[#2D312E]/[0.07] text-center">

        <p className="font-body text-[12.5px] text-[#2D312E]/50">
          © {new Date().getFullYear()} Megeb+. All rights reserved.
        </p>

      </div>

    </div>
  </section>
</main>


);
}

function Requirement({
valid,
text,
}: {
valid: boolean;
text: string;
}) {
return ( <div className="flex items-center gap-2">


  <div
    className={`flex h-4 w-4 items-center justify-center rounded-full ${
      valid
        ? "bg-[#E6F4F1]"
        : "bg-[#2D312E]/10"
    }`}
  >
    <Check
      className={`h-2.5 w-2.5 ${
        valid
          ? "text-[#4E876E]"
          : "text-[#2D312E]/30"
      }`}
    />
  </div>

  <span
    className={`font-body text-xs ${
      valid
        ? "text-[#4E876E]"
        : "text-[#2D312E]/50"
    }`}
  >
    {text}
  </span>

</div>


);
}
