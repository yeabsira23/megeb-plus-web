'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Enter your email or username and password to continue.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login/',
        {
          email: identifier,
          password,
        }
      );

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      // Redirect based on user role
      if (response.data.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (response.data.role === 'nutritionist') {
        router.push('/nutritionist/dashboard');
      } else {
        setError('Unknown user role.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
            'Login failed. Check your credentials.'
        );
      } else {
        setError('Login failed. Check your credentials.');
      }
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
        <div className="flex items-center">
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
          <div className="flex items-center md:hidden">
            <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">
              Megeb
            </span>

            <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">
              +
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

                {/* EMAIL OR USERNAME */}
                <div>

                  <label
                    htmlFor="identifier"
                    className="font-body block text-[12.5px] font-semibold text-[#2D312E]/75 mb-1.5"
                  >
                    Email or username
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      strokeWidth={2}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="you@example.com or username"
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
                      href="/auth/forgot-password"
                      className="font-body text-[12.5px] font-medium text-[#4E876E] hover:text-[#3D5A4C]"
                    >
                      Forgot password?
                    </a>

                  </div>

                  <div className="relative">

                    <Lock
                      size={17}
                      strokeWidth={2}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                    />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 pl-10 pr-11 text-[14.5px] text-[#2D312E] placeholder:text-[#2D312E]/30 outline-none transition focus:bg-white focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                      style={{
                        paddingTop: '11px',
                        paddingBottom: '11px',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4E876E]"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
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
                href="/nutritionist/apply"
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