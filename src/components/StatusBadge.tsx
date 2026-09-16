import { STATUS_LABEL } from "@/lib/clinic";
import type { AppointmentStatus } from "@/lib/types";

const styles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-teal-50 text-teal-800 border-teal-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
