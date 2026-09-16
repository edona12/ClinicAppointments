"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bookAppointmentAction,
  getAvailableSlots,
  getDoctorsAction,
} from "@/lib/actions";
import { upcomingDates, formatShortDate } from "@/lib/dates";
import type { DoctorWithUser } from "@/lib/types";

const STEPS = ["Specialiteti", "Mjeku", "Data & ora", "Konfirmimi"];

export function BookWizard({ initialDoctorId }: { initialDoctorId?: string }) {
  const [doctors, setDoctors] = useState<DoctorWithUser[]>([]);
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState(initialDoctorId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    getDoctorsAction().then((list) => {
      setDoctors(list);
      if (initialDoctorId) {
        const match = list.find((doctor) => doctor.id === initialDoctorId);
        if (match) {
          setSpecialty(match.specialty);
          setDoctorId(match.id);
          setStep(3);
        }
      }
    });
  }, [initialDoctorId]);

  const specialties = useMemo(
    () => Array.from(new Set(doctors.map((doctor) => doctor.specialty))),
    [doctors],
  );
  const filteredDoctors = doctors.filter((doctor) => doctor.specialty === specialty);
  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
  const dates = selectedDoctor ? upcomingDates(10, selectedDoctor.workingDays) : [];

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      return;
    }
    getAvailableSlots(doctorId, date).then(setSlots);
  }, [doctorId, date]);

  async function submit() {
    setPending(true);
    setError("");
    const result = await bookAppointmentAction({ doctorId, date, time, reason });
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              step === index + 1 ? "bg-teal-700 text-white" : "bg-teal-50 text-teal-800"
            }`}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {specialties.map((item) => (
            <button
              key={item}
              className={`rounded-2xl border p-4 text-left ${
                specialty === item ? "border-teal-700 bg-teal-50" : "border-teal-100 bg-white"
              }`}
              onClick={() => {
                setSpecialty(item);
                setDoctorId("");
                setDate("");
                setTime("");
                setStep(2);
              }}
              type="button"
            >
              <p className="font-semibold text-teal-950">{item}</p>
            </button>
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          {filteredDoctors.map((doctor) => (
            <button
              key={doctor.id}
              className={`w-full rounded-2xl border p-4 text-left ${
                doctorId === doctor.id ? "border-teal-700 bg-teal-50" : "border-teal-100"
              }`}
              onClick={() => {
                setDoctorId(doctor.id);
                setDate("");
                setTime("");
                setStep(3);
              }}
              type="button"
            >
              <p className="font-display text-lg text-teal-950">{doctor.name}</p>
              <p className="text-sm text-slate-600">{doctor.bio}</p>
            </button>
          ))}
          <button className="text-sm font-semibold text-teal-800" onClick={() => setStep(1)} type="button">
            ← Ndrysho specialitetin
          </button>
        </div>
      ) : null}

      {step === 3 && selectedDoctor ? (
        <div>
          <p className="mb-3 font-medium text-teal-900">Zgjidhni datën</p>
          <div className="flex flex-wrap gap-2">
            {dates.map((item) => (
              <button
                key={item}
                className={`rounded-full px-3 py-2 text-sm ${
                  date === item ? "bg-teal-700 text-white" : "bg-teal-50 text-teal-900"
                }`}
                onClick={() => {
                  setDate(item);
                  setTime("");
                }}
                type="button"
              >
                {formatShortDate(item)}
              </button>
            ))}
          </div>
          {date ? (
            <>
              <p className="mb-3 mt-6 font-medium text-teal-900">Oraret e lira</p>
              {slots.length === 0 ? (
                <p className="text-sm text-slate-600">Nuk ka orare të lira për këtë ditë.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`rounded-xl border py-2 text-sm ${
                        time === slot ? "border-teal-700 bg-teal-700 text-white" : "border-teal-100"
                      }`}
                      onClick={() => {
                        setTime(slot);
                        setStep(4);
                      }}
                      type="button"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : null}
          <button className="mt-5 text-sm font-semibold text-teal-800" onClick={() => setStep(2)} type="button">
            ← Ndrysho mjekun
          </button>
        </div>
      ) : null}

      {step === 4 && selectedDoctor ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-teal-50 p-4 text-sm text-teal-950">
            <p>
              <strong>{selectedDoctor.name}</strong> · {selectedDoctor.specialty}
            </p>
            <p className="mt-1">
              {date} në {time}
            </p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Arsyeja e vizitës
            <textarea
              className="input mt-1 min-h-24"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="P.sh. kontrollë rutinë, dhimbje koke..."
            />
          </label>
          {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
          <div className="flex gap-3">
            <button className="btn btn-ghost h-11 px-4" onClick={() => setStep(3)} type="button">
              Kthehu
            </button>
            <button className="btn btn-primary h-11 px-5" disabled={pending} onClick={submit} type="button">
              {pending ? "Duke rezervuar..." : "Konfirmo termin"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
