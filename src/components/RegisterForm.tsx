"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { error: "" });

  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Emri i plotë
        <input className="input mt-1" name="name" required placeholder="Emri Mbiemri" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input className="input mt-1" name="email" type="email" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Telefoni
        <input className="input mt-1" name="phone" placeholder="+383 44 ..." />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Fjalëkalimi
        <input className="input mt-1" name="password" type="password" required minLength={6} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Përsërit fjalëkalimin
        <input className="input mt-1" name="confirm" type="password" required minLength={6} />
      </label>
      {state.error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
      ) : null}
      <button className="btn btn-primary h-11 w-full" disabled={pending} type="submit">
        {pending ? "Duke u regjistruar..." : "Krijo llogari"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Keni llogari?{" "}
        <Link className="font-semibold text-teal-800" href="/login">
          Hyni
        </Link>
      </p>
    </form>
  );
}
