"use client";

import { useEffect, useState } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

import {
  getNutritionistAvailability,
  createNutritionistAvailability,
  updateNutritionistAvailability,
  deleteNutritionistAvailability,
  type NutritionistAvailability,
} from "@/app/libs/api/client";

type TimeSlot = {
  id: number;
  start: string;
  end: string;
  isNew?: boolean;
};

type DayAvailability = {
  day: string;
  dayOfWeek: number;
  enabled: boolean;
  slots: TimeSlot[];
};

const DAYS = [
  { day: "Monday", dayOfWeek: 0 },
  { day: "Tuesday", dayOfWeek: 1 },
  { day: "Wednesday", dayOfWeek: 2 },
  { day: "Thursday", dayOfWeek: 3 },
  { day: "Friday", dayOfWeek: 4 },
  { day: "Saturday", dayOfWeek: 5 },
  { day: "Sunday", dayOfWeek: 6 },
];

const EMPTY_AVAILABILITY: DayAvailability[] = DAYS.map(
  ({ day, dayOfWeek }) => ({
    day,
    dayOfWeek,
    enabled: false,
    slots: [],
  })
);

function mapBackendAvailability(
  data: NutritionistAvailability[]
): DayAvailability[] {
  const mapped = DAYS.map(({ day, dayOfWeek }) => {
    const backendSlots = data.filter(
      (item) => item.day_of_week === dayOfWeek
    );

    return {
      day,
      dayOfWeek,
      enabled: backendSlots.some((slot) => slot.is_active),
      slots: backendSlots.map((slot) => ({
        id: slot.id,
        start: slot.start_time.slice(0, 5),
        end: slot.end_time.slice(0, 5),
      })),
    };
  });

  return mapped;
}

