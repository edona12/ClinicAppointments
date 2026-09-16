import { requireUser } from "@/lib/auth";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser(["doctor"]);
  return children;
}
