import Link from "next/link";
import {
  LayoutDashboard, Users, Salad, Apple, Calendar, CreditCard, BarChart3, Settings, Search, Bell, MoreVertical, DollarSign,
  ChevronRight, Stethoscope,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,450",
    change: "+12.5%",
    description: "from last month",
    icon: Users,
  },
  {
    title: "Nutritionists",
    value: "86",
    change: "+8.2%",
    description: "from last month",
    icon: Salad,
  },
  {
    title: "Appointments",
    value: "324",
    change: "+15.3%",
    description: "from last month",
    icon: Calendar,
  },
  {
    title: "Revenue",
    value: "125,400 ETB",
    change: "+10.8%",
    description: "from last month",
    icon: DollarSign,
  },
];

const appointments = [
  {
    client: "Hana Bekele",
    nutritionist: "Dr. Sarah",
    date: "Aug 08, 2026",
    time: "09:00 AM",
    type: "Online",
    status: "Confirmed",
  },
  {
    client: "Meron Alemu",
    nutritionist: "Dr. Michael",
    date: "Aug 08, 2026",
    time: "11:00 AM",
    type: "Online",
    status: "Pending",
  },
  {
    client: "Sara Tesfaye",
    nutritionist: "Dr. Sarah",
    date: "Aug 08, 2026",
    time: "02:00 PM",
    type: "In Person",
    status: "Confirmed",
  },
  {
    client: "Abebe Kebede",
    nutritionist: "Dr. Daniel",
    date: "Aug 09, 2026",
    time: "10:30 AM",
    type: "Online",
    status: "Pending",
  },
];

const recentUsers = [
  {
    name: "Hana Bekele",
    email: "hana@example.com",
    date: "Today",
    status: "Active",
  },
  {
    name: "Meron Alemu",
    email: "meron@example.com",
    date: "Today",
    status: "Active",
  },
  {
    name: "Sara Tesfaye",
    email: "sara@example.com",
    date: "Yesterday",
    status: "Active",
  },
  {
    name: "Abebe Kebede",
    email: "abebe@example.com",
    date: "Yesterday",
    status: "Pending",
  },
];

