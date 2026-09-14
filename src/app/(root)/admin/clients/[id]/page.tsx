'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  Ban,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Mail,
  Phone,
  RotateCcw,
  Ruler,
  Scale,
  ShieldAlert,
  Target,
  UserRound,
  Utensils,
  Weight,
} from 'lucide-react';
import {
  getClient,
  updateClientStatus,
} from '@/app/libs/api/admin/clients';
type ClientStatus = 'Active' | 'Suspended' | 'Inactive';

type Appointment = {
  date: string;
  time: string;
  type: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  notes: string;
};

type ClientDetails = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  status: ClientStatus;
  joinedDate: string;

  assignedNutritionist: string | null;

  height: string;
  currentWeight: string;
  targetWeight: string;
  bmi: string;

  goal: string;
  goalDescription: string;

  medicalCondition: string;
  activityLevel: string;
  allergies: string;

  nutritionPlan: string;
  calories: string;
  dietType: string[];

  progress: {
    startingWeight: string;
    currentWeight: string;
    weightLost: string;
  };

  nextAppointment: {
    date: string;
    time: string;
  };

  appointments: Appointment[];

  nutritionistNotes: string;
};

const TEMPORARY_CLIENT_DETAILS: ClientDetails[] = [
  {
    id: '1',
    name: 'Sara Abebe',
    age: 28,
    gender: 'Female',
    phone: '+251 91 111 2233',
    email: 'sara.abebe@example.com',
    status: 'Active',
    joinedDate: 'Jan 12, 2026',
    assignedNutritionist: 'Dr. Hana Bekele',
    height: '168 cm',
    currentWeight: '69 kg',
    targetWeight: '64 kg',
    bmi: '24.4',
    goal: 'Weight Management',
    goalDescription: 'Gradual and sustainable weight loss while maintaining a balanced diet.',
    medicalCondition: 'Type 2 Diabetes',
    activityLevel: 'Moderate',
    allergies: 'Peanuts',
    nutritionPlan: 'High-Protein Balanced Diet',
    calories: '1,800 kcal/day',
    dietType: ['High Protein', 'Low Sugar', 'Fiber Rich'],
    progress: { startingWeight: '74 kg', currentWeight: '69 kg', weightLost: '5 kg' },
    nextAppointment: { date: 'Aug 24, 2026', time: '10:00 AM' },
    appointments: [
      { date: 'Aug 18, 2026', time: '10:00 AM', type: 'Follow-up Consultation', status: 'Completed', notes: 'Reviewed meal adherence and adjusted calorie target.' },
      { date: 'Aug 24, 2026', time: '10:00 AM', type: 'Nutrition Follow-up', status: 'Upcoming', notes: 'Review progress and update the current nutrition plan.' },
    ],
    nutritionistNotes: 'Sara has been consistently following her meal plan. Recommend increasing daily water intake.',
  },
  {
    id: '2',
    name: 'Mekdes Tadesse',
    age: 34,
    gender: 'Female',
    phone: '+251 92 222 3344',
    email: 'mekdes.t@example.com',
    status: 'Active',
    joinedDate: 'Feb 3, 2026',
    assignedNutritionist: 'Dr. Samuel Alemu',
    height: '162 cm',
    currentWeight: '71 kg',
    targetWeight: '66 kg',
    bmi: '27.1',
    goal: 'Diabetes Nutrition',
    goalDescription: 'Improve blood sugar management through a balanced meal plan.',
    medicalCondition: 'Type 2 Diabetes',
    activityLevel: 'Light',
    allergies: 'No known allergies',
    nutritionPlan: 'Diabetes-Friendly Meal Plan',
    calories: '1,700 kcal/day',
    dietType: ['Low Sugar', 'High Fiber', 'Balanced'],
    progress: { startingWeight: '75 kg', currentWeight: '71 kg', weightLost: '4 kg' },
    nextAppointment: { date: 'Aug 25, 2026', time: '2:00 PM' },
    appointments: [
      { date: 'Aug 19, 2026', time: '2:00 PM', type: 'Follow-up Consultation', status: 'Completed', notes: 'Reviewed blood sugar management and dietary adherence.' },
      { date: 'Aug 25, 2026', time: '2:00 PM', type: 'Nutrition Follow-up', status: 'Upcoming', notes: 'Review progress and adjust meal plan if necessary.' },
    ],
    nutritionistNotes: 'Responding well to the current meal plan. Continue monitoring carbohydrate intake.',
  },
  {
    id: '3',
    name: 'Abel Tesfaye',
    age: 25,
    gender: 'Male',
    phone: '+251 93 333 4455',
    email: 'abel.tesfaye@example.com',
    status: 'Suspended',
    joinedDate: 'Feb 20, 2026',
    assignedNutritionist: null,
    height: '175 cm',
    currentWeight: '82 kg',
    targetWeight: '76 kg',
    bmi: '26.8',
    goal: 'Muscle Gain',
    goalDescription: 'Build lean muscle mass through structured nutrition and training support.',
    medicalCondition: 'None',
    activityLevel: 'Active',
    allergies: 'Shellfish, Dairy',
    nutritionPlan: 'Not assigned',
    calories: 'Not set',
    dietType: [],
    progress: { startingWeight: '82 kg', currentWeight: '82 kg', weightLost: '0 kg' },
    nextAppointment: { date: 'Not scheduled', time: '' },
    appointments: [
      { date: 'Aug 1, 2026', time: '11:00 AM', type: 'Nutrition Consultation', status: 'Cancelled', notes: 'Client cancelled prior to account suspension.' },
    ],
    nutritionistNotes: 'Account suspended. No active nutritionist assigned.',
  },
  {
    id: '4',
    name: 'Rahel Girma',
    age: 31,
    gender: 'Female',
    phone: '+251 94 444 5566',
    email: 'rahel.girma@example.com',
    status: 'Active',
    joinedDate: 'Mar 8, 2026',
    assignedNutritionist: 'Dr. Meron Worku',
    height: '164 cm',
    currentWeight: '58 kg',
    targetWeight: '60 kg',
    bmi: '21.6',
    goal: 'Prenatal Nutrition',
    goalDescription: 'Support healthy pregnancy through balanced, nutrient-dense meals.',
    medicalCondition: 'Pregnancy (2nd trimester)',
    activityLevel: 'Light',
    allergies: 'No known allergies',
    nutritionPlan: 'Prenatal Balanced Plan',
    calories: '2,100 kcal/day',
    dietType: ['Gluten-Free', 'Iron Rich', 'Balanced'],
    progress: { startingWeight: '56 kg', currentWeight: '58 kg', weightLost: '0 kg (healthy gain)' },
    nextAppointment: { date: 'Tomorrow', time: '3:30 PM' },
    appointments: [
      { date: 'Aug 5, 2026', time: '3:30 PM', type: 'Prenatal Nutrition Check', status: 'Completed', notes: 'Reviewed iron and folate intake.' },
      { date: 'Tomorrow', time: '3:30 PM', type: 'Follow-up Consultation', status: 'Upcoming', notes: 'Routine prenatal nutrition follow-up.' },
    ],
    nutritionistNotes: 'Healthy progress for stage of pregnancy. Continue current supplementation.',
  },
];

