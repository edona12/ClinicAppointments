import Link from "next/link";
import { AppointmentList } from "@/components/AppointmentList";
import { requireUser } from "@/lib/auth";
import { todayISO } from "@/lib/dates";
import { getAppointments } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser(["patient"]);
  const appointments = getAppointments({ patientId: user.id });
  const upcoming = appointments.filter(
    (item) => item.status !== "cancelled" && item.status !== "completed" && item.date >= todayISO(),
  );
  const next = upcoming[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-teal-700">Mirë se erdhe</p>
      <h1 className="font-display text-4xl text-teal-950">{user.name}</h1>
      <p className="mt-2 text-slate-600">Menaxhoni vizitat tuaja në një vend.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="card bg-teal-800 p-6 text-white md:col-span-2">
          <p className="text-sm text-teal-100">Termini i radhës</p>
          {next ? (
            <>
              <h2 className="mt-2 font-display text-3xl">{next.doctorName}</h2>
              <p className="mt-2 text-teal-100">
                {next.date} në {next.time} · {next.specialty}
              </p>
            </>
          ) : (
            <p className="mt-3 text-lg">Nuk keni termin të planifikuar.</p>
          )}
          <Link href="/book" className="btn mt-6 h-11 bg-white px-5 text-teal-900">
            Rezervo tani
          </Link>
        </article>
        <article className="card p-6">
          <p className="text-sm text-slate-500">Termine aktive</p>
          <p className="font-display mt-2 text-4xl text-teal-900">{upcoming.length}</p>
          <Link href="/appointments" className="mt-6 inline-block text-sm font-semibold text-teal-800">
            Shiko të gjitha →
          </Link>
        </article>
      </div>

      <h2 className="mt-10 font-display text-2xl text-teal-950">Termine të fundit</h2>
      <div className="mt-4">
        <AppointmentList appointments={appointments.slice(0, 4)} mode="patient" />
      </div>
    </div>
  );
}
