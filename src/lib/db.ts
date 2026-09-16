import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/password";
import { nextWeekdayISO, todayISO } from "@/lib/dates";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentView,
  Database,
  Doctor,
  DoctorWithUser,
  User,
} from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const globalStore = globalThis as typeof globalThis & {
  klinikaDb?: Database;
};

function useMemoryStore(): boolean {
  return Boolean(process.env.VERCEL);
}

function createSeed(): Database {
  const createdAt = new Date().toISOString();
  const password = hashPassword("mjek123");
  const adminPassword = hashPassword("admin123");
  const patientPassword = hashPassword("pacient123");

  const admin: User = {
    id: randomUUID(),
    name: "Admin Vita",
    email: "admin@klinikavita.com",
    passwordHash: adminPassword,
    phone: "+383 44 100 100",
    role: "admin",
    createdAt,
  };

  const patient: User = {
    id: randomUUID(),
    name: "Elira Krasniqi",
    email: "pacient@klinikavita.com",
    passwordHash: patientPassword,
    phone: "+383 44 200 300",
    role: "patient",
    createdAt,
  };

  const doctorProfiles = [
    {
      name: "Dr. Erta Berisha",
      email: "erta.berisha@klinikavita.com",
      phone: "+383 44 111 201",
      specialty: "Kardiologji",
      bio: "Specialiste e sëmundjeve të zemrës, me fokus në parandalim dhe ndjekje afatgjatë.",
      education: "Universiteti i Prishtinës, specializim në Vjenë",
      experienceYears: 12,
    },
    {
      name: "Dr. Arben Gashi",
      email: "arben.gashi@klinikavita.com",
      phone: "+383 44 111 202",
      specialty: "Mjekësi e përgjithshme",
      bio: "Mjek familjar për kontrolla rutinë, analiza dhe këshillim shëndetësor.",
      education: "Fakulteti i Mjekësisë, Prishtinë",
      experienceYears: 9,
    },
    {
      name: "Dr. Lira Mustafa",
      email: "lira.mustafa@klinikavita.com",
      phone: "+383 44 111 203",
      specialty: "Pediatri",
      bio: "Kujdes i specializuar për fëmijë, vaksina dhe ndjekje të rritjes.",
      education: "Specializim në Pediatri, QKUK",
      experienceYears: 8,
    },
    {
      name: "Dr. Driton Hoxha",
      email: "driton.hoxha@klinikavita.com",
      phone: "+383 44 111 204",
      specialty: "Ortopedi",
      bio: "Trajtim i dëmtimeve të kyçeve, shtyllës kurrizore dhe rehabilitimit.",
      education: "Specializim në Ortopedi, Tiranë",
      experienceYears: 11,
    },
    {
      name: "Dr. Teuta Morina",
      email: "teuta.morina@klinikavita.com",
      phone: "+383 44 111 205",
      specialty: "Dermatologji",
      bio: "Diagnostikim dhe trajtim i sëmundjeve të lëkurës për të rritur dhe adoleshentë.",
      education: "Specializim në Dermatologji, Zagreb",
      experienceYears: 7,
    },
    {
      name: "Dr. Valon Krasniqi",
      email: "valon.krasniqi@klinikavita.com",
      phone: "+383 44 111 206",
      specialty: "Neurologji",
      bio: "Vlerësim i dhimbjeve të kokës, migrenës dhe çrregullimeve neurologjike.",
      education: "Specializim në Neurologji, Lubjanë",
      experienceYears: 10,
    },
  ];

  const users: User[] = [admin, patient];
  const doctors: Doctor[] = [];

  for (const profile of doctorProfiles) {
    const user: User = {
      id: randomUUID(),
      name: profile.name,
      email: profile.email,
      passwordHash: password,
      phone: profile.phone,
      role: "doctor",
      createdAt,
    };
    users.push(user);
    doctors.push({
      id: randomUUID(),
      userId: user.id,
      specialty: profile.specialty,
      bio: profile.bio,
      education: profile.education,
      experienceYears: profile.experienceYears,
      workingDays: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "16:30",
      slotMinutes: 30,
    });
  }

  const appointments: Appointment[] = [
    {
      id: randomUUID(),
      patientId: patient.id,
      doctorId: doctors[0].id,
      date: nextWeekdayISO(1),
      time: "10:00",
      reason: "Kontrollë rutinë e tensionit",
      status: "confirmed",
      createdAt,
    },
    {
      id: randomUUID(),
      patientId: patient.id,
      doctorId: doctors[1].id,
      date: nextWeekdayISO(3),
      time: "11:30",
      reason: "Rezultate analizash",
      status: "pending",
      createdAt,
    },
  ];

  return { users, doctors, appointments };
}

