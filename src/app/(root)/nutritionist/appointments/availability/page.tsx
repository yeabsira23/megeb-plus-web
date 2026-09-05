"use client";

import { useState } from "react";
import Link from "next/link";
import {
ArrowLeft,
CalendarDays,
Check,
Clock,
MoreHorizontal,
Plus,
Save,
Trash2,
X,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

type TimeSlot = {
id: number;
start: string;
end: string;
};

type DayAvailability = {
day: string;
enabled: boolean;
slots: TimeSlot[];
};

const INITIAL_AVAILABILITY: DayAvailability[] = [
{
day: "Monday",
enabled: false,
slots: [],
},
{
day: "Tuesday",
enabled: false,
slots: [],
},
{
day: "Wednesday",
enabled: false,
slots: [],
},
{
day: "Thursday",
enabled: false,
slots: [],
},
{
day: "Friday",
enabled: false,
slots: [],
},
{
day: "Saturday",
enabled: false,
slots: [],
},
{
day: "Sunday",
enabled: false,
slots: [],
},
];

export default function AvailabilityPage() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [availability, setAvailability] = useState<DayAvailability[]>(
INITIAL_AVAILABILITY
);
const [saved, setSaved] = useState(false);

const toggleDay = (dayIndex: number) => {
setAvailability((current) =>
current.map((day, index) =>
index === dayIndex
? {
...day,
enabled: !day.enabled,
slots:
!day.enabled && day.slots.length === 0
? [
{
id: Date.now(),
start: "09:00",
end: "17:00",
},
]
: day.slots,
}
: day
)
);

setSaved(false);

};

const updateTime = (
dayIndex: number,
slotId: number,
field: "start" | "end",
value: string
) => {
setAvailability((current) =>
current.map((day, index) =>
index === dayIndex
? {
...day,
slots: day.slots.map((slot) =>
slot.id === slotId
? { ...slot, [field]: value }
: slot
),
}
: day
)
);


setSaved(false);


};

const addSlot = (dayIndex: number) => {
setAvailability((current) =>
current.map((day, index) =>
index === dayIndex
? {
...day,
enabled: true,
slots: [
...day.slots,
{
id: Date.now(),
start: "09:00",
end: "17:00",
},
],
}
: day
)
);


setSaved(false);


};

const removeSlot = (dayIndex: number, slotId: number) => {
setAvailability((current) =>
current.map((day, index) =>
index === dayIndex
? {
...day,
slots: day.slots.filter((slot) => slot.id !== slotId),
}
: day
)
);


setSaved(false);


};

const handleSave = () => {
// Backend availability API can be connected here later.
setSaved(true);


setTimeout(() => {
  setSaved(false);
}, 3000);


};

const handleReset = () => {
setAvailability(INITIAL_AVAILABILITY);
setSaved(false);
};

return ( <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
{/* ================= MOBILE HEADER ================= */} <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden"> <div className="flex items-center"> <span className="font-display text-[27px] font-bold tracking-tight text-[#DCC48E]">
Megeb </span> <span className="ml-1 font-display text-[33px] font-black leading-none text-[#DCC48E]">
+ </span> </div>

```
    <button
      type="button"
      onClick={() => setSidebarOpen(true)}
      className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
      aria-label="Open menu"
    >
      <MoreHorizontal size={22} />
    </button>
  </div>

  {/* ================= SIDEBAR ================= */}
  <Sidebar
    sidebarOpen={sidebarOpen}
    setSidebarOpen={setSidebarOpen}
  />

  {/* ================= MAIN CONTENT ================= */}
  <div className="lg:pl-[250px]">
    <Topbar />

    <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
      {/* ================= PAGE HEADER ================= */}
      <div className="mb-8">
        <Link
          href="/nutritionist/appointments"
          className="mb-5 inline-flex items-center gap-2 font-body text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]"
        >
          <ArrowLeft size={15} />
          Back to Appointments
        </Link>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
                <CalendarDays size={19} />
              </div>

              <span className="rounded-full bg-[#E9F0EC] px-3 py-1 font-body text-[9px] font-bold text-[#3D5A4C]">
                Appointment Settings
              </span>
            </div>

            <h1 className="font-display text-[28px] text-[#2D312E]">
              Your Availability
            </h1>

            <p className="font-body mt-1 text-[12px] text-[#2D312E]/45">
              Set the days and times when clients can book appointments
              with you.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-[#2D312E]/[0.08] bg-white px-4 py-3 font-body text-[11px] font-semibold text-[#2D312E]/60 transition hover:bg-[#FAF9F6]"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[11px] font-semibold text-white transition hover:bg-[#2D312E]"
            >
              {saved ? (
                <>
                  <Check size={16} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Availability
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= INFORMATION CARD ================= */}
      <div className="mb-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
            <Clock size={17} />
          </div>

          <div>
            <h2 className="font-body text-[12px] font-bold text-[#2D312E]">
              Set your working hours
            </h2>

            <p className="font-body mt-1 text-[11px] leading-5 text-[#2D312E]/45">
              Add one or more time slots for each day. Clients will be
              able to book appointments during the hours you make
              available.
            </p>
          </div>
        </div>
      </div>

      {/* ================= WEEKLY SCHEDULE ================= */}
      <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
        {/* Section Header */}
        <div className="border-b border-[#2D312E]/[0.06] px-6 py-5">
          <h2 className="font-display text-[20px] text-[#2D312E]">
            Weekly Schedule
          </h2>

          <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
            Choose the days and hours you are available for appointments.
          </p>
        </div>

        {/* Days */}
        <div className="divide-y divide-[#2D312E]/[0.05]">
          {availability.map((day, dayIndex) => (
            <div
              key={day.day}
              className="px-5 py-5 sm:px-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                {/* Day */}
                <div className="flex items-center justify-between md:w-40 md:shrink-0 md:justify-start">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleDay(dayIndex)}
                      aria-label={`Toggle ${day.day}`}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        day.enabled
                          ? "bg-[#3D5A4C]"
                          : "bg-[#2D312E]/20"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          day.enabled
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>

                    <span
                      className={`font-body text-[12px] font-bold ${
                        day.enabled
                          ? "text-[#2D312E]"
                          : "text-[#2D312E]/35"
                      }`}
                    >
                      {day.day}
                    </span>
                  </div>

                  <span
                    className={`font-body text-[9px] font-semibold md:hidden ${
                      day.enabled
                        ? "text-[#4E876E]"
                        : "text-[#2D312E]/30"
                    }`}
                  >
                    {day.enabled ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Time Slots */}
                <div className="min-w-0 flex-1">
                  {!day.enabled ? (
                    <div className="flex min-h-[42px] items-center rounded-xl border border-dashed border-[#2D312E]/[0.08] bg-[#FAF9F6] px-4">
                      <span className="font-body text-[10px] text-[#2D312E]/35">
                        Not available
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                          <div className="flex flex-1 items-center gap-2">
                            <div className="relative flex-1">
                              <Clock
                                size={14}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                              />

                              <input
                                type="time"
                                value={slot.start}
                                onChange={(event) =>
                                  updateTime(
                                    dayIndex,
                                    slot.id,
                                    "start",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] pl-9 pr-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#3D5A4C]"
                              />
                            </div>

                            <span className="font-body text-[10px] text-[#2D312E]/35">
                              to
                            </span>

                            <div className="relative flex-1">
                              <Clock
                                size={14}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#2D312E]/30"
                              />

                              <input
                                type="time"
                                value={slot.end}
                                onChange={(event) =>
                                  updateTime(
                                    dayIndex,
                                    slot.id,
                                    "end",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6] pl-9 pr-3 font-body text-[11px] text-[#2D312E] outline-none transition focus:border-[#3D5A4C]"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeSlot(dayIndex, slot.id)
                            }
                            disabled={day.slots.length === 1}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#2D312E]/[0.08] px-4 font-body text-[10px] font-semibold text-[#2D312E]/40 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 sm:w-11 sm:px-0"
                            aria-label={`Remove ${day.day} time slot`}
                          >
                            <Trash2 size={15} />

                            <span className="sm:hidden">
                              Remove
                            </span>
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addSlot(dayIndex)}
                        className="inline-flex items-center gap-2 rounded-lg py-1 font-body text-[10px] font-bold text-[#4E876E] transition hover:text-[#3D5A4C]"
                      >
                        <Plus size={15} />
                        Add time slot
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3 border-t border-[#2D312E]/[0.06] bg-[#FAF9F6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-body text-[10px] leading-5 text-[#2D312E]/40">
            Your availability can be updated at any time.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-xl border border-[#2D312E]/[0.08] bg-white px-4 py-2.5 font-body text-[10px] font-semibold text-[#2D312E]/55 transition hover:bg-[#FAF9F6] sm:flex-none"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-semibold text-white transition hover:bg-[#2D312E] sm:flex-none"
            >
              {saved ? "Availability Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </section>

      {/* ================= FUTURE API NOTE ================= */}
      <div className="mt-6 rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DCC48E]/20 text-[#8A6D32]">
            <CalendarDays size={17} />
          </div>

          <div>
            <h3 className="font-body text-[12px] font-bold text-[#2D312E]">
              Appointment availability
            </h3>

            <p className="font-body mt-1 text-[11px] leading-5 text-[#2D312E]/45">
              Once availability is connected to the appointment system,
              clients will only be able to select appointment times that
              fall within the hours you set here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
  {sidebarOpen && (
    <button
      type="button"
      aria-label="Close sidebar"
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 z-40 bg-black/20 lg:hidden"
    />
  )}

  {sidebarOpen && (
    <button
      type="button"
      onClick={() => setSidebarOpen(false)}
      className="fixed right-4 top-4 z-[60] rounded-xl bg-white p-2 text-[#3D5A4C] shadow-md lg:hidden"
      aria-label="Close menu"
    >
      <X size={20} />
    </button>
  )}
</main>


);
}
