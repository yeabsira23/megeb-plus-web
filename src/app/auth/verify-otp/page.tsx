"use client";

import { useState, FormEvent, KeyboardEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import {
  sendEmailOtp,
  verifyEmailOtp,
} from "@/app/libs/api/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Email is passed from forgot-password page
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Make sure an email exists
  useEffect(() => {
    if (!email) {
      router.replace("/auth/forgot-password");
    }
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Automatically move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;

      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const previousInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement | null;

      previousInput?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      const previousInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement | null;

      previousInput?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;

      nextInput?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const focusIndex = Math.min(pastedValue.length, 5);

    const input = document.getElementById(
      `otp-${focusIndex}`
    ) as HTMLInputElement | null;

    input?.focus();
  };

  /**
   * Verify password-reset OTP
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    const enteredOtp = otp.join("");

    if (!email) {
      setError("Your email address is missing. Please start again.");
      return;
    }

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      await verifyEmailOtp(
        email,
        enteredOtp,
        "password_reset"
      );

      setSuccess(true);

      // Give the success state a moment to display
      setTimeout(() => {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(email)}`
        );
      }, 1000);
    } catch (err) {
      console.error("Unable to verify password reset OTP:", err);

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
            };
          };
        };

        setError(
          errorObj.response?.data?.detail ||
            errorObj.response?.data?.message ||
            "Unable to verify the code. Please try again."
        );
      } else {
        setError(
          "Unable to verify the code. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend password-reset OTP
   */
  const handleResend = async () => {
    if (!email) {
      setError("Your email address is missing. Please start again.");
      return;
    }

    setError("");
    setResending(true);

    try {
      await sendEmailOtp(
        email,
        "password_reset"
      );

      setOtp(["", "", "", "", "", ""]);

      const firstInput = document.getElementById(
        "otp-0"
      ) as HTMLInputElement | null;

      firstInput?.focus();
    } catch (err) {
      console.error("Unable to resend password reset OTP:", err);

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
            };
          };
        };

        setError(
          errorObj.response?.data?.detail ||
            errorObj.response?.data?.message ||
            "Unable to resend the code. Please try again."
        );
      } else {
        setError(
          "Unable to resend the code. Please try again."
        );
      }
    } finally {
      setResending(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <main className="min-h-screen w-full flex bg-[#FAF9F6]">

        {/* LEFT SIDE */}
        <section
          className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-12"
          style={{
            background:
              "linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)",
          }}
        >
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

            <div className="absolute top-[34%] left-[12%]">
              <div className="w-16 h-px bg-[#DCC48E]/40" />
              <div className="absolute top-0 left-0 w-px h-16 bg-[#DCC48E]/40" />
            </div>
          </div>

          {/* BRAND */}
          <div className="flex items-center">
            <span className="font-display text-[38px] font-bold tracking-tight text-[#DCC48E]">
              Megeb
            </span>

            <span className="ml-1 font-display text-[44px] font-black leading-none text-[#DCC48E]">
              +
            </span>
          </div>

          {/* LEFT TEXT */}
          <div className="relative z-10 max-w-sm">
            <div className="w-8 h-[2px] bg-[#DCC48E] mb-5" />

            <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#CCD6C4] mb-4">
              Account Verification
            </p>

            <h1 className="font-display text-white text-[42px] leading-[1.12]">
              One more step.
            </h1>

            <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
              Enter the verification code sent to your email
              to continue resetting your password.
            </p>
          </div>

          {/* SECURITY ICON */}
          <div className="absolute right-[14%] top-[45%]">
            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-[#DCC48E]/10 blur-3xl scale-150" />

              <div className="relative w-[190px] h-[190px] rounded-full border-[10px] border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center">

                <div className="w-[145px] h-[145px] rounded-full border border-white/10 flex items-center justify-center">

                  <div className="w-[90px] h-[90px] rounded-full bg-[#DCC48E]/15 border border-[#DCC48E]/30 flex items-center justify-center">

                    <ShieldCheck
                      size={46}
                      strokeWidth={1.4}
                      className="text-[#DCC48E]"
                    />

                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-2 w-11 h-11 rounded-full bg-[#DCC48E] flex items-center justify-center shadow-lg">
                <Check
                  size={20}
                  strokeWidth={2.5}
                  className="text-[#2D312E]"
                />
              </div>

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

            <div className="flex items-center md:hidden mb-6">
              <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
                Megeb
              </span>

              <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
                +
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(61,90,76,0.18)] border border-[#2D312E]/[0.06] overflow-hidden">

              <div className="h-[3px] bg-gradient-to-r from-[#3D5A4C] via-[#4E876E] to-[#DCC48E]" />

              <div className="p-9 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-[#E9F0EC] flex items-center justify-center mb-5">
                  <Check
                    size={28}
                    strokeWidth={2.2}
                    className="text-[#3D5A4C]"
                  />
                </div>

                <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
                  Verification complete
                </p>

                <h2 className="font-display text-[#2D312E] text-[26px] mb-2">
                  Verification successful
                </h2>

                <p className="font-body text-[#2D312E]/50 text-[13.5px] leading-5">
                  Your verification code has been successfully
                  verified. You can now create a new password.
                </p>

                <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-[#E9F0EC]">
                  <div className="h-full w-full animate-pulse rounded-full bg-[#3D5A4C]" />
                </div>

              </div>
            </div>

            <p className="font-body text-[12.5px] text-[#2D312E]/40 mt-6 text-center">
              Need help? Contact your system administrator.
            </p>

          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex bg-[#FAF9F6]">

      {/* LEFT SIDE */}
      <section
        className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)",
        }}
      >

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

          <div className="absolute top-[34%] left-[12%]">
            <div className="w-16 h-px bg-[#DCC48E]/40" />
            <div className="absolute top-0 left-0 w-px h-16 bg-[#DCC48E]/40" />
          </div>
        </div>

        {/* BRAND */}
        <div className="flex items-center">
          <span className="font-display text-[38px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[44px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </div>

        {/* LEFT TEXT */}
        <div className="relative z-10 max-w-sm">
          <div className="w-8 h-[2px] bg-[#DCC48E] mb-5" />

          <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#CCD6C4] mb-4">
            Account Verification
          </p>

          <h1 className="font-display text-white text-[42px] leading-[1.12]">
            One more step.
          </h1>

          <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
            Enter the verification code sent to your email
            to continue resetting your password.
          </p>
        </div>

        {/* SECURITY ICON */}
        <div className="absolute right-[14%] top-[45%]">
          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-[#DCC48E]/10 blur-3xl scale-150" />

            <div className="relative w-[190px] h-[190px] rounded-full border-[10px] border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center">

              <div className="w-[145px] h-[145px] rounded-full border border-white/10 flex items-center justify-center">

                <div className="w-[90px] h-[90px] rounded-full bg-[#DCC48E]/15 border border-[#DCC48E]/30 flex items-center justify-center">

                  <ShieldCheck
                    size={46}
                    strokeWidth={1.4}
                    className="text-[#DCC48E]"
                  />

                </div>
              </div>
            </div>

            <div className="absolute -left-4 bottom-2 w-11 h-11 rounded-full bg-[#DCC48E] flex items-center justify-center shadow-lg">
              <Check
                size={20}
                strokeWidth={2.5}
                className="text-[#2D312E]"
              />
            </div>

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
          <div className="flex items-center md:hidden mb-6">

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

              {/* HEADER */}
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
                Email Verification
              </p>

              <h2 className="font-display text-[#2D312E] text-[26px] mb-1">
                Verify your email
              </h2>

              <p className="font-body text-[#2D312E]/50 text-[13.5px] mb-7 leading-5">
                We've sent a 6-digit verification code to{" "}
                <span className="font-semibold text-[#2D312E]/70">
                  {email}
                </span>
                . Enter the code below to continue.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >

                {/* OTP LABEL */}
                <div>

                  <label
                    htmlFor="otp-0"
                    className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-2"
                  >
                    Verification Code
                  </label>

                  {/* OTP INPUTS */}
                  <div className="flex gap-2 sm:gap-3">

                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? "one-time-code"
                            : "off"
                        }
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            index,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(index, e)
                        }
                        onPaste={handlePaste}
                        aria-label={`Verification code digit ${
                          index + 1
                        }`}
                        disabled={loading}
                        className={`font-body w-full h-12 sm:h-14 rounded-xl border bg-[#FAF9F6]/60 text-center text-[18px] font-semibold text-[#2D312E] outline-none transition ${
                          error
                            ? "border-[#EB5757]/40 focus:border-[#EB5757] focus:ring-4 focus:ring-[#EB5757]/10"
                            : "border-[#2D312E]/12 focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                        }`}
                      />
                    ))}

                  </div>
                </div>

                {/* EMAIL INFORMATION */}
                <div className="rounded-xl bg-[#E9F0EC] p-4">

                  <p className="font-body text-[12.5px] leading-5 text-[#2D312E]/60">
                    Enter the verification code sent to your
                    email. The code expires after 10 minutes.
                  </p>

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
                  disabled={loading || !email}
                  className="font-body w-full flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 transition hover:bg-[#4E876E] hover:shadow-[0_8px_20px_-4px_rgba(61,90,76,0.4)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#3D5A4C]/20"
                >
                  {loading ? "Verifying…" : "Verify Code"}
                </button>

              </form>

              {/* RESEND */}
              <div className="mt-6 text-center">

                <p className="font-body text-[12.5px] text-[#2D312E]/50">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || loading || !email}
                  className="font-body mt-2 text-[12.5px] font-semibold text-[#4E876E] hover:text-[#3D5A4C] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending…" : "Resend Code"}
                </button>

              </div>

              {/* BACK TO LOGIN */}
              <div className="mt-7 pt-5 border-t border-[#2D312E]/[0.07]">

                <a
                  href="/auth/login"
                  className="font-body flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-[#4E876E] hover:text-[#3D5A4C] transition"
                >
                  <ArrowLeft size={15} />
                  Back to sign in
                </a>

              </div>

            </div>
          </div>

          {/* HELP */}
          <p className="font-body text-[12.5px] text-[#2D312E]/40 mt-6 text-center">
            Need help? Contact your system administrator.
          </p>

        </div>
      </section>
    </main>
  );
}