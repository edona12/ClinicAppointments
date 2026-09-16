"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input className="input mt-1" name="email" type="email" required placeholder="ju@email.com" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Fjalëkalimi
        <input className="input mt-1" name="password" type="password" required />
      </label>
      {state.error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
      ) : null}
      <button className="btn btn-primary h-11 w-full" disabled={pending} type="submit">
        {pending ? "Duke hyrë..." : "Hyr"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Nuk keni llogari?{" "}
        <Link className="font-semibold text-teal-800" href="/register">
          Regjistrohuni
        </Link>
      </p>
    </form>
  );
}
