import { AddDoctorForm } from "@/components/AddDoctorForm";
import { AppointmentList } from "@/components/AppointmentList";
import { getAppointments, getDoctors, getStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const params = await searchParams;
  const stats = getStats();
  const doctors = getDoctors();
  const appointments = getAppointments();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Paneli i administratorit</h1>
      <p className="mt-2 text-slate-600">Statistika, mjekët dhe të gjitha terminet e klinikës.</p>

      {params.added ? (
        <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Mjeku u shtua. Ai mund të hyjë me emailin dhe fjalëkalimin e dhënë.
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Pacientë" value={stats.patients} />
        <Stat title="Mjekë" value={stats.doctors} />
        <Stat title="Termine sot" value={stats.today} />
        <Stat title="Në pritje" value={stats.pending} />
      </div>

      <h2 className="mt-10 font-display text-2xl text-teal-950">Mjekët</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="card p-5">
            <p className="font-display text-lg text-teal-950">{doctor.name}</p>
            <p className="text-sm text-teal-700">{doctor.specialty}</p>
            <p className="mt-2 text-sm text-slate-500">{doctor.email}</p>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <AddDoctorForm />
      </div>

      <h2 className="mt-10 font-display text-2xl text-teal-950">Të gjitha terminet</h2>
      <div className="mt-4">
        <AppointmentList appointments={appointments} mode="staff" />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <article className="card p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="font-display mt-1 text-3xl text-teal-900">{value}</p>
    </article>
  );
}
