import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
      <div className="pt-4">
        <h1 className="font-display text-4xl text-teal-950">Hyni në llogari</h1>
        <p className="mt-3 text-slate-600">
          Pacientët rezervojnë termine, mjekët shohin orarin, administratori
          menaxhon klinikën.
        </p>
        <div className="card mt-8 p-5 text-sm text-slate-600">
          <p className="font-semibold text-teal-900">Llogari demo</p>
          <ul className="mt-3 space-y-2">
            <li>Pacient: pacient@klinikavita.com / pacient123</li>
            <li>Mjek: erta.berisha@klinikavita.com / mjek123</li>
            <li>Admin: admin@klinikavita.com / admin123</li>
          </ul>
        </div>
      </div>
      <div className="card p-6 md:p-8">
        <LoginForm />
      </div>
    </div>
  );
}
