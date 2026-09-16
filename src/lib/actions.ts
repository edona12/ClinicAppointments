"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearSession,
  createSession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import {
  createAppointment as saveAppointment,
  createDoctor as saveDoctor,
  createUser,
  getBookedTimes,
  getDoctorById,
  getDoctors as readDoctors,
  getUserByEmail,
  updateAppointmentStatus,
} from "@/lib/db";
import { generateTimeSlots, isPastSlot, todayISO, weekday } from "@/lib/dates";
import type { AppointmentStatus, DoctorWithUser } from "@/lib/types";

export type FormState = {
  error: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function refresh() {
  revalidatePath("/", "layout");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Plotësoni emailin dhe fjalëkalimin." };
  }

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Email ose fjalëkalimi janë gabim." };
  }

  await createSession(user.id);
  refresh();

  if (user.role === "admin") redirect("/admin");
  if (user.role === "doctor") redirect("/doctor");
  redirect("/dashboard");
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (name.length < 3) return { error: "Emri duhet të ketë të paktën 3 shkronja." };
  if (!EMAIL_RE.test(email)) return { error: "Email-i nuk është i vlefshëm." };
  if (password.length < 6) return { error: "Fjalëkalimi duhet të ketë të paktën 6 karaktere." };
  if (password !== confirm) return { error: "Fjalëkalimet nuk përputhen." };
  if (getUserByEmail(email)) return { error: "Ky email është tashmë i regjistruar." };

  const user = createUser({
    name,
    email,
    phone,
    passwordHash: hashPassword(password),
    role: "patient",
  });

  await createSession(user.id);
  refresh();
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  refresh();
  redirect("/");
}

export async function getDoctorsAction(): Promise<DoctorWithUser[]> {
  return readDoctors();
}

export async function getAvailableSlots(
  doctorId: string,
  date: string,
): Promise<string[]> {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];
  if (!doctor.workingDays.includes(weekday(date))) return [];
  if (date < todayISO()) return [];

  const booked = new Set(getBookedTimes(doctorId, date));
  return generateTimeSlots(doctor.startTime, doctor.endTime, doctor.slotMinutes).filter(
    (slot) => !booked.has(slot) && !isPastSlot(date, slot),
  );
}

export async function bookAppointmentAction(input: {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Duhet të hyni në llogari për të rezervuar." };
  if (user.role !== "patient") return { error: "Vetëm pacientët mund të rezervojnë termine." };

  const doctor = getDoctorById(input.doctorId);
  if (!doctor) return { error: "Mjeku nuk u gjet." };
  if (!doctor.workingDays.includes(weekday(input.date))) {
    return { error: "Mjeku nuk punon në këtë ditë." };
  }

  const slots = await getAvailableSlots(input.doctorId, input.date);
  if (!slots.includes(input.time)) {
    return { error: "Ky orar nuk është i lirë. Zgjidhni një tjetër." };
  }

  const reason = input.reason.trim();
  if (reason.length < 3) return { error: "Shkruani arsyen e vizitës." };

  saveAppointment({
    patientId: user.id,
    doctorId: input.doctorId,
    date: input.date,
    time: input.time,
    reason,
  });

  refresh();
  redirect("/appointments?ok=1");
}

export async function cancelAppointmentAction(id: string): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Nuk jeni i identifikuar." };

  const updated = updateAppointmentStatus(id, "cancelled", {
    userId: user.id,
    role: user.role,
  });
  if (!updated) return { error: "Termini nuk u anulua." };

  refresh();
  return { error: "" };
}

export async function setAppointmentStatusAction(
  id: string,
  status: AppointmentStatus,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "doctor" && user.role !== "admin")) {
    return { error: "Nuk keni të drejtë ta ndryshoni këtë termin." };
  }

  const updated = updateAppointmentStatus(id, status, {
    userId: user.id,
    role: user.role,
  });
  if (!updated) return { error: "Ndryshimi dështoi." };

  refresh();
  return { error: "" };
}

export async function addDoctorAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { error: "Vetëm administratori mund të shtojë mjekë." };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const specialty = String(formData.get("specialty") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const education = String(formData.get("education") || "").trim();
  const experienceYears = Number(formData.get("experienceYears") || 1);
  const password = String(formData.get("password") || "");

  if (name.length < 3) return { error: "Emri i mjekut është i shkurtër." };
  if (!EMAIL_RE.test(email)) return { error: "Email-i nuk është i vlefshëm." };
  if (getUserByEmail(email)) return { error: "Ky email është tashmë i përdorur." };
  if (!specialty) return { error: "Zgjidhni specialitetin." };
  if (password.length < 6) return { error: "Fjalëkalimi duhet të ketë të paktën 6 karaktere." };

  saveDoctor({
    name,
    email,
    phone,
    specialty,
    bio: bio || `Specialist i ${specialty.toLowerCase()}.`,
    education: education || "Fakulteti i Mjekësisë",
    experienceYears: Number.isFinite(experienceYears) ? experienceYears : 1,
    passwordHash: hashPassword(password),
  });

  refresh();
  redirect("/admin?added=1");
}
