import { AppointmentList } from "@/components/AppointmentList";
import { requireUser } from "@/lib/auth";
import { getAppointments } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const user = await requireUser(["patient"]);
  const params = await searchParams;
  const appointments = getAppointments({ patientId: user.id }).reverse();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Terminet e mia</h1>
      {params.ok ? (
        <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Termini u rezervua me sukses. Mjeku do ta konfirmojë së shpejti.
        </p>
      ) : null}
      <div className="mt-6">
        <AppointmentList appointments={appointments} mode="patient" />
      </div>
    </div>
  );
}
