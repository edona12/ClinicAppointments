"use client";

import { useActionState } from "react";
import { addDoctorAction } from "@/lib/actions";
import { SPECIALTIES } from "@/lib/clinic";

export function AddDoctorForm() {
  const [state, action, pending] = useActionState(addDoctorAction, { error: "" });

  return (
    <form action={action} className="card grid gap-4 p-6 md:grid-cols-2">
      <h2 className="font-display text-2xl text-teal-950 md:col-span-2">Shto mjek të ri</h2>
      <label className="text-sm font-medium">
        Emri
        <input className="input mt-1" name="name" required placeholder="Dr. Emri Mbiemri" />
      </label>
      <label className="text-sm font-medium">
        Email
        <input className="input mt-1" name="email" type="email" required />
      </label>
      <label className="text-sm font-medium">
        Telefoni
        <input className="input mt-1" name="phone" />
      </label>
      <label className="text-sm font-medium">
        Specialiteti
        <select className="input mt-1" name="specialty" defaultValue={SPECIALTIES[0]}>
          {SPECIALTIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Vite përvojë
        <input className="input mt-1" name="experienceYears" type="number" min={1} defaultValue={5} />
      </label>
      <label className="text-sm font-medium">
        Fjalëkalimi i llogarisë
        <input className="input mt-1" name="password" type="password" required minLength={6} />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Edukimi
        <input className="input mt-1" name="education" placeholder="Specializim, universiteti..." />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Bio
        <textarea className="input mt-1 min-h-20" name="bio" />
      </label>
      {state.error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 md:col-span-2">{state.error}</p>
      ) : null}
      <button className="btn btn-primary h-11 md:col-span-2" disabled={pending} type="submit">
        {pending ? "Duke u ruajtur..." : "Ruaj mjekun"}
      </button>
    </form>
  );
}
