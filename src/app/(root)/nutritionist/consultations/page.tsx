"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  UserRound,
  Video,
  Clock,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";
import { apiFetch } from "@/app/lib/api";

type ConsultationStatus = "Scheduled" | "Completed" | "Pending";

type Consultation = {
  id: string;
  clientName: string;
  type: string;
  date: string;
  time: string;
  mode: "Online" | "In Person";
  status: ConsultationStatus;
  lastMessage?: string;
  unread?: number;
};

function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchConsultations() {
      setIsLoading(true);
      setError(null);

      try {
        /*
         * Backend API will be connected here.
         *
         * Example:
         *
         * const data = await apiFetch<Consultation[]>(
         *   "/nutritionist/consultations"
         * );
         *
         * if (isMounted) {
         *   setConsultations(data);
         * }
         */

        // Temporary empty data until backend endpoint is confirmed.
        if (isMounted) {
          setConsultations([]);
        }
      } catch (err) {
        console.error("Unable to load consultations:", err);

        if (isMounted) {
          setError("Unable to load consultations.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchConsultations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    consultations,
    isLoading,
    error,
    setConsultations,
  };
}

export default function ConsultationsPage() {
  const {
    consultations,
    isLoading,
    error,
  } = useConsultations();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [message, setMessage] = useState("");

  const filteredConsultations = consultations.filter((consultation) =>
    consultation.clientName
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const scheduledCount = consultations.filter(
    (consultation) => consultation.status === "Scheduled"
  ).length;

  const pendingCount = consultations.filter(
    (consultation) => consultation.status === "Pending"
  ).length;

  const completedCount = consultations.filter(
    (consultation) => consultation.status === "Completed"
  ).length;

  function handleSendMessage() {
    if (!message.trim() || !selectedConsultation) return;

    /*
     * Backend API will be connected here later.
     *
     * Example:
     *
     * await apiFetch(
     *   `/nutritionist/consultations/${selectedConsultation.id}/messages`,
     *   {
     *     method: "POST",
     *     data: {
     *       message: message.trim(),
     *     },
     *   }
     * );
     */

    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center">
          <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
            Megeb
          </span>

          <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
            +
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
        >
          <MessageSquare size={22} />
        </button>
      </div>

      {/* Reusable Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[250px]">
        {/* Reusable Topbar */}
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Page Header */}
          <div className="mb-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              <MessageSquare size={21} />
            </div>

            <h1 className="font-display text-[28px] text-[#2D312E]">
              Consultations & Messages
            </h1>

            <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
              Manage your consultations and communicate with your clients.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Scheduled"
              value={scheduledCount.toString()}
              note="Upcoming consultations"
              icon={<Clock size={20} />}
            />

            <SummaryCard
              label="Pending"
              value={pendingCount.toString()}
              note="Need attention"
              icon={<MessageSquare size={20} />}
            />

            <SummaryCard
              label="Completed"
              value={completedCount.toString()}
              note="Completed consultations"
              icon={<CheckCircle2 size={20} />}
            />
          </div>

          {/* Main Consultation Area */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="grid min-h-[560px] md:grid-cols-[300px_1fr]">
              {/* Conversation List */}
              <div
                className={`border-r border-[#2D312E]/[0.07] ${
                  selectedConsultation ? "hidden md:block" : "block"
                }`}
              >
                {/* List Header */}
                <div className="border-b border-[#2D312E]/[0.06] p-5">
                  <h2 className="font-display text-[19px] text-[#2D312E]">
                    Conversations
                  </h2>

                  <div className="relative mt-4">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                    />

                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search clients"
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-2 pl-9 pr-3 font-body text-[11px] outline-none focus:border-[#3D5A4C]"
                    />
                  </div>
                </div>

                {/* Conversation List */}
                <div>
                  {isLoading ? (
                    <div className="px-5 py-10 text-center">
                      <p className="font-body text-[11px] text-[#2D312E]/40">
                        Loading conversations…
                      </p>
                    </div>
                  ) : error ? (
                    <div className="px-5 py-10 text-center">
                      <p className="font-body text-[11px] text-red-500">
                        {error}
                      </p>
                    </div>
                  ) : filteredConsultations.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                        <MessageSquare size={20} />
                      </div>

                      <p className="mt-4 font-display text-[16px] text-[#2D312E]">
                        No conversations yet
                      </p>

                      <p className="font-body mt-1 text-[10px] leading-5 text-[#2D312E]/40">
                        Client conversations will appear here once you have
                        messages.
                      </p>
                    </div>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <button
                        key={consultation.id}
                        type="button"
                        onClick={() =>
                          setSelectedConsultation(consultation)
                        }
                        className={`flex w-full items-center gap-3 border-b border-[#2D312E]/[0.05] px-5 py-4 text-left transition hover:bg-[#FAF9F6] ${
                          selectedConsultation?.id === consultation.id
                            ? "bg-[#E9F0EC]"
                            : ""
                        }`}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          <UserRound size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-body text-[11px] font-bold text-[#2D312E]">
                              {consultation.clientName}
                            </p>

                            {consultation.unread &&
                            consultation.unread > 0 ? (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3D5A4C] px-1.5 font-body text-[8px] font-bold text-white">
                                {consultation.unread}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-1 truncate font-body text-[9px] text-[#2D312E]/40">
                            {consultation.lastMessage ||
                              consultation.type}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Conversation Panel */}
              <div
                className={`flex flex-col ${
                  selectedConsultation ? "block" : "hidden md:flex"
                }`}
              >
                {selectedConsultation ? (
                  <>
                    {/* Conversation Header */}
                    <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedConsultation(null)
                          }
                          className="mr-1 rounded-lg p-2 text-[#2D312E]/40 hover:bg-[#FAF9F6] md:hidden"
                        >
                          ←
                        </button>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          <UserRound size={18} />
                        </div>

                        <div>
                          <p className="font-body text-[12px] font-bold text-[#2D312E]">
                            {selectedConsultation.clientName}
                          </p>

                          <p className="font-body text-[9px] text-[#2D312E]/40">
                            Client
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#2D312E]/40 transition hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                      >
                        <MoreHorizontal size={19} />
                      </button>
                    </div>

                    {/* Consultation Information */}
                    <div className="border-b border-[#2D312E]/[0.06] bg-[#FAF9F6] px-5 py-4">
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                            Consultation
                          </p>

                          <p className="mt-1 font-body text-[10px] text-[#2D312E]/65">
                            {selectedConsultation.type}
                          </p>
                        </div>

                        <div>
                          <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                            Date
                          </p>

                          <p className="mt-1 font-body text-[10px] text-[#2D312E]/65">
                            {selectedConsultation.date}
                          </p>
                        </div>

                        <div>
                          <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                            Time
                          </p>

                          <p className="mt-1 font-body text-[10px] text-[#2D312E]/65">
                            {selectedConsultation.time}
                          </p>
                        </div>

                        <div>
                          <p className="font-body text-[8px] font-bold uppercase tracking-wider text-[#2D312E]/30">
                            Mode
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 font-body text-[10px] text-[#2D312E]/65">
                            {selectedConsultation.mode === "Online" ? (
                              <Video size={12} />
                            ) : null}

                            {selectedConsultation.mode}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex flex-1 flex-col justify-end bg-white p-5">
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          <MessageSquare size={20} />
                        </div>

                        <p className="mt-4 font-display text-[17px] text-[#2D312E]">
                          No messages yet
                        </p>

                        <p className="mt-1 max-w-sm font-body text-[10px] leading-5 text-[#2D312E]/40">
                          Start the conversation with{" "}
                          {selectedConsultation.clientName}.
                        </p>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-[#2D312E]/[0.07] p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) =>
                            setMessage(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSendMessage();
                            }
                          }}
                          placeholder="Write a message..."
                          className="flex-1 rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] outline-none focus:border-[#3D5A4C]"
                        />

                        <button
                          type="button"
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3D5A4C] text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Send size={17} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                      <MessageSquare size={23} />
                    </div>

                    <h2 className="mt-5 font-display text-[20px] text-[#2D312E]">
                      Your conversations
                    </h2>

                    <p className="mt-2 max-w-sm font-body text-[11px] leading-5 text-[#2D312E]/40">
                      Select a client conversation from the list to view
                      messages and communicate with them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* Summary Card */

function SummaryCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-body text-[11px] font-semibold text-[#2D312E]/45">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
          {icon}
        </div>
      </div>

      <h2 className="font-display text-[27px] text-[#2D312E]">
        {value}
      </h2>

      <p className="font-body mt-1 text-[10px] text-[#4E876E]">
        {note}
      </p>
    </div>
  );
}