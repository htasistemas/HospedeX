import {
  BadgeDollarSign,
  BarChart3,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Home,
  Hotel,
  LogOut,
  Menu,
  MessageSquareText,
  PanelLeft,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  UserRoundCheck,
  Users,
  Wrench
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { alerts, arrivals, timelineRooms } from "./mock-data";

const metrics = [
  { label: "Ocupacao", value: "74%", trend: "+6,2%", icon: BedDouble, color: "text-teal-700" },
  { label: "Check-ins hoje", value: "18", trend: "7 pendentes", icon: ClipboardCheck, color: "text-sky-700" },
  { label: "RevPAR", value: "R$ 286", trend: "+8,1%", icon: BadgeDollarSign, color: "text-indigo-700" },
  { label: "Lista de espera", value: "5", trend: "2 VIP", icon: Users, color: "text-amber-700" }
];

const navItems = [
  { label: "Painel", icon: Home },
  { label: "Reservas", icon: CalendarDays, active: true },
  { label: "Recepcao", icon: UserRoundCheck },
  { label: "Governanca", icon: ShieldCheck },
  { label: "Manutencao", icon: Wrench },
  { label: "Financeiro", icon: Receipt },
  { label: "PDV", icon: ShoppingCart },
  { label: "BI", icon: BarChart3 },
  { label: "Configuracoes", icon: Settings }
];

const days = ["Ter 01", "Qua 02", "Qui 03", "Sex 04", "Sab 05", "Dom 06", "Seg 07"];

export function ReservationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[264px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500">
              <Hotel className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">HospedeX Network</div>
              <div className="text-xs text-slate-400">Operacao hoteleira</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <button
                className={
                  item.active
                    ? "flex h-10 w-full items-center gap-3 rounded-md bg-white px-3 text-sm font-medium text-slate-950"
                    : "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                }
                key={item.label}
                type="button"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-teal-300" />
                IA operacional
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Ocupacao de luxo acima da media. Sugestao: elevar tarifa em 6% no fim de semana.
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
              <Button className="lg:hidden" size="icon" variant="outline" aria-label="Abrir menu">
                <Menu className="h-4 w-4" />
              </Button>
              <Button className="hidden lg:inline-flex" size="icon" variant="ghost" aria-label="Recolher menu">
                <PanelLeft className="h-4 w-4" />
              </Button>
              <div className="relative hidden flex-1 sm:block">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input className="max-w-xl border-slate-200 bg-slate-50 pl-9" placeholder="Buscar reserva, hospede, empresa, quarto ou placa" />
              </div>
              <Button variant="outline">
                <Building2 className="h-4 w-4" />
                Hotel Centro
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Notificacoes">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="space-y-5 p-4 lg:p-6">
            <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>Operacao</span>
                  <span>/</span>
                  <span className="font-medium text-slate-800">Reservas</span>
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">Mapa de disponibilidade</h1>
                <p className="mt-1 max-w-3xl text-sm text-slate-600">
                  Controle visual de quartos, reservas, bloqueios, lista de espera e movimentos de calendario.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <MessageSquareText className="h-4 w-4" />
                  Enviar link
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4" />
                  Grupo
                </Button>
                <Button>
                  <CalendarDays className="h-4 w-4" />
                  Nova reserva
                </Button>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={metric.label}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-500">{metric.label}</div>
                      <div className="mt-2 text-3xl font-semibold tracking-normal">{metric.value}</div>
                      <div className="mt-2 text-xs font-medium text-slate-500">{metric.trend}</div>
                    </div>
                    <div className="rounded-md bg-slate-100 p-2">
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {["Dia", "Semana", "Quinzena", "Mes"].map((item, index) => (
                      <button
                        className={
                          index === 1
                            ? "h-9 rounded-md bg-slate-950 px-3 text-sm font-medium text-white"
                            : "h-9 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        }
                        key={item}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">Categoria: todas</Button>
                    <Button variant="outline">Status: ativos</Button>
                    <Button variant="outline">01-07 Jul</Button>
                  </div>
                </div>

                <div className="overflow-auto">
                  <div className="min-w-[980px]">
                    <div className="grid grid-cols-[180px_repeat(7,minmax(104px,1fr))] border-b border-slate-200 bg-slate-50">
                      <div className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Quarto</div>
                      {days.map((day) => (
                        <div className="border-l border-slate-200 px-3 py-3 text-center text-xs font-semibold uppercase text-slate-500" key={day}>
                          {day}
                        </div>
                      ))}
                    </div>

                    {timelineRooms.map((group) => (
                      <div key={group.floor}>
                        <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase text-slate-500">
                          {group.floor}
                        </div>
                        {group.rooms.map((room) => (
                          <div className="grid grid-cols-[180px_repeat(7,minmax(104px,1fr))] border-b border-slate-200" key={room.room}>
                            <div className="flex items-center gap-3 px-4 py-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold">
                                {room.room}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">{room.type}</div>
                                <div className="text-xs text-slate-500">{room.state}</div>
                              </div>
                            </div>
                            {days.map((day, dayIndex) => {
                              const isStart = dayIndex === room.reservation.start;
                              const isInside =
                                dayIndex >= room.reservation.start && dayIndex < room.reservation.start + room.reservation.span;
                              return (
                                <div className="relative min-h-20 border-l border-slate-200 p-2" key={day}>
                                  {isStart ? (
                                    <button
                                      className={`${room.reservation.tone} absolute left-2 top-3 z-10 h-14 rounded-md px-3 text-left text-xs text-white shadow-md`}
                                      style={{ width: `calc(${room.reservation.span * 100}% - 1rem)` }}
                                      type="button"
                                    >
                                      <span className="block truncate font-semibold">{room.reservation.guest}</span>
                                      <span className="block truncate opacity-90">{room.reservation.code}</span>
                                      <span className="mt-1 inline-flex rounded bg-white/20 px-1.5 py-0.5">{room.reservation.status}</span>
                                    </button>
                                  ) : null}
                                  {!isInside ? <div className="h-full rounded-md border border-dashed border-slate-200 bg-slate-50/60" /> : null}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Chegadas de hoje</h2>
                    <Button size="sm" variant="ghost">Ver todas</Button>
                  </div>
                  <div className="mt-3 space-y-3">
                    {arrivals.map((arrival) => (
                      <div className="rounded-md border border-slate-200 p-3" key={`${arrival.guest}-${arrival.time}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{arrival.guest}</div>
                            <div className="mt-1 text-xs text-slate-500">{arrival.time} · {arrival.room}</div>
                          </div>
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{arrival.tag}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-teal-600" />
                          {arrival.balance}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-semibold">Alertas inteligentes</h2>
                  <div className="mt-3 space-y-3">
                    {alerts.map((alert) => (
                      <div className="rounded-md bg-slate-50 p-3" key={alert.title}>
                        <div className="text-sm font-semibold">{alert.title}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">{alert.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
