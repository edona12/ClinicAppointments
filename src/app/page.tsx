import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { CLINIC, SERVICES } from "@/lib/clinic";
import { getDoctors } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const doctors = getDoctors();
  const bookHref = user?.role === "patient" ? "/book" : "/register";

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
            Klinikë moderne në Prishtinë
          </p>
          <h1 className="font-display text-4xl leading-tight text-teal-950 md:text-6xl">
            Rezervoni termin te mjeku, pa radhë.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            {CLINIC.name} ju ndihmon të zgjidhni mjekun, datën dhe orën e lirë për
            vizitë. Konfirmimi bëhet menjëherë, 24/7.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={bookHref} className="btn btn-primary h-12 px-6">
              Rezervo termin
            </Link>
            <Link href="/mjeket" className="btn btn-ghost h-12 px-6">
              Shiko mjekët
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <Stat value="6+" label="Specialitete" />
            <Stat value="30 min" label="Kohëzgjatja" />
            <Stat value="09–16:30" label="Orari" />
          </div>
        </div>
        <div className="card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-teal-100" />
          <p className="relative text-sm font-semibold uppercase tracking-wide text-teal-700">
            Si funksionon
          </p>
          <ol className="relative mt-5 space-y-4">
            {[
              "Hyni ose krijoni llogari pacienti",
              "Zgjidhni specialitetin dhe mjekun",
              "Merrni orarin e lirë dhe konfirmoni",
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-1 text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="relative mt-8 rounded-2xl bg-teal-800 p-5 text-teal-50">
            <p className="font-display text-xl">Kujdes i qetë, i organizuar.</p>
            <p className="mt-2 text-sm text-teal-100">
              {CLINIC.hours}. Adresa: {CLINIC.address}.
            </p>
          </div>
        </div>
      </section>

      <section id="sherbimet" className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="font-display text-3xl text-teal-950">Shërbimet tona</h2>
        <p className="mt-2 text-slate-600">
          Nga kontrolla e përgjithshme te specialitetet kryesore.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.title} className="card p-5">
              <h3 className="font-display text-xl text-teal-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-teal-950">Mjekët tanë</h2>
            <p className="mt-2 text-slate-600">Ekip me përvojë në specialitete të ndryshme.</p>
          </div>
          <Link href="/mjeket" className="hidden text-sm font-semibold text-teal-800 md:block">
            Të gjithë mjekët →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {doctors.slice(0, 3).map((doctor) => (
            <article key={doctor.id} className="card p-5">
              <Avatar name={doctor.name} />
              <h3 className="mt-4 font-display text-xl text-teal-950">{doctor.name}</h3>
              <p className="text-sm font-medium text-teal-700">{doctor.specialty}</p>
              <p className="mt-2 text-sm text-slate-600">{doctor.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="kontakti" className="mx-auto max-w-6xl px-4 py-10">
        <div className="card grid gap-6 bg-teal-900 p-8 text-white md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Gati për vizitë?</h2>
            <p className="mt-3 text-teal-100">
              Rezervoni tani ose na telefononi në {CLINIC.phone}.
            </p>
          </div>
          <div className="flex items-center md:justify-end">
            <Link href={bookHref} className="btn h-12 bg-white px-6 text-teal-900">
              Fillo rezervimin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl text-teal-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-lg font-bold text-teal-800">
      {initials}
    </div>
  );
}
