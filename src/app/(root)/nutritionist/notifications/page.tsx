"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Check,
} from "lucide-react";

import Sidebar from "@/app/components/nutritionist/Sidebar";
import Topbar from "@/app/components/nutritionist/Topbar";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "@/app/libs/api/client";

type NotificationFilter =
  | "All"
  | "Unread"
  | "Appointments"
  | "Messages"
  | "Plans";

const getIcon = (
  type: Notification["type"]
) => {
  switch (type) {
    case "appointment":
      return CalendarDays;

    case "message":
      return MessageSquare;

    case "plan":
      return ClipboardList;

    default:
      return Bell;
  }
};

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState<NotificationFilter>("All");

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [markingAsRead, setMarkingAsRead] =
    useState<number | null>(null);

  const [markingAllAsRead, setMarkingAllAsRead] =
    useState(false);

  /* =========================================================
     LOAD NOTIFICATIONS
  ========================================================= */

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );

        setError(
          "Unable to load notifications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  /* =========================================================
     UNREAD COUNT
  ========================================================= */

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  /* =========================================================
     FILTER NOTIFICATIONS
  ========================================================= */

  const filteredNotifications = useMemo(() => {
    return notifications.filter(
      (notification) => {
        if (activeFilter === "Unread") {
          return !notification.read;
        }

        if (activeFilter === "Appointments") {
          return (
            notification.type ===
            "appointment"
          );
        }

        if (activeFilter === "Messages") {
          return (
            notification.type === "message"
          );
        }

        if (activeFilter === "Plans") {
          return notification.type === "plan";
        }

        return true;
      }
    );
  }, [
    notifications,
    activeFilter,
  ]);

  /* =========================================================
     DATE GROUPS
  ========================================================= */

  const todayNotifications =
    filteredNotifications.filter(
      (notification) =>
        notification.dateGroup === "Today"
    );

  const yesterdayNotifications =
    filteredNotifications.filter(
      (notification) =>
        notification.dateGroup === "Yesterday"
    );

  /* =========================================================
     MARK ONE AS READ
  ========================================================= */

  const markAsRead = async (
    id: number
  ) => {
    if (markingAsRead !== null) {
      return;
    }

    try {
      setMarkingAsRead(id);

      const updatedNotification =
        await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? updatedNotification
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );

      setError(
        "Unable to mark the notification as read."
      );
    } finally {
      setMarkingAsRead(null);
    }
  };

  /* =========================================================
     MARK ALL AS READ
  ========================================================= */

  const markAllAsRead = async () => {
    if (
      markingAllAsRead ||
      unreadCount === 0
    ) {
      return;
    }

    try {
      setMarkingAllAsRead(true);

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );

      setError(
        "Unable to mark all notifications as read."
      );
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  /* =========================================================
     RENDER NOTIFICATION
  ========================================================= */

  const renderNotification = (
    notification: Notification
  ) => {
    const Icon = getIcon(
      notification.type
    );

    const isMarkingThis =
      markingAsRead === notification.id;

    return (
      <div
        key={notification.id}
        className={`group flex items-start gap-4 border-b border-[#2D312E]/[0.06] px-5 py-5 transition-colors last:border-b-0 ${
          !notification.read
            ? "bg-[#F4F7F4] hover:bg-[#E9F0EC]/50"
            : "bg-white hover:bg-[#FAF9F6]"
        }`}
      >
        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            !notification.read
              ? "bg-[#E9F0EC] text-[#4E876E]"
              : "bg-[#FAF9F6] text-[#3D5A4C]/55"
          }`}
        >
          <Icon
            size={18}
            strokeWidth={1.8}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className={`font-body text-[13px] ${
                  !notification.read
                    ? "font-bold text-[#2D312E]"
                    : "font-semibold text-[#2D312E]"
                }`}
              >
                {notification.title}
              </h3>

              <p className="font-body mt-1 text-[12px] leading-5 text-[#2D312E]/55">
                {notification.message}
              </p>

              <p className="font-body mt-2 text-[10px] text-[#2D312E]/35">
                {notification.time}
              </p>
            </div>

            {/* Unread indicator */}
            <div className="flex shrink-0 items-center gap-2">
              {!notification.read && (
                <>
                  <span className="h-2 w-2 rounded-full bg-[#4E876E]" />

                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    disabled={
                      isMarkingThis ||
                      markingAllAsRead
                    }
                    title="Mark as read"
                    aria-label="Mark notification as read"
                    className="rounded-lg p-1.5 text-[#3D5A4C]/35 opacity-100 transition hover:bg-[#E9F0EC] hover:text-[#4E876E] disabled:cursor-not-allowed disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Check
                      size={15}
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     RENDER SECTION
  ========================================================= */

  const renderSection = (
    title: string,
    items: Notification[]
  ) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <section
        key={title}
        className="mb-7"
      >
        {/* Section heading */}
        <div className="mb-3 flex items-center gap-4">
          <h2 className="font-body shrink-0 text-[12px] font-bold uppercase tracking-[0.12em] text-[#3D5A4C]">
            {title}
          </h2>

          <div className="h-px flex-1 bg-[#2D312E]/[0.07]" />
        </div>

        {/* Notification list */}
        <div className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.2)]">
          {items.map(
            renderNotification
          )}
        </div>
      </section>
    );
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D312E]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#2D312E]/[0.07] bg-white px-5 py-4 lg:hidden">
        <div className="rounded-full border border-[#CCD6C4] bg-[#E9F0EC] px-4 py-1.5">
          <span className="font-display text-xl font-bold text-[#3D5A4C]">
            Megeb
            <span className="text-[#4E876E]">
              +
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="rounded-xl p-2 text-[#3D5A4C] hover:bg-[#E9F0EC]"
          aria-label="Open menu"
        >
          <span className="text-xl">
            ☰
          </span>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="lg:pl-[250px]">
        {/* Existing Topbar */}
        <Topbar />

        {/* Content */}
        <div className="mx-auto max-w-5xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
          {/* Header */}
          <section className="mb-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#4E876E]">
                  <Bell
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h1 className="font-display text-[27px] leading-tight text-[#2D312E]">
                    Notifications
                  </h1>

                  <p className="font-body mt-1 text-[11px] text-[#2D312E]/40">
                    Stay updated with your appointments, messages and plans.
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={
                    markAllAsRead
                  }
                  disabled={
                    markingAllAsRead ||
                    loading
                  }
                  className="font-body rounded-lg px-3 py-2 text-[11px] font-bold text-[#4E876E] transition hover:bg-[#E9F0EC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {markingAllAsRead
                    ? "Marking..."
                    : "Mark all as read"}
                </button>
              )}
            </div>
          </section>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[#EB5757]/20 bg-[#EB5757]/5 px-4 py-3"
            >
              <p className="font-body text-[12px] text-[#EB5757]">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setError(null)
                }
                className="font-body shrink-0 text-[11px] font-bold text-[#EB5757] hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-7 overflow-x-auto">
            <div className="inline-flex min-w-full rounded-xl border border-[#2D312E]/[0.07] bg-white p-1 shadow-sm sm:min-w-0">
              {(
                [
                  "All",
                  "Unread",
                  "Appointments",
                  "Messages",
                  "Plans",
                ] as const
              ).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter
                    )
                  }
                  className={`font-body whitespace-nowrap rounded-lg px-4 py-2.5 text-[11px] font-bold transition ${
                    activeFilter ===
                    filter
                      ? "bg-[#3D5A4C] text-white shadow-sm"
                      : "text-[#2D312E]/50 hover:bg-[#E9F0EC] hover:text-[#3D5A4C]"
                  }`}
                >
                  {filter}

                  {filter ===
                    "Unread" &&
                    unreadCount > 0 && (
                      <span
                        className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] ${
                          activeFilter ===
                          "Unread"
                            ? "bg-[#DCC48E] text-[#2D312E]"
                            : "bg-[#E9F0EC] text-[#4E876E]"
                        }`}
                      >
                        {
                          unreadCount
                        }
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#E9F0EC] border-t-[#4E876E]" />

              <p className="font-body mt-4 text-[12px] text-[#2D312E]/45">
                Loading notifications...
              </p>
            </div>
          ) : filteredNotifications.length >
            0 ? (
            <>
              {renderSection(
                "Today",
                todayNotifications
              )}

              {renderSection(
                "Yesterday",
                yesterdayNotifications
              )}

              {/* Other date groups */}
              {Array.from(
                new Set(
                  filteredNotifications
                    .map(
                      (
                        notification
                      ) =>
                        notification.dateGroup
                    )
                    .filter(
                      (group) =>
                        group !==
                          "Today" &&
                        group !==
                          "Yesterday"
                    )
                )
              ).map((group) =>
                renderSection(
                  group,
                  filteredNotifications.filter(
                    (
                      notification
                    ) =>
                      notification.dateGroup ===
                      group
                  )
                )
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#4E876E]">
                <Bell
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="font-display mt-4 text-[18px] text-[#2D312E]">
                No notifications
              </h2>

              <p className="font-body mx-auto mt-1 max-w-sm text-[11px] leading-5 text-[#2D312E]/40">
                {activeFilter ===
                "Unread"
                  ? "You're all caught up. There are no unread notifications."
                  : `There are no ${activeFilter.toLowerCase()} notifications right now.`}
              </p>

              {activeFilter !==
                "All" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      "All"
                    )
                  }
                  className="font-body mt-4 text-[11px] font-bold text-[#4E876E] hover:text-[#3D5A4C] hover:underline"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

