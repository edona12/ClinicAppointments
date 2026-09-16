"use client";

import { useState } from "react";
import { cancelAppointmentAction, setAppointmentStatusAction } from "@/lib/actions";
import { formatLongDate } from "@/lib/dates";
import { StatusBadge } from "@/components/StatusBadge";
import type { AppointmentStatus, AppointmentView } from "@/lib/types";

export function AppointmentList({
  appointments,
  mode,
}: {
  appointments: AppointmentView[];
  mode: "patient" | "staff";
}) {
  const [error, setError] = useState("");

  async function cancel(id: string) {
    const result = await cancelAppointmentAction(id);
    if (result.error) setError(result.error);
  }

  async function setStatus(id: string, status: AppointmentStatus) {
    const result = await setAppointmentStatusAction(id, status);
    if (result.error) setError(result.error);
  }

  if (appointments.length === 0) {
    return (
      <div className="card p-8 text-center text-slate-600">
        Nuk ka termine për t’u shfaqur.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {appointments.map((appointment) => (
        <article key={appointment.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl text-teal-950">
                {mode === "patient" ? appointment.doctorName : appointment.patientName}
              </p>
              <p className="text-sm text-teal-700">{appointment.specialty}</p>
              <p className="mt-2 text-sm text-slate-600">
                {formatLongDate(appointment.date)} · {appointment.time}
              </p>
              <p className="mt-1 text-sm text-slate-500">{appointment.reason}</p>
              {mode === "staff" ? (
                <p className="mt-1 text-sm text-slate-500">Tel: {appointment.patientPhone || "—"}</p>
              ) : null}
            </div>
            <StatusBadge status={appointment.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {mode === "patient" &&
            (appointment.status === "pending" || appointment.status === "confirmed") ? (
              <button className="btn btn-ghost h-9 px-3 text-sm" onClick={() => cancel(appointment.id)} type="button">
                Anulo
              </button>
            ) : null}
            {mode === "staff" && appointment.status === "pending" ? (
              <button
                className="btn btn-primary h-9 px-3 text-sm"
                onClick={() => setStatus(appointment.id, "confirmed")}
                type="button"
              >
                Konfirmo
              </button>
            ) : null}
            {mode === "staff" && appointment.status === "confirmed" ? (
              <button
                className="btn btn-primary h-9 px-3 text-sm"
                onClick={() => setStatus(appointment.id, "completed")}
                type="button"
              >
                Përfundo
              </button>
            ) : null}
            {mode === "staff" &&
            (appointment.status === "pending" || appointment.status === "confirmed") ? (
              <button className="btn btn-ghost h-9 px-3 text-sm" onClick={() => cancel(appointment.id)} type="button">
                Anulo
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
