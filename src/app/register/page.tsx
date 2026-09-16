import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-4xl text-teal-950">Krijoni llogari pacienti</h1>
      <p className="mt-3 text-slate-600">
        Pas regjistrimit mund të rezervoni termin te mjeku që ju nevojitet.
      </p>
      <div className="card mt-8 p-6 md:p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
