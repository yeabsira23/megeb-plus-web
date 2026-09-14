'use client';

import { useEffect, useState } from 'react';


import {
  getSettings,
  updateSettings,
  type PlatformSettings,
} from '@/app/libs/api/admin/settings';



const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: 'Megeb+',
  supportEmail: '',
  maintenanceMode: false,
  emailNotifications: true,
};

function useSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      setIsLoading(true);
      setError(null);
      try {
        
         const data = await getSettings();
         if (isMounted) setSettings(data);
        
      } catch (err) {
        console.error('Unable to load settings:', err);
        if (isMounted) setError('Unable to load settings.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  async function saveSettings() {
    setIsSaving(true);
    setSaved(false);
    setError(null);
    try {
      
       const data = await updateSettings(settings);

      setSettings(data);
      setSaved(true);
    } catch (err) {
      console.error('Unable to save settings:', err);
      setError('Unable to save settings.');
    } finally {
      setIsSaving(false);
    }
  }

  return { settings, setSettings, isLoading, isSaving, error, saved, saveSettings };
}

export default function SettingsPage() {
  const { settings, setSettings, isLoading, isSaving, error, saved, saveSettings } = useSettings();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setSettings((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    saveSettings();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-[23px] text-[#2D312E]">Settings</h1>
        <p className="mt-1 text-[12px] text-[#2D312E]/70">Platform-wide configuration.</p>
      </div>

      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}
      {saved && <p className="text-[12px] font-medium text-[#4E876E]">Settings saved.</p>}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#2D312E]/[0.06] bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="platformName" className="mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
            Platform name
          </label>
          <input
            id="platformName"
            name="platformName"
            value={settings.platformName ?? ''}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none focus:border-[#3D5A4C] focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="supportEmail" className="mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
            Support email
          </label>
          <input
            id="supportEmail"
            name="supportEmail"
            type="email"
            value={settings.supportEmail ?? ''}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="support@megeb.com"
            className="w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13px] outline-none placeholder:text-[#2D312E]/30 focus:border-[#3D5A4C] focus:bg-white"
          />
        </div>

        <label className="flex items-center justify-between rounded-xl border border-[#2D312E]/10 px-4 py-3">
          <span className="text-[12.5px] font-medium text-[#2D312E]/75">Maintenance mode</span>
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode ?? false}
            onChange={handleChange}
            disabled={isLoading}
            className="h-4 w-4 accent-[#3D5A4C]"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-[#2D312E]/10 px-4 py-3">
          <span className="text-[12.5px] font-medium text-[#2D312E]/75">Email notifications</span>
          <input
            type="checkbox"
            name="emailNotifications"
            checked={settings.emailNotifications ?? false}
            onChange={handleChange}
            disabled={isLoading}
            className="h-4 w-4 accent-[#3D5A4C]"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="w-full rounded-xl bg-[#3D5A4C] py-3 text-[13px] font-semibold text-white hover:bg-[#4E876E] disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}