function useClient(clientId: string) {
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadClient() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getClient(clientId);

        if (isMounted) {
          setClient(data);
        }
      } catch (err) {
        console.error('Unable to load client:', err);

        if (isMounted) {
          setClient(null);
          setError('Unable to load client.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (clientId) {
      loadClient();
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return { client, setClient, isLoading, error };
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = String(params.id);
  const {
  client,
  setClient,
  isLoading,
  error,
} = useClient(clientId);
const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
const [statusError, setStatusError] = useState<string | null>(null);
  async function toggleSuspend() {
  if (!client || isUpdatingStatus) return;

  const newStatus =
    client.status === 'Suspended'
      ? 'Active'
      : 'Suspended';

  setIsUpdatingStatus(true);
  setStatusError(null);

  try {
    const updatedClient = await updateClientStatus(
      client.id,
      newStatus
    );

    setClient(updatedClient);
  } catch (err) {
    console.error('Unable to update client status:', err);

    setStatusError('Unable to update client status.');
  } finally {
    setIsUpdatingStatus(false);
  }
}

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
            <UserRound size={21} />
          </div>
          <h2 className="font-display mt-4 text-[18px] text-[#2D312E]">Loading client...</h2>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#4E876E] hover:text-[#3D5A4C]">
          <ArrowLeft size={15} />
          Back to Clients
        </Link>
        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white px-6 py-12 text-center shadow-sm">
          <UserRound size={28} className="mx-auto text-[#4E876E]" />
          <h1 className="font-display mt-4 text-[20px] text-[#2D312E]">Client not found</h1>
          <p className="mt-2 text-[11px] text-[#2D312E]/60">The client profile you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#4E876E] transition hover:text-[#3D5A4C]">
        <ArrowLeft size={15} />
        Back to Clients
      </Link>

      {/* Client Header */}
      <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#3D5A4C]">
              <UserRound size={27} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[24px] text-[#2D312E]">{client.name}</h1>
                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                    client.status === 'Active'
                      ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                      : client.status === 'Suspended'
                      ? 'bg-red-50 text-red-500'
                      : 'bg-[#2D312E]/[0.06] text-[#2D312E]/60'
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#2D312E]/65">
                {client.age} years old · {client.gender} · Joined {client.joinedDate}
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-[#4E876E]" />
                  <span className="text-[10px] text-[#2D312E]/70">{client.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={12} className="text-[#4E876E]" />
                  <span className="text-[10px] text-[#2D312E]/70">{client.email}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSuspend}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-bold transition ${
              client.status === 'Suspended'
                ? 'bg-[#3D5A4C] text-white hover:bg-[#4E876E]'
                : 'border border-red-200 text-red-500 hover:bg-red-50'
            }`}
          >
            {client.status === 'Suspended' ? <RotateCcw size={14} /> : <Ban size={14} />}
            {client.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
          </button>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><Target size={17} /></div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/50">Goal</span>
          </div>
          <p className="font-display mt-4 text-[17px] text-[#2D312E]">{client.goal}</p>
          <p className="mt-1 text-[10px] leading-5 text-[#2D312E]/60">{client.goalDescription}</p>
        </div>

        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><Activity size={17} /></div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/50">BMI</span>
          </div>
          <p className="font-display mt-4 text-[24px] text-[#3D5A4C]">{client.bmi}</p>
          <p className="mt-1 text-[10px] text-[#2D312E]/60">Current body mass index</p>
        </div>

        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><Weight size={17} /></div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/50">Progress</span>
          </div>
          <p className="font-display mt-4 text-[24px] text-[#3D5A4C]">{client.progress.weightLost}</p>
          <p className="mt-1 text-[10px] text-[#2D312E]/60">Weight lost since starting</p>
        </div>

        <div className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><CalendarDays size={17} /></div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2D312E]/50">Next Visit</span>
          </div>
         <p className="font-display mt-4 text-[17px] text-[#2D312E]">
  {client.nextAppointment?.date || 'No appointment scheduled'}
</p>

<p className="mt-1 text-[10px] text-[#2D312E]/60">
  {client.nextAppointment?.time || ''}
</p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Health Overview */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><HeartPulse size={17} /></div>
              <div>
                <h2 className="font-display text-[18px] text-[#2D312E]">Health Overview</h2>
                <p className="text-[10px] text-[#2D312E]/60">Current health and lifestyle information</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FAF9F6] p-4">
                <div className="flex items-center gap-2">
                  <Ruler size={14} className="text-[#4E876E]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/55">Height</p>
                </div>
                <p className="font-display mt-2 text-[16px] text-[#2D312E]">{client.height}</p>
              </div>
              <div className="rounded-xl bg-[#FAF9F6] p-4">
                <div className="flex items-center gap-2">
                  <Scale size={14} className="text-[#4E876E]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/55">Current Weight</p>
                </div>
                <p className="font-display mt-2 text-[16px] text-[#2D312E]">{client.currentWeight}</p>
              </div>
              <div className="rounded-xl bg-[#FAF9F6] p-4">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-[#4E876E]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/55">Target Weight</p>
                </div>
                <p className="font-display mt-2 text-[16px] text-[#2D312E]">{client.targetWeight}</p>
              </div>
              <div className="rounded-xl bg-[#FAF9F6] p-4">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#4E876E]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/55">Activity Level</p>
                </div>
                <p className="font-display mt-2 text-[16px] text-[#2D312E]">{client.activityLevel}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#2D312E]/[0.06] p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Medical Condition</p>
                <p className="mt-2 text-[11px] font-semibold text-[#2D312E]/80">{client.medicalCondition}</p>
              </div>
              <div className={`rounded-xl border p-4 ${client.allergies !== 'No known allergies' ? 'border-red-200 bg-red-50/50' : 'border-[#2D312E]/[0.06]'}`}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Allergies</p>
                <p className={`mt-2 text-[11px] font-semibold ${client.allergies !== 'No known allergies' ? 'text-red-600' : 'text-[#2D312E]/80'}`}>
                  {client.allergies}
                </p>
              </div>
            </div>
          </section>

          {/* Weight Progress */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><Weight size={17} /></div>
              <div>
                <h2 className="font-display text-[18px] text-[#2D312E]">Weight Progress</h2>
                <p className="text-[10px] text-[#2D312E]/60">Client progress toward target weight</p>
              </div>
            </div>

            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Starting Weight</p>
                <p className="font-display mt-1 text-[20px] text-[#2D312E]">{client.progress.startingWeight}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Change</p>
                <p className="font-display mt-1 text-[20px] text-[#4E876E]">{client.progress.weightLost}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#2D312E]/50">Current</p>
                <p className="font-display mt-1 text-[20px] text-[#2D312E]">{client.progress.currentWeight}</p>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#E9F0EC]">
              <div className="h-full rounded-full bg-[#4E876E]" style={{ width: '62%' }} />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[9px] text-[#2D312E]/55">{client.progress.startingWeight}</span>
              <span className="text-[9px] text-[#2D312E]/55">Target {client.targetWeight}</span>
            </div>
          </section>

          {/* Appointments */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><CalendarDays size={17} /></div>
              <div>
                <h2 className="font-display text-[18px] text-[#2D312E]">Appointments</h2>
                <p className="text-[10px] text-[#2D312E]/60">Recent and upcoming appointments</p>
              </div>
            </div>

            <div className="space-y-3">
              {client.appointments.length === 0 ? (
                <p className="text-[11.5px] text-[#2D312E]/55">No appointments yet.</p>
              ) : (
                client.appointments.map((appointment, index) => (
                  <div key={`${appointment.date}-${index}`} className="rounded-xl border border-[#2D312E]/[0.06] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                            appointment.status === 'Upcoming' ? 'bg-[#E9F0EC] text-[#3D5A4C]' : 'bg-[#FAF9F6] text-[#2D312E]/55'
                          }`}
                        >
                          {appointment.status === 'Upcoming' ? <Clock3 size={14} /> : <CheckCircle2 size={14} />}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#2D312E]">{appointment.type}</p>
                          <p className="mt-1 text-[10px] text-[#2D312E]/60">{appointment.date} · {appointment.time}</p>
                        </div>
                      </div>
                      <span
                        className={`self-start rounded-full px-2.5 py-1 text-[9px] font-bold ${
                          appointment.status === 'Upcoming'
                            ? 'bg-[#E9F0EC] text-[#3D5A4C]'
                            : appointment.status === 'Cancelled'
                            ? 'bg-red-50 text-red-500'
                            : 'bg-[#FAF9F6] text-[#2D312E]/60'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="mt-3 border-t border-[#2D312E]/[0.05] pt-3 text-[10px] leading-5 text-[#2D312E]/65">
                      {appointment.notes}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Current Nutrition Plan */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><Utensils size={17} /></div>
              <div>
                <h2 className="font-display text-[18px] text-[#2D312E]">Current Nutrition Plan</h2>
                <p className="text-[10px] text-[#2D312E]/60">Assigned by nutritionist</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#E9F0EC] p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#3D5A4C]/70">Nutrition Plan</p>
              <h3 className="font-display mt-2 text-[17px] text-[#3D5A4C]">{client.nutritionPlan}</h3>
              <p className="mt-1 text-[10px] text-[#3D5A4C]/70">Daily target: {client.calories}</p>
            </div>

            {client.dietType.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {client.dietType.map((type) => (
                  <span key={type} className="rounded-full border border-[#CCD6C4] bg-white px-3 py-1.5 text-[9px] font-semibold text-[#3D5A4C]">
                    {type}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Nutritionist Notes — read-only for admin */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><FileText size={17} /></div>
              <div>
                <h2 className="font-display text-[18px] text-[#2D312E]">Nutritionist Notes</h2>
                <p className="text-[10px] text-[#2D312E]/60">Read-only — for oversight purposes</p>
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF9F6] p-4">
              <p className="text-[11px] leading-6 text-[#2D312E]/75">{client.nutritionistNotes}</p>
            </div>
          </section>

          {/* Account Actions */}
          <section className="rounded-2xl border border-[#2D312E]/[0.07] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]"><ShieldAlert size={17} /></div>
              <div>
                <h2 className="font-display text-[18px] text-[#2D312E]">Account Actions</h2>
                <p className="text-[10px] text-[#2D312E]/60">Manage this client's platform account</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSuspend}
              className="flex w-full items-center gap-3 rounded-xl border border-[#2D312E]/[0.07] px-4 py-3 text-left transition hover:bg-[#FAF9F6]"
            >
              {client.status === 'Suspended' ? (
                <RotateCcw size={15} className="text-[#4E876E]" />
              ) : (
                <Ban size={15} className="text-red-500" />
              )}
              <span className="text-[10px] font-semibold text-[#2D312E]/80">
                {client.status === 'Suspended' ? 'Reactivate account' : 'Suspend account'}
              </span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}