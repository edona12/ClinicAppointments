import { AppointmentList } from "@/components/AppointmentList";
import { requireUser } from "@/lib/auth";
import { todayISO } from "@/lib/dates";
import { getAppointments, getDoctorByUserId } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DoctorPage() {
  const user = await requireUser(["doctor"]);
  const doctor = getDoctorByUserId(user.id);
  const appointments = doctor ? getAppointments({ doctorId: doctor.id }) : [];
  const today = todayISO();
  const todays = appointments.filter((item) => item.date === today && item.status !== "cancelled");
  const upcoming = appointments.filter(
    (item) => item.date >= today && item.status !== "cancelled" && item.status !== "completed",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Orari i mjekut</h1>
      <p className="mt-2 text-slate-600">
        {user.name}
        {doctor ? ` · ${doctor.specialty}` : ""}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="card p-5">
          <p className="text-sm text-slate-500">Sot</p>
          <p className="font-display mt-1 text-3xl text-teal-900">{todays.length}</p>
        </article>
        <article className="card p-5">
          <p className="text-sm text-slate-500">Në pritje / konfirmuar</p>
          <p className="font-display mt-1 text-3xl text-teal-900">{upcoming.length}</p>
        </article>
        <article className="card p-5">
          <p className="text-sm text-slate-500">Gjithsej</p>
          <p className="font-display mt-1 text-3xl text-teal-900">{appointments.length}</p>
        </article>
      </div>

      <h2 className="mt-10 font-display text-2xl text-teal-950">Terminet e sotme</h2>
      <div className="mt-4">
        <AppointmentList appointments={todays} mode="staff" />
      </div>
      <h2 className="mt-10 font-display text-2xl text-teal-950">Të gjitha terminet</h2>
      <div className="mt-4">
        <AppointmentList appointments={appointments} mode="staff" />
      </div>
    </div>
  );
}
