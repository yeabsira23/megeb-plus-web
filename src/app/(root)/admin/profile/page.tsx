'use client';

import { useEffect, useState } from 'react';
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  X,
} from 'lucide-react';

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from '@/app/libs/api/admin/profile';

type AdminProfile = {
  fullName: string;
  email: string;
  phone: string | null;
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
  const [profile, setProfile] =
    useState<AdminProfile>(DEFAULT_PROFILE);

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
        const data = await getAdminProfile();

        if (isMounted) {
          setProfile({
            fullName: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'System Administrator',
            joinedDate: data.joinedDate || '',
          });
        }
      } catch (err) {
        console.error('Unable to load admin profile:', err);

        if (isMounted) {
          setError('Unable to load profile.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveProfile() {
    setIsSaving(true);
    setSaved(false);
    setError(null);

    try {
      const updated = await updateAdminProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone || '',
      });

      setProfile({
        fullName: updated.full_name || '',
        email: updated.email || '',
        phone: updated.phone || '',
        role: updated.role || profile.role,
        joinedDate: updated.joinedDate || profile.joinedDate,
      });

      setSaved(true);
    } catch (err) {
      console.error('Unable to save profile:', err);
      setError('Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    profile,
    setProfile,
    isLoading,
    isSaving,
    error,
    saved,
    saveProfile,
  };
}

export default function AdminProfilePage() {
  const {
    profile,
    setProfile,
    isLoading,
    isSaving,
    error,
    saved,
    saveProfile,
  } = useAdminProfile();

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false);

  const initial = profile.fullName.trim()
    ? profile.fullName.charAt(0).toUpperCase()
    : 'A';

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    saveProfile();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">
          My Profile
        </h1>

        <p className="mt-1 text-[12px] text-[#2D312E]/70">
          View and update your administrator account details.
        </p>
      </div>

      {error && (
        <p className="text-[12px] font-medium text-red-600">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-[12px] font-medium text-[#4E876E]">
          Profile updated successfully.
        </p>
      )}

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
              <ShieldCheck
                className="h-3 w-3"
                strokeWidth={2.5}
              />
              {profile.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#2D312E]/75"
            >
              <UserRound className="h-3.5 w-3.5" />
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#2D312E]/75"
            >
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#2D312E]/75"
            >
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone || ''}
              onChange={handleChange}
              disabled={isLoading || isSaving}
              placeholder="+251 ..."
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#3D5A4C] focus:bg-white disabled:opacity-60"
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-[16px] text-[#2D312E]">
              Password
            </h3>

            <p className="mt-1 text-[11.5px] text-[#2D312E]/70">
              Change your account password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#2D312E]/10 px-3.5 py-2 text-[12px] font-semibold text-[#2D312E]/70 hover:bg-[#FAF9F6]"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Change password
          </button>
        </div>
      </section>

      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}

function ChangePasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError(
        'New password must be at least 8 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSaving(true);

    try {
      await changeAdminPassword({
        currentPassword,
        newPassword,
      });

      setSuccess(true);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Unable to change password:', err);

      const message =
        err?.response?.data?.detail ||
        'Unable to change password.';

      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2D312E]/[0.06] px-6 py-5">
          <div>
            <h2 className="font-display text-[18px] text-[#2D312E]">
              Change password
            </h2>

            <p className="mt-1 text-[11.5px] text-[#2D312E]/65">
              Enter your current password and choose a new one.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#2D312E]/60 hover:bg-[#FAF9F6]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >
          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2.5 text-[12px] font-medium text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-[#E9F0EC] px-3 py-2.5 text-[12px] font-medium text-[#3D5A4C]">
              Password updated successfully.
            </div>
          )}

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
              Current password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
              New password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#3D5A4C] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
              Confirm new password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl border border-[#2D312E]/10 py-3 text-[12px] font-semibold text-[#2D312E]/70 hover:bg-[#FAF9F6]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-[#3D5A4C] py-3 text-[12px] font-semibold text-white hover:bg-[#4E876E] disabled:opacity-60"
            >
              {isSaving ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}