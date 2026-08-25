"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Menu,
  MessageCircle,
  Send,
  UserRound,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type Message = {
  id: number;
  sender: "nutritionist" | "client";
  text: string;
  time: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
};

const TEMPORARY_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Hana Tesfaye",
    email: "hana.tesfaye@example.com",
  },
  {
    id: "2",
    name: "Selam Alemu",
    email: "selam.alemu@example.com",
  },
  {
    id: "3",
    name: "Meron Kebede",
    email: "meron.kebede@example.com",
  },
  {
    id: "4",
    name: "Liya Michael",
    email: "liya.michael@example.com",
  },
];

const TEMPORARY_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: 1,
      sender: "nutritionist",
      text: "Hello Hana! How have you been doing with your meal plan this week?",
      time: "9:30 AM",
    },
    {
      id: 2,
      sender: "client",
      text: "I've been following it consistently. I have also been drinking more water.",
      time: "9:42 AM",
    },
    {
      id: 3,
      sender: "nutritionist",
      text: "That's great to hear! Keep up the consistency. We'll review your progress at your next appointment.",
      time: "9:45 AM",
    },
  ],
  "2": [
    {
      id: 1,
      sender: "nutritionist",
      text: "Hello Selam! How are you feeling with the current meal plan?",
      time: "10:15 AM",
    },
    {
      id: 2,
      sender: "client",
      text: "I'm doing well. I've been trying to keep my portions consistent.",
      time: "10:28 AM",
    },
  ],
  "3": [
    {
      id: 1,
      sender: "nutritionist",
      text: "Hi Meron! Just checking in to see how your nutrition plan is going.",
      time: "8:45 AM",
    },
    {
      id: 2,
      sender: "client",
      text: "Everything is going well so far. I've also been exercising regularly.",
      time: "9:02 AM",
    },
  ],
  "4": [
    {
      id: 1,
      sender: "nutritionist",
      text: "Hello Liya. I wanted to check in and see how you're doing.",
      time: "2:10 PM",
    },
  ],
};

export default function MessageClientPage() {
  const params = useParams();
  const clientId = String(params.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    TEMPORARY_MESSAGES[clientId] ?? []
  );

  const client = TEMPORARY_CLIENTS.find(
    (item) => item.id === clientId
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

    setMessages((currentMessages) => [
      ...currentMessages,
      newMessage,
    ]);

    setMessage("");
  }

  if (!client) {
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
            className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-7 lg:px-8">
            <Link
              href="/nutritionist/clients"
              className="mb-8 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]"
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
                The client you are trying to message does not exist.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
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
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <Menu size={22} />
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

        <div className="mx-auto max-w-5xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Back */}
          <Link
            href={`/nutritionist/clients/${client.id}`}
            className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
          >
            <ArrowLeft size={15} />
            Back to Client
          </Link>

          {/* Page Header */}
          <section className="mb-5 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                <UserRound size={21} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-[24px] text-[#2D312E]">
                    {client.name}
                  </h1>

                  <span className="rounded-full bg-[#E9F0EC] px-2.5 py-1 font-body text-[9px] font-bold text-[#3D5A4C]">
                    Client
                  </span>
                </div>

                <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                  {client.email}
                </p>
              </div>
            </div>
          </section>

          {/* Messaging Card */}
          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            {/* Conversation Header */}
            <div className="flex items-center gap-3 border-b border-[#2D312E]/[0.06] p-5 sm:p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <MessageCircle size={17} />
              </div>

              <div>
                <h2 className="font-display text-[19px]">
                  Messages
                </h2>

                <p className="font-body text-[10px] text-[#2D312E]/40">
                  Communicate with your client
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="min-h-[420px] space-y-4 bg-[#FAF9F6] p-5 sm:p-6">
              {messages.length === 0 ? (
                <div className="flex min-h-[350px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
                      <MessageCircle size={21} />
                    </div>

                    <h3 className="font-display mt-4 text-[18px]">
                      No messages yet
                    </h3>

                    <p className="font-body mt-1 text-[10px] text-[#2D312E]/40">
                      Start the conversation with {client.name}.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex ${
                      item.sender === "nutritionist"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[65%] ${
                        item.sender === "nutritionist"
                          ? "items-end"
                          : "items-start"
                      } flex flex-col`}
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
                ))
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
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      const form = e.currentTarget.form;

                      if (form) {
                        form.requestSubmit();
                      }
                    }
                  }}
                  placeholder={`Write a message to ${client.name}...`}
                  rows={2}
                  className="min-h-[48px] flex-1 resize-none rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4 py-3 font-body text-[11px] leading-5 text-[#2D312E] outline-none placeholder:text-[#2D312E]/30 focus:border-[#4E876E]/50 focus:ring-2 focus:ring-[#4E876E]/10"
                />

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>

              <p className="font-body mt-2 text-[9px] text-[#2D312E]/30">
                Press Enter to send • Shift + Enter for a new line
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}