import { BookWizard } from "@/components/BookWizard";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Rezervo termin</h1>
      <p className="mt-2 text-slate-600">
        Zgjidhni specialitetin, mjekun dhe orarin e lirë. Termini ruhet si “në pritje”
        derisa ta konfirmojë mjeku.
      </p>
      <div className="mt-8">
        <BookWizard initialDoctorId={params.doctor} />
      </div>
    </div>
  );
}
