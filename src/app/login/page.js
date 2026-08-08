
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Enter your phone number and password to continue.');
      return;
    }

    setLoading(true);

    try {
      // Backend developers will connect the API here later.
      await new Promise((resolve) => setTimeout(resolve, 900));
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
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

          {/* Small decorative line */}
          <div className="absolute top-[34%] left-[12%] w-16 h-px bg-[#DCC48E]/40" />

          <div className="absolute top-[34%] left-[12%] w-px h-16 bg-[#DCC48E]/40" />

        </div>
{/* BRAND */}
<div className="inline-flex items-center">
  <div className="bg-[#E9F0EC] px-7 py-3 rounded-full border border-[#CCD6C4] shadow-sm">
    <span className="font-display text-[#3D5A4C] text-3xl font-bold tracking-tight">
      Megeb<span className="text-[#4E876E]">+</span>
    </span>
  </div>
</div>
        {/* TEXT */}
        <div className="relative z-10 max-w-sm">

          <div className="w-8 h-[2px] bg-[#DCC48E] mb-5" />

          <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#CCD6C4] mb-4">
            Staff Portal
          </p>

          <h1 className="font-display text-white text-[42px] leading-[1.12]">
            Welcome back.
          </h1>

          <p className="font-body text-white/55 text-sm leading-6 mt-5 max-w-[280px]">
            Manage nutrition care, support healthier choices, and make every
            meal count.
          </p>

        </div>

        {/* NUTRITION DECORATION */}
        <div className="absolute right-[8%] top-[43%] w-[230px] h-[230px]">

          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-[#DCC48E]/10 blur-3xl" />

          {/* Plate */}
          <div
            className="absolute inset-[5px] rounded-full border-[10px] border-white/20 bg-white/[0.07] backdrop-blur-sm"
          >

            {/* Inner plate */}
            <div className="absolute inset-3 rounded-full border border-white/10" />

            {/* Leaves */}
            <div className="absolute top-8 left-10 w-14 h-8 rounded-[100%_0] bg-[#CCD6C4]/80 rotate-[25deg]" />

            <div className="absolute top-12 left-[85px] w-12 h-7 rounded-[0_100%] bg-[#4E876E]/80 rotate-[-15deg]" />

            <div className="absolute top-[70px] right-9 w-12 h-7 rounded-[100%_0] bg-[#CCD6C4]/70 rotate-[65deg]" />

            {/* Gold food */}
            <div className="absolute top-[88px] left-[75px] w-10 h-10 rounded-full bg-[#DCC48E]/80" />

            {/* Bowl */}
            <div className="absolute left-[55px] bottom-10 w-[100px] h-[50px] rounded-b-[60px] bg-white/10 border-b-2 border-[#DCC48E]/50" />

            {/* Food dots */}
            <div className="absolute bottom-[60px] left-[70px] w-4 h-4 rounded-full bg-[#4E876E]" />

            <div className="absolute bottom-[73px] left-[94px] w-3 h-3 rounded-full bg-[#DCC48E]" />

            <div className="absolute bottom-[58px] left-[115px] w-5 h-5 rounded-full bg-[#CCD6C4]" />

          </div>

          {/* Nutrition badge */}
          <div className="absolute -right-12 top-4 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">

            <p className="font-body text-[9px] uppercase tracking-[0.18em] text-[#CCD6C4]">
              Balanced
            </p>

            <p className="font-display text-sm text-white mt-0.5">
              Nutrition
            </p>

          </div>

          {/* Gold badge */}
          <div className="absolute -left-3 bottom-2 w-11 h-11 rounded-full bg-[#DCC48E] flex items-center justify-center shadow-lg">
            <span className="text-[#2D312E] text-lg">
              ✦
            </span>
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

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">

            <div className="w-8 h-8 rounded-full bg-[#3D5A4C] flex items-center justify-center">
              <span className="font-display text-white text-sm font-semibold">
                ም
              </span>
            </div>

            <span className="font-display text-[#2D312E] text-xl">
              Megeb+
            </span>

          </div>

          {/* LOGIN CARD */}
          <div className="bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(61,90,76,0.18)] border border-[#2D312E]/[0.06] overflow-hidden">

            {/* Top accent */}
            <div className="h-[3px] bg-gradient-to-r from-[#3D5A4C] via-[#4E876E] to-[#DCC48E]" />

            <div className="p-9">

              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#4E876E] mb-2 font-semibold">
                Portal Access
              </p>

              <h2 className="font-display text-[#2D312E] text-[26px] mb-1">
                Sign in
              </h2>

              <p className="font-body text-[#2D312E]/50 text-[13.5px] mb-7">
                Enter your credentials to continue.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* PHONE */}
                <div>

                  <label
                    htmlFor="phone"
                    className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-1.5"
                  >
                    Phone number
                  </label>

                  <div className="relative">

                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]">
                      <PhoneIcon />
                    </span>

                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-3.5 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                      style={{
                        paddingTop: '11px',
                        paddingBottom: '11px',
                      }}
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div>

                  <div className="flex items-center justify-between mb-1.5">

                    <label
                      htmlFor="password"
                      className="font-body text-[12.5px] font-semibold text-[#2D312E]/75"
                    >
                      Password
                    </label>

                    <a
                      href="/portal/forgot-password"
                      className="font-body text-[12.5px] font-medium text-[#4E876E] hover:text-[#3D5A4C]"
                    >
                      Forgot password?
                    </a>

                  </div>

                  <div className="relative">

                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]">
                      <LockIcon />
                    </span>

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-16 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                      style={{
                        paddingTop: '11px',
                        paddingBottom: '11px',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-[#4E876E]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
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

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="font-body w-full flex items-center justify-center rounded-xl bg-[#3D5A4C] text-white text-[14.5px] font-semibold py-3 mt-1 transition hover:bg-[#4E876E] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>

              </form>

            </div>
          </div>

      
              {/* Nutritionist application */}
        <div className="mt-6 pt-5 border-t border-[#2D312E]/[0.07] text-center">
             <p className="font-body text-[12.5px] text-[#2D312E]/50">
            Are you a nutritionist?{' '}
          <a
              href="/portal/nutritionist/apply"
      className="font-semibold text-[#4E876E] hover:text-[#3D5A4C] transition"
           >
      Apply to join Megeb+ →
           </a>
           </p>
        </div>


        </div>

      </section>

    </main>
  );
}

/* PHONE ICON */
function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/* LOCK ICON */
function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

