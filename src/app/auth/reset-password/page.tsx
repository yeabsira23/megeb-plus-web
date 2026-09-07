
'use client';

import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Check, ArrowLeft, LockKeyhole } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/app/libs/api/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
    setError('');

    if (!password) {
      setError('Enter your new password.');
      return;
    }

    if (!isPasswordValid) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
      );
      return;
    }

    if (!confirmPassword) {
      setError('Confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!email) {
      setError(
        'Your reset session is missing the email address. Please start the password reset process again.'
      );
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email,
        otp,
        new_password: password,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Unable to reset password:', err);

      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as {
          response?: {
            data?: {
              detail?: string;
              message?: string;
              error?: string;
            };
          };
        };

        setError(
          errorObj.response?.data?.detail ||
            errorObj.response?.data?.message ||
            errorObj.response?.data?.error ||
            'Unable to reset your password. Please try again.'
        );
      } else {
        setError(
          'Unable to reset your password. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    router.push('/auth/login');
  }

  return (
    <main className="min-h-screen w-full flex bg-[#FAF9F6]">

      {/* LEFT SIDE */}
      <section
        className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            'linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)',
        }}
      >

        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">

          {/* Gold glow */}
          <div
            className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(220,196,142,0.38) 0%, rgba(220,196,142,0) 68%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Green glow */}
          <div
            className="absolute top-[35%] -left-52 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(204,214,196,0.25) 0%, rgba(204,214,196,0) 68%)',
              filter: 'blur(25px)',
            }}
          />

          {/* Decorative rings */}
          <div className="absolute -right-32 top-[18%] w-[430px] h-[430px] rounded-full border border-[#DCC48E]/20" />

          <div className="absolute -right-20 top-[25%] w-[330px] h-[330px] rounded-full border border-white/10" />

          <div className="absolute -left-40 bottom-[5%] w-[380px] h-[380px] rounded-full border border-[#CCD6C4]/15" />

          {/* Gold dots */}
          <div className="absolute top-[18%] right-[18%] grid grid-cols-4 gap-2 opacity-40">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="w-1.5 h-1.5 rounded-full rounded-full bg-[#DCC48E]"
              />
            ))}
          </div>

          {/* Decorative cross */}
          <div className="absolute top-[34%] left-[12%]">
            <div className="w-16 h-px bg-[#DCC48E]/40" />
            <div className="absolute top-0 left-0 w-px h-16 bg-[#DCC48E]/40" />
          </div>
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

        {/* LEFT TEXT */}
        <div className="relative z-10 max-w-sm">

          <div className="w-8 h-[2px] bg-[#DCC48E] mb-5" />

          <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#CCD6C4] mb-4">
            Secure Your Account
          </p>

          <h1 className="font-display text-white text-[42px] leading-[1.12]">
            Create a new password.
          </h1>

          <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
            Choose a strong password to keep your Megeb+ account secure.
          </p>

        </div>

        {/* SECURITY ICON */}
        <div className="absolute right-[14%] top-[45%]">

          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-[#DCC48E]/10 blur-3xl scale-150" />

            <div className="relative w-[190px] h-[190px] rounded-full border-[10px] border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center">

              <div className="w-[145px] h-[145px] rounded-full border border-white/10 flex items-center justify-center">

                <div className="w-[90px] h-[90px] rounded-full bg-[#DCC48E]/15 border border-[#DCC48E]/30 flex items-center justify-center">

                  <LockKeyhole
                    size={42}
                    strokeWidth={1.4}
                    className="text-[#DCC48E]"
                  />

                </div>

              </div>

            </div>

            {/* Gold badge */}
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

            {/* TOP ACCENT */}
            <div className="h-[3px] bg-gradient-to-r from-[#3D5A4C] via-[#4E876E] to-[#DCC48E]" />

            <div className="p-9">

              {!submitted ? (
                <>
                  {/* HEADER */}
                  <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
                    Password Recovery
                  </p>

                  <h2 className="font-display text-[#2D312E] text-[26px] mb-1">
                    Create new password
                  </h2>

                  <p className="font-body text-[#2D312E]/50 text-[13.5px] mb-7 leading-5">
                    Create a new password for your account. Make sure it is
                    strong and easy for you to remember.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
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

                        <LockKeyhole
                          size={17}
                          strokeWidth={2}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                        />

                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your new password"
                          className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-11 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                          style={{
                            paddingTop: '11px',
                            paddingBottom: '11px',
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2D312E]/35 hover:text-[#3D5A4C] transition"
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
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
                    <div className="rounded-xl bg-[#FAF9F6] border border-[#2D312E]/[0.06] p-3">

                      <p className="font-body text-[11.5px] font-semibold text-[#2D312E]/60 mb-2">
                        Password must contain:
                      </p>

                      <div className="grid grid-cols-2 gap-y-1.5">

                        <Requirement
                          valid={passwordRequirements.length}
                          text="8+ characters"
                        />

                        <Requirement
                          valid={passwordRequirements.uppercase}
                          text="Uppercase letter"
                        />

                        <Requirement
                          valid={passwordRequirements.lowercase}
                          text="Lowercase letter"
                        />

                        <Requirement
                          valid={passwordRequirements.number}
                          text="One number"
                        />

                      </div>

                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>

                      <label
                        htmlFor="confirmPassword"
                        className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-1.5"
                      >
                        Confirm password
                      </label>

                      <div className="relative">

                        <LockKeyhole
                          size={17}
                          strokeWidth={2}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                        />

                        <input
                          id="confirmPassword"
                          type={
                            showConfirmPassword ? 'text' : 'password'
                          }
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          placeholder="Confirm your new password"
                          className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-11 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                          style={{
                            paddingTop: '11px',
                            paddingBottom: '11px',
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2D312E]/35 hover:text-[#3D5A4C] transition"
                          aria-label={
                            showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                      </div>

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

                    {/* SUBMIT */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="font-body w-full flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 mt-1 transition hover:bg-[#4E876E] hover:shadow-[0_8px_20px_-4px_rgba(61,90,76,0.4)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#3D5A4C]/20"
                    >
                      {loading
                        ? 'Resetting password…'
                        : 'Reset password'}
                    </button>

                  </form>
                </>
              ) : (
                <>
                  {/* SUCCESS */}
                  <div className="w-12 h-12 rounded-full bg-[#E9F0EC] flex items-center justify-center mb-5">
                    <Check
                      size={24}
                      strokeWidth={2.2}
                      className="text-[#3D5A4C]"
                    />
                  </div>

                  <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
                    Password updated
                  </p>

                  <h2 className="font-display text-[#2D312E] text-[26px] mb-2">
                    You're all set
                  </h2>

                  <p className="font-body text-[#2D312E]/50 text-[13.5px] leading-5">
                    Your password has been successfully changed. You can now
                    sign in using your new password.
                  </p>

                  <button
                    type="button"
                    onClick={goToLogin}
                    className="font-body w-full flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 mt-7 transition hover:bg-[#4E876E] hover:shadow-[0_8px_20px_-4px_rgba(61,90,76,0.4)] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#3D5A4C]/20"
                  >
                    Go to sign in
                  </button>
                </>
              )}

              {/* BACK TO LOGIN */}
              {!submitted && (
                <div className="mt-7 pt-5 border-t border-[#2D312E]/[0.07]">

                  <a
                    href="/auth/login"
                    className="font-body flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-[#4E876E] hover:text-[#3D5A4C] transition"
                  >
                    <ArrowLeft size={15} />
                    Back to sign in
                  </a>

                </div>
              )}

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

/* PASSWORD REQUIREMENT COMPONENT */
function Requirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5">

      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          valid
            ? 'bg-[#3D5A4C]'
            : 'bg-[#2D312E]/10'
        }`}
      >
        <Check
          size={10}
          strokeWidth={2.5}
          className={
            valid
              ? 'text-white'
              : 'text-[#2D312E]/25'
          }
        />
      </div>

      <span
        className={`font-body text-[10.5px] ${
          valid
            ? 'text-[#3D5A4C] font-medium'
            : 'text-[#2D312E]/40'
        }`}
      >
        {text}
      </span>

    </div>
  );
}

