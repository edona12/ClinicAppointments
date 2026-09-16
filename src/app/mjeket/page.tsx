import { getDoctors } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DoctorsPage() {
  const doctors = getDoctors();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-teal-950">Ekipi mjekësor</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Zgjidhni mjekun sipas specialitetit. Pas hyrjes në llogari, mund të
        rezervoni orarin e lirë.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="card p-6">
            <p className="text-sm font-semibold text-teal-700">{doctor.specialty}</p>
            <h2 className="mt-1 font-display text-2xl text-teal-950">{doctor.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{doctor.bio}</p>
            <p className="mt-4 text-sm text-slate-500">
              {doctor.education} · {doctor.experienceYears} vite përvojë
            </p>
            <Link href={`/book?doctor=${doctor.id}`} className="btn btn-primary mt-5 h-10 px-4 text-sm">
              Rezervo te ky mjek
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
