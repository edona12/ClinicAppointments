export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(): string {
  return formatISODate(new Date());
}

export function addDays(iso: string, amount: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + amount);
  return formatISODate(date);
}

export function weekday(iso: string): number {
  return parseISODate(iso).getDay();
}

export function nextWeekdayISO(offset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return formatISODate(date);
}

export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("sq-AL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
  });
}

export function upcomingDates(count: number, allowedDays: number[]): string[] {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    const iso = formatISODate(cursor);
    if (allowedDays.includes(cursor.getDay()) && iso >= todayISO()) {
      dates.push(iso);
    }
    cursor.setDate(cursor.getDate() + 1);
    if (dates.length === 0 && cursor.getTime() - Date.now() > 60 * 24 * 60 * 60 * 1000) {
      break;
    }
  }

  return dates;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotMinutes: number,
): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  let minutes = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  while (minutes + slotMinutes <= end) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
    const minute = String(minutes % 60).padStart(2, "0");
    slots.push(`${hour}:${minute}`);
    minutes += slotMinutes;
  }

  return slots;
}

export function isPastSlot(date: string, time: string): boolean {
  const [hour, minute] = time.split(":").map(Number);
  const slot = parseISODate(date);
  slot.setHours(hour, minute, 0, 0);
  return slot.getTime() <= Date.now();
}