function ensureDb(): Database {
  if (useMemoryStore()) {
    if (!globalStore.klinikaDb) {
      globalStore.klinikaDb = createSeed();
    }
    return globalStore.klinikaDb;
  }

  const folder = path.dirname(DB_PATH);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as Database;
}

function writeDb(db: Database) {
  if (useMemoryStore()) {
    globalStore.klinikaDb = db;
    return;
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function getDb(): Database {
  return ensureDb();
}

export function getUserByEmail(email: string): User | undefined {
  return getDb().users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return getDb().users.find((user) => user.id === id);
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: User["role"];
}): User {
  const db = getDb();
  const user: User = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

export function getDoctors(): DoctorWithUser[] {
  const db = getDb();
  return db.doctors
    .map((doctor) => {
      const user = db.users.find((item) => item.id === doctor.userId);
      if (!user) return null;
      return {
        ...doctor,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
    })
    .filter((doctor): doctor is DoctorWithUser => doctor !== null);
}

export function getDoctorById(id: string): DoctorWithUser | undefined {
  return getDoctors().find((doctor) => doctor.id === id);
}

export function getDoctorByUserId(userId: string): DoctorWithUser | undefined {
  return getDoctors().find((doctor) => doctor.userId === userId);
}

export function createDoctor(input: {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  specialty: string;
  bio: string;
  education: string;
  experienceYears: number;
}): DoctorWithUser {
  const db = getDb();
  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    phone: input.phone,
    role: "doctor",
    createdAt: new Date().toISOString(),
  };
  const doctor: Doctor = {
    id: randomUUID(),
    userId: user.id,
    specialty: input.specialty,
    bio: input.bio,
    education: input.education,
    experienceYears: input.experienceYears,
    workingDays: [1, 2, 3, 4, 5],
    startTime: "09:00",
    endTime: "16:30",
    slotMinutes: 30,
  };
  db.users.push(user);
  db.doctors.push(doctor);
  writeDb(db);
  return {
    ...doctor,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}

function toAppointmentView(db: Database, appointment: Appointment): AppointmentView | null {
  const patient = db.users.find((user) => user.id === appointment.patientId);
  const doctor = db.doctors.find((item) => item.id === appointment.doctorId);
  const doctorUser = doctor
    ? db.users.find((user) => user.id === doctor.userId)
    : undefined;
  if (!patient || !doctor || !doctorUser) return null;
  return {
    ...appointment,
    patientName: patient.name,
    patientPhone: patient.phone,
    doctorName: doctorUser.name,
    specialty: doctor.specialty,
  };
}

export function getAppointments(filter?: {
  patientId?: string;
  doctorId?: string;
}): AppointmentView[] {
  const db = getDb();
  return db.appointments
    .filter((appointment) => {
      if (filter?.patientId && appointment.patientId !== filter.patientId) return false;
      if (filter?.doctorId && appointment.doctorId !== filter.doctorId) return false;
      return true;
    })
    .map((appointment) => toAppointmentView(db, appointment))
    .filter((appointment): appointment is AppointmentView => appointment !== null)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export function getBookedTimes(doctorId: string, date: string): string[] {
  return getDb()
    .appointments.filter(
      (appointment) =>
        appointment.doctorId === doctorId &&
        appointment.date === date &&
        appointment.status !== "cancelled",
    )
    .map((appointment) => appointment.time);
}

export function createAppointment(input: {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}): Appointment {
  const db = getDb();
  const appointment: Appointment = {
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...input,
  };
  db.appointments.push(appointment);
  writeDb(db);
  return appointment;
}

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  actor?: { userId: string; role: User["role"] },
): Appointment | null {
  const db = getDb();
  const appointment = db.appointments.find((item) => item.id === id);
  if (!appointment) return null;

  if (actor?.role === "patient" && appointment.patientId !== actor.userId) {
    return null;
  }
  if (actor?.role === "doctor") {
    const doctor = db.doctors.find((item) => item.userId === actor.userId);
    if (!doctor || appointment.doctorId !== doctor.id) return null;
  }

  appointment.status = status;
  writeDb(db);
  return appointment;
}

export function getStats() {
  const db = getDb();
  const today = todayISO();
  return {
    patients: db.users.filter((user) => user.role === "patient").length,
    doctors: db.doctors.length,
    appointments: db.appointments.length,
    pending: db.appointments.filter((item) => item.status === "pending").length,
    today: db.appointments.filter(
      (item) => item.date === today && item.status !== "cancelled",
    ).length,
  };
}
