export type Role = "patient" | "doctor" | "admin";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: Role;
  createdAt: string;
};

export type Doctor = {
  id: string;
  userId: string;
  specialty: string;
  bio: string;
  education: string;
  experienceYears: number;
  workingDays: number[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type Database = {
  users: User[];
  doctors: Doctor[];
  appointments: Appointment[];
};

export type PublicUser = Omit<User, "passwordHash">;

export type DoctorWithUser = Doctor & {
  name: string;
  email: string;
  phone: string;
};

export type AppointmentView = Appointment & {
  patientName: string;
  patientPhone: string;
  doctorName: string;
  specialty: string;
};
