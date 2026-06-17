import { Building2, Eye, Hotel, Lock, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@hospedex.com.br");
  const [password, setPassword] = useState("admin123");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim() && password.trim()) {
      localStorage.setItem("hospedex_session", JSON.stringify({ email, tenantId: "00000000-0000-0000-0000-000000000001" }));
      onLogin();
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.22),transparent_35%),linear-gradient(135deg,#020617,#0f172a_52%,#134e4a)]" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500">
              <Hotel className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">HospedeX Network</div>
              <div className="text-sm text-slate-300">Gestao hoteleira inteligente</div>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-teal-100">
              <Sparkles className="h-4 w-4" />
              PMS multi-tenant com IA operacional
            </div>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal">
              Operacao, reservas, recepcao e financeiro em uma unica plataforma.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Controle disponibilidade, check-in, governanca, PDV, consumo, relatorios e BI com rastreabilidade completa.
            </p>
          </div>

          <div className="grid max-w-3xl grid-cols-3 gap-3">
            {[
              ["74%", "ocupacao prevista"],
              ["18", "check-ins hoje"],
              ["R$ 286", "RevPAR"]
            ].map(([value, label]) => (
              <div className="rounded-lg border border-white/10 bg-white/10 p-4" key={label}>
                <div className="text-2xl font-semibold">{value}</div>
                <div className="mt-1 text-xs uppercase text-slate-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 text-slate-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Hotel className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">HospedeX Network</div>
                <div className="text-xs text-slate-500">Gestao hoteleira</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <Building2 className="h-3.5 w-3.5" />
              Hotel Centro
            </div>
            <h2 className="text-3xl font-semibold tracking-normal">Entrar no sistema</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Acesse a central operacional do HospedeX.</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">E-mail</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input className="pl-9" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Senha</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input className="pl-9 pr-9" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
                <Eye className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input className="h-4 w-4 rounded border-slate-300" type="checkbox" defaultChecked />
                Manter conectado
              </label>
              <button className="font-medium text-teal-700" type="button">Recuperar senha</button>
            </div>

            <Button className="w-full" type="submit">Entrar</Button>
          </form>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Usuario de desenvolvimento: <strong>admin@hospedex.com.br</strong><br />
            Senha: <strong>admin123</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
