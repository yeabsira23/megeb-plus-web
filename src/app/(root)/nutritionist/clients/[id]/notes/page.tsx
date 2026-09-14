"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Save,
  UserRound,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import apiClient from "@/app/libs/api/client";

type Client = {
  id: number;
  full_name: string;
  email: string;
};

type ClientNote = {
  id: number;
  nutritionist: number;
  client: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export default function UpdateNotesPage() {
  const params = useParams();

  const clientId = String(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const [clientResponse, notesResponse] =
          await Promise.all([
            apiClient.get(
              `/api/nutritionists/clients/${clientId}/`
            ),

            apiClient
              .get(
                `/api/nutritionists/clients/${clientId}/notes/`
              )
              .catch(() => ({ data: null })),
          ]);

        console.log("CLIENT:", clientResponse.data);
        console.log("NOTES:", notesResponse.data);

        if (!isMounted) {
          return;
        }

        setClient(clientResponse.data);

        const noteData = notesResponse.data as
          | ClientNote
          | null;

        setNotes(noteData?.notes || "");
      } catch (err) {
        console.error("Unable to load client notes:", err);

        if (isMounted) {
          setError(
            "Unable to load the client notes. Please try again."
          );
          setClient(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (clientId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await apiClient.patch(
        `/api/nutritionists/clients/${clientId}/notes/`,
        {
          notes,
        }
      );

      console.log("NOTES SAVED:", response.data);

      setSaved(true);
    } catch (err) {
      console.error("Unable to save notes:", err);

      setError(
        "Unable to save notes. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={() => {}}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <FileText size={21} />
              </div>

              <h2 className="font-display mt-4 text-[20px]">
                Loading notes...
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Please wait while the client information is
                loaded.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={() => {}}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="mx-auto max-w-4xl px-5 py-10 sm:px-7 lg:px-8">
            <Link
              href="/nutritionist/clients"
              className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
            >
              <ArrowLeft size={15} />
              Back to Clients
            </Link>

            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-12 text-center shadow-sm">
              <UserRound
                size={28}
                className="mx-auto text-[#4E876E]"
              />

              <h1 className="font-display mt-4 text-[22px]">
                Client not found
              </h1>

              <p className="font-body mt-2 text-[11px] text-[#2D312E]/40">
                The client profile you are looking for does not
                exist.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      <Sidebar
        sidebarOpen={false}
        setSidebarOpen={() => {}}
      />

      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-4xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* BACK */}
          <Link
            href={`/nutritionist/clients/${client.id}`}
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Client
          </Link>

          {/* PAGE HEADER */}
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <FileText size={21} />
            </div>

            <h1 className="font-display text-[28px] text-[#2D312E]">
              Update Notes
            </h1>

            <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
              Update private clinical notes for this client.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3">
              <p className="font-body text-[10px] font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* CLIENT CARD */}
          <section className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-display text-[19px]">
                  {client.full_name}
                </h2>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  Client ID: {client.id}
                </p>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  {client.email}
                </p>
              </div>
            </div>
          </section>

          {/* NOTES FORM */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <FileText size={17} />
              </div>

              <div>
                <h2 className="font-display text-[19px]">
                  Nutritionist Notes
                </h2>

                <p className="font-body text-[10px] text-[#2D312E]/40">
                  These notes are private and visible only to
                  authorized nutritionist staff.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="client-notes"
                className="font-body text-[10px] font-bold uppercase tracking-wider text-[#2D312E]/40"
              >
                Clinical Notes
              </label>

              <textarea
                id="client-notes"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSaved(false);
                  setError(null);
                }}
                placeholder="Enter notes about the client's progress, recommendations, observations, or follow-up..."
                rows={10}
                className="mt-2 w-full resize-y rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-6 text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/25 focus:border-[#4E876E] focus:ring-1 focus:ring-[#4E876E]/20"
              />

              <p className="mt-2 font-body text-[9px] text-[#2D312E]/35">
                Keep notes clear, professional, and relevant to
                the client&apos;s nutrition care.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Link
                href={`/nutritionist/clients/${client.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-[#CCD6C4] px-5 py-3 font-body text-[10px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[10px] font-bold text-white transition hover:bg-[#334B40] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={14} />

                {isSaving
                  ? "Saving..."
                  : saved
                    ? "Notes Saved"
                    : "Save Notes"}
              </button>
            </div>

            {/* SUCCESS */}
            {saved && (
              <div className="mt-4 rounded-xl bg-[#E9F0EC] px-4 py-3">
                <p className="font-body text-[10px] font-semibold text-[#3D5A4C]">
                  Notes saved successfully.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}