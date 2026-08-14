                         'use client';

import { useState, FormEvent } from 'react';
import { Mail, Check, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Enter your email to continue.');
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect this to the backend password reset API
      await new Promise((resolve) => setTimeout(resolve, 900));

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
                className="w-1.5 h-1.5 rounded-full bg-[#DCC48E]"
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
            Account Recovery
          </p>

          <h1 className="font-display text-white text-[42px] leading-[1.12]">
            Let's get you back in.
          </h1>

          <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
            Forgot your password? Don't worry. We'll help you get back to
            managing nutrition care.
          </p>

        </div>
        {/* DECORATIVE SECURITY ICON */}
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

            {/* Small gold badge */}
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
           <div className="flex items-center md:hidden">
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
                  <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
                    Password Recovery
                  </p>

                  <h2 className="font-display text-[#2D312E] text-[26px] mb-1">
                    Forgot password?
                  </h2>

                  <p className="font-body text-[#2D312E]/50 text-[13.5px] mb-7 leading-5">
                    Enter your email and we'll help you reset your password.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >

                    {/* EMAIL */}
                    <div>

                      <label
                        htmlFor="email"
                        className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-1.5"
                      >
                        Email
                      </label>

                      <div className="relative">

                        <Mail
                          size={17}
                          strokeWidth={2}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                        />

                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                         value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-3.5 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                          style={{
                            paddingTop: '11px',
                            paddingBottom: '11px',
                          }}
                        />

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

                    {/* BUTTON */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="font-body w-full flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 mt-1 transition hover:bg-[#4E876E] hover:shadow-[0_8px_20px_-4px_rgba(61,90,76,0.4)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#3D5A4C]/20"
                    >
                      {loading ? 'Sending…' : 'Send reset instructions'}
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
                    Request received
                  </p>

                  <h2 className="font-display text-[#2D312E] text-[26px] mb-2">
                    Check your email
                  </h2>

                  <p className="font-body text-[#2D312E]/50 text-[13.5px] leading-5">
                    If an account exists for{' '}
                    <span className="font-semibold text-[#2D312E]/70">
                      {email}
                    </span>
                    , you'll receive instructions to reset your password.
                  </p>
                </>
              )}

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