export default function AvailabilityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [availability, setAvailability] =
    useState<DayAvailability[]>(EMPTY_AVAILABILITY);

  const [originalAvailability, setOriginalAvailability] =
    useState<DayAvailability[]>(EMPTY_AVAILABILITY);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================================================
     LOAD AVAILABILITY
  ========================================================= */

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);
        setError(null);

        const data = await getNutritionistAvailability();

        const mapped = mapBackendAvailability(data);

        setAvailability(mapped);
        setOriginalAvailability(mapped);
      } catch (err) {
        console.error(
          "Failed to load nutritionist availability:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your availability."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAvailability();
  }, []);

  /* =========================================================
     TOGGLE DAY
  ========================================================= */

  const toggleDay = (dayIndex: number) => {
    setAvailability((current) =>
      current.map((day, index) => {
        if (index !== dayIndex) return day;

        const enabled = !day.enabled;

        return {
          ...day,
          enabled,
          slots:
            enabled && day.slots.length === 0
              ? [
                  {
                    id: Date.now(),
                    start: "09:00",
                    end: "17:00",
                    isNew: true,
                  },
                ]
              : day.slots,
        };
      })
    );

    setSaved(false);
  };

  /* =========================================================
     UPDATE TIME
  ========================================================= */

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
                  ? {
                      ...slot,
                      [field]: value,
                    }
                  : slot
              ),
            }
          : day
      )
    );

    setSaved(false);
  };

  /* =========================================================
     ADD SLOT
  ========================================================= */

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
                  isNew: true,
                },
              ],
            }
          : day
      )
    );

    setSaved(false);
  };

  /* =========================================================
     REMOVE SLOT
  ========================================================= */

  const removeSlot = (dayIndex: number, slotId: number) => {
    setAvailability((current) =>
      current.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              slots: day.slots.filter(
                (slot) => slot.id !== slotId
              ),
            }
          : day
      )
    );

    setSaved(false);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      /*
       * 1. Delete backend slots that were removed.
       */
      const currentSlotIds = new Set(
        availability.flatMap((day) =>
          day.slots
            .filter((slot) => !slot.isNew)
            .map((slot) => slot.id)
        )
      );

      const originalSlots = originalAvailability.flatMap(
        (day) => day.slots
      );

      const deletedSlots = originalSlots.filter(
        (slot) => !currentSlotIds.has(slot.id)
      );

      await Promise.all(
        deletedSlots.map((slot) =>
          deleteNutritionistAvailability(slot.id)
        )
      );

      /*
       * 2. Create new slots.
       */
      for (const day of availability) {
        if (!day.enabled) continue;

        const newSlots = day.slots.filter(
          (slot) => slot.isNew
        );

        for (const slot of newSlots) {
          if (slot.start >= slot.end) {
            throw new Error(
              `${day.day}: End time must be later than start time.`
            );
          }

          await createNutritionistAvailability({
            day_of_week: day.dayOfWeek,
            start_time: `${slot.start}:00`,
            end_time: `${slot.end}:00`,
            is_active: true,
          });
        }
      }

      /*
       * 3. Update existing slots.
       */
      for (const day of availability) {
        for (const slot of day.slots) {
          if (slot.isNew) continue;

          const originalDay = originalAvailability.find(
            (item) => item.dayOfWeek === day.dayOfWeek
          );

          const originalSlot = originalDay?.slots.find(
            (item) => item.id === slot.id
          );

          if (!originalSlot) continue;

          const changed =
            originalSlot.start !== slot.start ||
            originalSlot.end !== slot.end ||
            originalDay?.enabled !== day.enabled;

          if (!changed) continue;

          if (slot.start >= slot.end) {
            throw new Error(
              `${day.day}: End time must be later than start time.`
            );
          }

          await updateNutritionistAvailability(slot.id, {
            start_time: `${slot.start}:00`,
            end_time: `${slot.end}:00`,
            is_active: day.enabled,
          });
        }
      }

      /*
       * 4. Disable existing backend slots when a day
       *    has been turned off.
       *
       *    We update them instead of deleting them.
       */
      for (const originalDay of originalAvailability) {
        const currentDay = availability.find(
          (day) =>
            day.dayOfWeek === originalDay.dayOfWeek
        );

        if (!currentDay) continue;

        if (
          originalDay.enabled &&
          !currentDay.enabled
        ) {
          await Promise.all(
            originalDay.slots.map((slot) =>
              updateNutritionistAvailability(slot.id, {
                is_active: false,
              })
            )
          );
        }
      }

      /*
       * 5. Reload from backend so the UI has the real IDs
       *    and latest state.
       */
      const refreshed =
        await getNutritionistAvailability();

      const mapped = mapBackendAvailability(refreshed);

      setAvailability(mapped);
      setOriginalAvailability(mapped);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Failed to save availability:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your availability."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setAvailability(
      originalAvailability.map((day) => ({
        ...day,
        slots: day.slots.map((slot) => ({
          ...slot,
          isNew: false,
        })),
      }))
    );

    setSaved(false);
    setError(null);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:pl-[250px]">
          <Topbar />

          <div className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F0EC]">
                <Loader2
                  size={22}
                  className="animate-spin text-[#3D5A4C]"
                />
              </div>

              <h2 className="font-display mt-4 text-[20px] text-[#2D312E]">
                Loading your availability
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/45">
                Getting your appointment hours...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* ================= MOBILE HEADER ================= */}

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
                  Set the days and times when clients can
                  book appointments with you.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="rounded-xl border border-[#2D312E]/[0.08] bg-white px-4 py-3 font-body text-[11px] font-semibold text-[#2D312E]/60 transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-5 py-3 font-body text-[11px] font-semibold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : saved ? (
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

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <div>
                  <h3 className="font-body text-[12px] font-bold text-red-700">
                    Availability update failed
                  </h3>

                  <p className="font-body mt-1 text-[11px] leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  Add one or more time slots for each day.
                  Clients will be able to book appointments
                  during the hours you make available.
                </p>
              </div>
            </div>
          </div>

          {/* ================= WEEKLY SCHEDULE ================= */}

          <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-sm">
            <div className="border-b border-[#2D312E]/[0.06] px-6 py-5">
              <h2 className="font-display text-[20px] text-[#2D312E]">
                Weekly Schedule
              </h2>

              <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                Choose the days and hours you are available
                for appointments.
              </p>
            </div>

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
                          onClick={() =>
                            toggleDay(dayIndex)
                          }
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
                        {day.enabled
                          ? "Available"
                          : "Unavailable"}
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
                                  removeSlot(
                                    dayIndex,
                                    slot.id
                                  )
                                }
                                disabled={
                                  day.slots.length === 1
                                }
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
                            onClick={() =>
                              addSlot(dayIndex)
                            }
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
                Your availability can be updated at any
                time.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-[#2D312E]/[0.08] bg-white px-4 py-2.5 font-body text-[10px] font-semibold text-[#2D312E]/55 transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#3D5A4C] px-5 py-2.5 font-body text-[10px] font-semibold text-white transition hover:bg-[#2D312E] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  {saving
                    ? "Saving..."
                    : saved
                      ? "Availability Saved"
                      : "Save Changes"}
                </button>
              </div>
            </div>
          </section>

          {/* ================= INFO ================= */}

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
                  Clients will only be able to select
                  appointment times that fall within the
                  hours you make available.
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