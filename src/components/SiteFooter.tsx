import { CLINIC } from "@/lib/clinic";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-teal-100 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-teal-900">{CLINIC.name}</p>
          <p className="mt-2 max-w-xs text-sm text-slate-600">{CLINIC.tagline}</p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-teal-900">Orari</p>
          <p className="mt-2">{CLINIC.hours}</p>
          <p className="mt-1">{CLINIC.address}</p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-teal-900">Kontakt</p>
          <p className="mt-2">{CLINIC.phone}</p>
          <p className="mt-1">{CLINIC.email}</p>
        </div>
      </div>
    </footer>
  );
}
