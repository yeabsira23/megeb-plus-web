'use client';

import { useEffect, useState } from 'react';
import { UserRound, Mail, Phone, ShieldCheck, KeyRound } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

type AdminProfile = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
};

const DEFAULT_PROFILE: AdminProfile = {
  fullName: '',
  email: '',
  phone: '',
  role: 'System Administrator',
  joinedDate: '',
};

function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      try {
        // Backend API will be connected here later.
        // const data = await apiFetch<AdminProfile>('/admin/profile');
        // if (isMounted) setProfile(data);

        // Fallback: read the locally-cached user object saved at login,
        // so the page isn't fully blank before the endpoint exists.
        const cached = localStorage.getItem('user');
        if (cached && isMounted) {
          const parsed = JSON.parse(cached);
          setProfile((previous) => ({
            ...previous,
            fullName: parsed.full_name || parsed.name || '',
            email: parsed.email || '',
          }));
        }
      } catch (err) {
        console.error('Unable to load admin profile:', err);
        if (isMounted) setError('Unable to load profile.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  async function saveProfile() {
    setIsSaving(true);
    setSaved(false);
    setError(null);
    try {
      // Backend API will be connected here later.
      // await apiFetch('/admin/profile', { method: 'PUT', data: profile });
      setSaved(true);
    } catch (err) {
      console.error('Unable to save profile:', err);
      setError('Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  }

  return { profile, setProfile, isLoading, isSaving, error, saved, saveProfile };
}

export default function AdminProfilePage() {
  const { profile, setProfile, isLoading, isSaving, error, saved, saveProfile } = useAdminProfile();
  const initial = profile.fullName.trim() ? profile.fullName.charAt(0).toUpperCase() : 'A';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    saveProfile();
  }

  function handleChangePassword() {
    // Backend API will be connected here later — e.g. open a modal/form
    // that calls: await apiFetch('/admin/profile/password', { method: 'POST', data: { currentPassword, newPassword } });
    console.log('Change password');
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">My Profile</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/70">
          View and update your administrator account details.
        </p>
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}
      {saved && <p className="text-[12px] font-medium text-[#4E876E]">Profile updated.</p>}

      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.06] bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-[#2D312E]/[0.06] bg-[#FAF9F6]/50 px-6 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3D5A4C] text-xl font-semibold text-white">
            {initial}
          </div>
          <div>
            <p className="font-display text-[18px] text-[#2D312E]">
              {profile.fullName || 'Administrator'}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#E9F0EC] px-2.5 py-1 text-[10px] font-semibold text-[#3D5A4C]">
              <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
              {profile.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label htmlFor="fullName" className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#2D312E]/75">
              <UserRound className="h-3.5 w-3.5" />
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#2D312E]/75">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#2D312E]/75">
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="+251 ..."
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#3D5A4C] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="w-full rounded-xl bg-[#3D5A4C] py-3 text-[13px] font-semibold text-white hover:bg-[#4E876E] disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#2D312E]/[0.06] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-[16px] text-[#2D312E]">Password</h3>
            <p className="mt-1 text-[11.5px] text-[#2D312E]/70">
              Change your account password.
            </p>
          </div>
          <button
            type="button"
            onClick={handleChangePassword}
            className="flex items-center gap-1.5 rounded-xl border border-[#2D312E]/10 px-3.5 py-2 text-[12px] font-semibold text-[#2D312E]/70 hover:bg-[#FAF9F6]"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Change password
          </button>
        </div>
      </section>
    </div>
  );
}