const pendingNutritionists = [
  {
    name: "Dr. Michael Tadesse",
    specialty: "Clinical Nutrition",
    submitted: "Aug 07, 2026",
  },
  {
    name: "Dr. Selamawit Girma",
    specialty: "Sports Nutrition",
    submitted: "Aug 06, 2026",
  },
  {
    name: "Dr. Daniel Haile",
    specialty: "Diet Therapy",
    submitted: "Aug 05, 2026",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f7f9f8] text-gray-800">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-gray-100 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D5A4C] text-xl text-white">
              ም
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#3D5A4C]">
                Megeb+
              </h1>
              <p className="text-xs text-gray-400">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-xl bg-[#3D5A4C] px-4 py-3 text-sm font-medium text-white"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={2} />
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <Users className="h-[18px] w-[18px]" strokeWidth={2} />
            Users
          </Link>

          <Link
            href="/admin/nutritionists"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <Salad className="h-[18px] w-[18px]" strokeWidth={2} />
            Nutritionists
          </Link>

          <Link
            href="/admin/food-database"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <Apple className="h-[18px] w-[18px]" strokeWidth={2} />
            Food Database
          </Link>

          <Link
            href="/admin/appointments"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <Calendar className="h-[18px] w-[18px]" strokeWidth={2} />
            Appointments
          </Link>

          <Link
            href="/admin/payments"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <CreditCard className="h-[18px] w-[18px]" strokeWidth={2} />
            Payments
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <BarChart3 className="h-[18px] w-[18px]" strokeWidth={2} />
            Reports
          </Link>

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            System
          </p>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
            Settings
          </Link>

        </nav>

        {/* Admin profile */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dce9e6] font-semibold text-[#3D5A4C]">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                Admin User
              </p>

              <p className="truncate text-xs text-gray-400">
                Administrator
              </p>
            </div>

            <button className="text-gray-400">
              <MoreVertical className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>

          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="lg:ml-64">

        {/* ================= HEADER ================= */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur-md sm:px-8">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Dashboard
            </h2>

            <p className="hidden text-sm text-gray-400 sm:block">
              Overview of your nutrition platform
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
              <Search className="mr-2 h-4 w-4 text-gray-400" strokeWidth={2} />

              <input
                type="text"
                placeholder="Search..."
                className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div> 

            {/* Notification */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
              <Bell className="h-[18px] w-[18px] text-gray-600" strokeWidth={2} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3D5A4C] font-semibold text-white">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  Admin User
                </p>

                <p className="text-xs text-gray-400">
                  Administrator
                </p>
              </div>

            </div>

          </div>

        </header>


        {/*  PAGE */}

        <div className="space-y-8 p-5 sm:p-8">

          {/* Welcome */}
          <section>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Good morning, Admin 
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Here is what's happening with Megeb+ today.
            </p>

          </section>


          {/* STAT CARDS  */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f0ee]">
                    <stat.icon className="h-5 w-5 text-[#3D5A4C]" strokeWidth={2} />
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2">

                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                    {stat.change}
                  </span>

                  <span className="text-xs text-gray-400">
                    {stat.description}
                  </span>

                </div>

              </div>
            ))}

          </section>


          {/*  CHART + QUICK ACTIONS  */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Appointment Chart */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Appointment Overview
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Appointments during the last 7 days
                  </p>
                </div>

                <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>

              </div>

              {/* Simple visual chart */}
              <div className="mt-8 flex h-52 items-end justify-between gap-3 border-b border-gray-100 px-2">

                {[
                  ["Mon", 45],
                  ["Tue", 65],
                  ["Wed", 52],
                  ["Thu", 80],
                  ["Fri", 68],
                  ["Sat", 92],
                  ["Sun", 74],
                ].map(([day, height]) => (
                  <div
                    key={day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >

                    <div
                      className="w-full max-w-10 rounded-t-lg bg-[#3D5A4C] transition hover:bg-[#2f4739]"
                      style={{ height: `${height}%` }}
                    />

                    <span className="mb-2 text-xs text-gray-400">
                      {day}
                    </span>

                  </div>
                ))}

              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3D5A4C]" />
                Total appointments
              </div>

            </div>


            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <h2 className="font-semibold text-gray-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Frequently used actions
              </p>

              <div className="mt-5 space-y-3">

                <Link
                  href="/admin/nutritionists"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7f0ee]">
                    <Salad className="h-5 w-5 text-[#3D5A4C]" strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Verify Nutritionists
                    </p>

                    <p className="text-xs text-gray-400">
                      8 pending applications
                    </p>
                  </div>

                  <ChevronRight className="ml-auto h-4 w-4 text-gray-400" strokeWidth={2} />
                </Link>


                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600" strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Manage Users
                    </p>

                    <p className="text-xs text-gray-400">
                      View all users
                    </p>
                  </div>

                  <ChevronRight className="ml-auto h-4 w-4 text-gray-400" strokeWidth={2} />
                </Link>


                <Link
                  href="/admin/food-database"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    <Apple className="h-5 w-5 text-orange-600" strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Add Food
                    </p>

                    <p className="text-xs text-gray-400">
                      Update food database
                    </p>
                  </div>

                  <ChevronRight className="ml-auto h-4 w-4 text-gray-400" strokeWidth={2} />
                </Link>

              </div>

            </div>

          </section>


          {/* APPOINTMENTS + USERS  */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Appointments */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2">

              <div className="flex items-center justify-between border-b border-gray-100 p-6">

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Recent Appointments
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Latest platform appointments
                  </p>
                </div>

                <Link
                  href="/admin/appointments"
                  className="text-sm font-medium text-[#3D5A4C] hover:underline"
                >
                  View all
                </Link>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px] text-left">

                  <thead className="bg-gray-50 text-xs uppercase text-gray-400">

                    <tr>
                      <th className="px-6 py-4 font-medium">
                        Client
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Nutritionist
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Date
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Type
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Status
                      </th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {appointments.map((appointment) => (
                      <tr
                        key={`${appointment.client}-${appointment.date}`}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-6 py-4">

                          <p className="text-sm font-medium text-gray-800">
                            {appointment.client}
                          </p>

                          <p className="text-xs text-gray-400">
                            {appointment.time}
                          </p>

                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {appointment.nutritionist}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {appointment.date}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {appointment.type}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.status === "Confirmed"
                                ? "bg-green-50 text-green-600"
                                : "bg-yellow-50 text-yellow-600"
                            }`}
                          >
                            {appointment.status}
                          </span>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>


            {/* Recent Users */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-gray-100 p-6">

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Recent Users
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Newly registered users
                  </p>
                </div>

                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-[#3D5A4C]"
                >
                  View all
                </Link>

              </div>


              <div className="divide-y divide-gray-100">

                {recentUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center gap-3 p-4"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f0ee] text-sm font-semibold text-[#3D5A4C]">
                      {user.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium text-gray-800">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {user.status}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </section>


          {/*  PENDING NUTRITIONISTS  */}

          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-100 p-6">

              <div>
                <h2 className="font-semibold text-gray-900">
                  Nutritionist Verification
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Nutritionists waiting for credential verification
                </p>
              </div>

              <Link
                href="/admin/nutritionists"
                className="text-sm font-medium text-[#3D5A4C]"
              >
                View all
              </Link>

            </div>


            <div className="grid grid-cols-1 divide-y divide-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0">

              {pendingNutritionists.map((nutritionist) => (
                <div
                  key={nutritionist.name}
                  className="p-5"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f0ee]">
                      <Stethoscope className="h-5 w-5 text-[#3D5A4C]" strokeWidth={2} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        {nutritionist.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {nutritionist.specialty}
                      </p>

                    </div>

                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Submitted {nutritionist.submitted}
                  </p>

                  <div className="mt-4 flex gap-2">

                    <button className="flex-1 rounded-lg bg-[#3D5A4C] px-3 py-2 text-xs font-medium text-white hover:bg-[#2f4739]">
                      Review
                    </button>

                    <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-[#EB5757]">
                      Reject
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </section>


        </div>

      </main>

    </div>
  );
}