"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageCircle,
  Search,
  UserRound,
  Video,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type Client = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Completed";
  lastMessage: string;
  lastMessageTime: string;
};

type Message = {
  id: number;
  sender: "nutritionist" | "client";
  text: string;
  time: string;
};

const TEMPORARY_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Hana Tesfaye",
    email: "hana.tesfaye@example.com",
    status: "Active",
    lastMessage: "Thank you, I will follow the meal plan.",
    lastMessageTime: "10:42 AM",
  },
  {
    id: "2",
    name: "Selam Alemu",
    email: "selam.alemu@example.com",
    status: "Active",
    lastMessage: "Can I replace chicken with fish?",
    lastMessageTime: "Yesterday",
  },
  {
    id: "3",
    name: "Meron Kebede",
    email: "meron.kebede@example.com",
    status: "Active",
    lastMessage: "I have uploaded my progress photos.",
    lastMessageTime: "Monday",
  },
  {
    id: "4",
    name: "Liya Michael",
    email: "liya.michael@example.com",
    status: "Completed",
    lastMessage: "Thank you for your help.",
    lastMessageTime: "Aug 20",
  },
];

const TEMPORARY_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: 1,
      sender: "client",
      text: "Hello! I wanted to ask about my nutrition plan.",
      time: "10:15 AM",
    },
    {
      id: 2,
      sender: "nutritionist",
      text: "Hi Hana! Of course. What would you like to know?",
      time: "10:20 AM",
    },
    {
      id: 3,
      sender: "client",
      text: "Can I have fruit as a snack in the afternoon?",
      time: "10:27 AM",
    },
    {
      id: 4,
      sender: "nutritionist",
      text: "Yes. You can have one serving of fruit as your afternoon snack.",
      time: "10:35 AM",
    },
    {
      id: 5,
      sender: "client",
      text: "Thank you, I will follow the meal plan.",
      time: "10:42 AM",
    },
  ],

  "2": [
    {
      id: 1,
      sender: "client",
      text: "Can I replace chicken with fish?",
      time: "Yesterday",
    },
    {
      id: 2,
      sender: "nutritionist",
      text: "Yes, you can replace chicken with a similar portion of fish.",
      time: "Yesterday",
    },
  ],

  "3": [
    {
      id: 1,
      sender: "client",
      text: "I have uploaded my progress photos.",
      time: "Monday",
    },
    {
      id: 2,
      sender: "nutritionist",
      text: "Great! I will review them and update your progress.",
      time: "Monday",
    },
  ],

  "4": [
    {
      id: 1,
      sender: "client",
      text: "Thank you for your help.",
      time: "Aug 20",
    },
  ],
};

function ConsultationsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Default client when opening the consultation page normally.
  const [selectedClientId, setSelectedClientId] = useState("1");

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] =
    useState<Record<string, Message[]>>(TEMPORARY_MESSAGES);

  const searchParams = useSearchParams();

  const clientIdFromUrl = searchParams.get("clientId");

  /*
   * If the page was opened from:
   *
   * /nutritionist/consultations?clientId=2
   *
   * then automatically select Selam.
   */
  useEffect(() => {
    if (
      clientIdFromUrl &&
      TEMPORARY_CLIENTS.some(
        (client) => client.id === clientIdFromUrl
      )
    ) {
      setSelectedClientId(clientIdFromUrl);
    }
  }, [clientIdFromUrl]);

  const selectedClient =
    TEMPORARY_CLIENTS.find(
      (client) => client.id === selectedClientId
    ) ?? TEMPORARY_CLIENTS[0];

  const filteredClients = TEMPORARY_CLIENTS.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "nutritionist",
      text: trimmedMessage,
      time: "Just now",
    };

    setMessages((currentMessages) => ({
      ...currentMessages,
      [selectedClient.id]: [
        ...(currentMessages[selectedClient.id] ?? []),
        newMessage,
      ],
    }));

    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <Link href="/nutritionist/dashboard">
          <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-4 py-1.5">
            <span className="font-display text-xl font-bold text-[#3D5A4C]">
              Megeb<span className="text-[#4E876E]">+</span>
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <span className="text-lg">☰</span>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:pl-[250px]">
        <Topbar />

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Page Header */}
          <div className="mb-7">
            <Link
              href="/nutritionist/dashboard"
              className="mb-5 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>

            <div>
              <h1 className="font-display text-[28px] text-[#2D312E]">
                Consultations
              </h1>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Manage your consultations and communicate with your
                clients.
              </p>
            </div>
          </div>

          {/* Consultation Summary */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {/* Next Consultation */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="font-body text-[9px] font-semibold uppercase tracking-wide text-[#2D312E]/35">
                    Next Consultation
                  </p>

                  <p className="font-display mt-1 text-[15px]">
                    Today, 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <Clock size={18} />
                </div>

                <div>
                  <p className="font-body text-[9px] font-semibold uppercase tracking-wide text-[#2D312E]/35">
                    Duration
                  </p>

                  <p className="font-display mt-1 text-[15px]">
                    30 Minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Active Clients */}
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <p className="font-body text-[9px] font-semibold uppercase tracking-wide text-[#2D312E]/35">
                    Active Clients
                  </p>

                  <p className="font-display mt-1 text-[15px]">
                    {
                      TEMPORARY_CLIENTS.filter(
                        (client) => client.status === "Active"
                      ).length
                    }{" "}
                    Clients
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation / Messages */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="grid min-h-[620px] lg:grid-cols-[310px_1fr]">
              {/* Clients */}
              <aside className="border-b border-[#2D312E]/[0.06] lg:border-b-0 lg:border-r">
                <div className="border-b border-[#2D312E]/[0.06] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                      <UserRound size={16} />
                    </div>

                    <div>
                      <h2 className="font-display text-[18px]">
                        My Clients
                      </h2>

                      <p className="font-body text-[9px] text-[#2D312E]/35">
                        Select a client to view messages
                      </p>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search clients..."
                      className="w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] py-2.5 pl-9 pr-3 font-body text-[10px] text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />
                  </div>
                </div>

                {/* Client List */}
                <div className="max-h-[500px] overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <p className="font-body text-[10px] text-[#2D312E]/40">
                        No clients found.
                      </p>
                    </div>
                  ) : (
                    filteredClients.map((client) => {
                      const isSelected =
                        client.id === selectedClient.id;

                      return (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setMessage("");
                          }}
                          className={`w-full border-b border-[#2D312E]/[0.05] px-5 py-4 text-left transition ${
                            isSelected
                              ? "bg-[#E9F0EC]"
                              : "bg-white hover:bg-[#FAF9F6]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                isSelected
                                  ? "bg-[#3D5A4C] text-white"
                                  : "bg-[#E9F0EC] text-[#3D5A4C]"
                              }`}
                            >
                              {client.name
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate font-body text-[11px] font-bold text-[#2D312E]">
                                  {client.name}
                                </p>

                                <span className="font-body text-[8px] text-[#2D312E]/30">
                                  {client.lastMessageTime}
                                </span>
                              </div>

                              <p className="mt-1 truncate font-body text-[9px] text-[#2D312E]/40">
                                {client.lastMessage}
                              </p>

                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-body text-[8px] font-bold ${
                                    client.status === "Active"
                                      ? "bg-[#E9F0EC] text-[#3D5A4C]"
                                      : "bg-[#F1F1EE] text-[#2D312E]/50"
                                  }`}
                                >
                                  {client.status === "Active" && (
                                    <CheckCircle2 size={10} />
                                  )}

                                  {client.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* Conversation */}
              <div className="flex min-h-[620px] flex-col">
                {/* Conversation Header */}
                <div className="flex flex-col gap-4 border-b border-[#2D312E]/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                      {selectedClient.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>

                    <div>
                      <h2 className="font-display text-[20px]">
                        {selectedClient.name}
                      </h2>

                      <p className="font-body mt-0.5 text-[9px] text-[#2D312E]/35">
                        {selectedClient.email}
                      </p>
                    </div>
                  </div>

                  {/* Client Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/nutritionist/clients/${selectedClient.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2D312E]/[0.08] px-3 py-2.5 font-body text-[9px] font-bold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
                    >
                      <UserRound size={13} />
                      View Profile
                    </Link>

                    <Link
                      href={`/nutritionist/consultations/video/${selectedClient.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-3 py-2.5 font-body text-[9px] font-bold text-white transition hover:bg-[#2D312E]"
                    >
                      <Video size={13} />
                      Video Call
                    </Link>
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="border-b border-[#2D312E]/[0.05] bg-[#FAF9F6] px-5 py-3">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="flex items-center gap-1.5 font-body text-[9px] text-[#2D312E]/45">
                      <CalendarDays
                        size={13}
                        className="text-[#4E876E]"
                      />
                      Today, August 26
                    </span>

                    <span className="flex items-center gap-1.5 font-body text-[9px] text-[#2D312E]/45">
                      <Clock
                        size={13}
                        className="text-[#4E876E]"
                      />
                      2:00 PM – 2:30 PM
                    </span>

                    <span className="flex items-center gap-1.5 font-body text-[9px] text-[#2D312E]/45">
                      <Video
                        size={13}
                        className="text-[#4E876E]"
                      />
                      Online Consultation
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAF9F6] p-5 sm:p-6">
                  {(messages[selectedClient.id] ?? []).length ===
                  0 ? (
                    <div className="flex min-h-[350px] items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                          <MessageCircle size={21} />
                        </div>

                        <h3 className="font-display mt-4 text-[18px]">
                          No messages yet
                        </h3>

                        <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                          Start the conversation with{" "}
                          {selectedClient.name}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    (messages[selectedClient.id] ?? []).map(
                      (item) => (
                        <div
                          key={item.id}
                          className={`flex ${
                            item.sender === "nutritionist"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[80%] flex-col sm:max-w-[65%] ${
                              item.sender === "nutritionist"
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                item.sender === "nutritionist"
                                  ? "rounded-br-md bg-[#3D5A4C] text-white"
                                  : "rounded-bl-md border border-[#2D312E]/[0.06] bg-white text-[#2D312E]"
                              }`}
                            >
                              <p className="font-body text-[11px] leading-5">
                                {item.text}
                              </p>
                            </div>

                            <span
                              className={`mt-1 font-body text-[9px] text-[#2D312E]/35 ${
                                item.sender === "nutritionist"
                                  ? "mr-1"
                                  : "ml-1"
                              }`}
                            >
                              {item.time}
                            </span>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-[#2D312E]/[0.06] bg-white p-4 sm:p-5"
                >
                  <div className="flex items-end gap-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey
                        ) {
                          e.preventDefault();

                          const form = e.currentTarget.form;

                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                      placeholder={`Write a message to ${selectedClient.name}...`}
                      rows={2}
                      className="min-h-[48px] flex-1 resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                    />

                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Send message"
                    >
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
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    </button>
                  </div>

                  <p className="font-body mt-2 text-[9px] text-[#2D312E]/30">
                    Press Enter to send • Shift + Enter for a new line
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ConsultationsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
          <div className="flex min-h-screen items-center justify-center">
            <p className="font-body text-[11px] text-[#2D312E]/40">
              Loading consultations...
            </p>
          </div>
        </main>
      }
    >
      <ConsultationsContent />
    </Suspense>
  );
}