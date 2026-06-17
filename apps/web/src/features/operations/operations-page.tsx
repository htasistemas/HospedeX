import {
  BadgeDollarSign,
  Banknote,
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
  PackageCheck,
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
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { alerts, arrivals, timelineRooms } from "../reservations/mock-data";

type ModuleKey =
  | "dashboard"
  | "reservations"
  | "frontdesk"
  | "housekeeping"
  | "maintenance"
  | "finance"
  | "pos"
  | "consumption"
  | "reports"
  | "bi"
  | "settings";

const navItems: Array<{ key: ModuleKey; label: string; icon: typeof Home }> = [
  { key: "dashboard", label: "Painel", icon: Home },
  { key: "reservations", label: "Reservas", icon: CalendarDays },
  { key: "frontdesk", label: "Recepcao", icon: UserRoundCheck },
  { key: "housekeeping", label: "Governanca", icon: ShieldCheck },
  { key: "maintenance", label: "Manutencao", icon: Wrench },
  { key: "finance", label: "Financeiro", icon: Receipt },
  { key: "pos", label: "PDV", icon: ShoppingCart },
  { key: "consumption", label: "Consumo", icon: PackageCheck },
  { key: "reports", label: "Relatorios", icon: ClipboardCheck },
  { key: "bi", label: "BI", icon: BarChart3 },
  { key: "settings", label: "Configuracoes", icon: Settings }
];

const days = ["Ter 01", "Qua 02", "Qui 03", "Sex 04", "Sab 05", "Dom 06", "Seg 07"];
const slotsPerDay = 2;

const moduleMeta: Record<ModuleKey, { title: string; subtitle: string; crumb: string }> = {
  dashboard: {
    title: "Painel executivo",
    subtitle: "Visao consolidada da operacao, receita, ocupacao e pendencias criticas.",
    crumb: "Painel"
  },
  reservations: {
    title: "Mapa de disponibilidade",
    subtitle: "Controle visual de quartos, reservas, bloqueios, lista de espera e movimentos de calendario.",
    crumb: "Reservas"
  },
  frontdesk: {
    title: "Central da recepcao",
    subtitle: "Check-in, check-out, contas, acompanhantes, veiculos e conferencias em uma fila operacional.",
    crumb: "Recepcao"
  },
  housekeeping: {
    title: "Governanca em tempo real",
    subtitle: "Status dos quartos, limpeza, inspecao, fotos, checklists e produtividade da equipe.",
    crumb: "Governanca"
  },
  maintenance: {
    title: "Manutencao e bloqueios",
    subtitle: "Chamados, prioridades, tecnicos, impacto em disponibilidade e historico por quarto.",
    crumb: "Manutencao"
  },
  finance: {
    title: "ERP financeiro",
    subtitle: "Contas a receber, contas a pagar, fluxo de caixa, bancos, PIX, boletos e indicadores.",
    crumb: "Financeiro"
  },
  pos: {
    title: "PDV integrado",
    subtitle: "Restaurante, bar, loja, conveniencia, room service e lancamento direto na conta do hospede.",
    crumb: "PDV"
  },
  consumption: {
    title: "Controle de consumo",
    subtitle: "Frigobar, estoque, servicos, inventarios, transferencias e baixa automatica.",
    crumb: "Consumo"
  },
  reports: {
    title: "Relatorios gerenciais",
    subtitle: "Relatorios operacionais, financeiros, estoque, governanca e exportacoes.",
    crumb: "Relatorios"
  },
  bi: {
    title: "Business Intelligence",
    subtitle: "KPIs hoteleiros, metas, comparativos, tendencias e analises automaticas por IA.",
    crumb: "BI"
  },
  settings: {
    title: "Configuracoes da plataforma",
    subtitle: "Perfis, permissoes, tenants, parametros operacionais, canais e integracoes.",
    crumb: "Configuracoes"
  }
};

const dashboardCards = [
  { label: "Ocupacao hoje", value: "74%", trend: "+6,2%", icon: BedDouble, color: "text-teal-700" },
  { label: "Receita prevista", value: "R$ 84,2 mil", trend: "+12,4%", icon: BadgeDollarSign, color: "text-indigo-700" },
  { label: "Check-ins", value: "18", trend: "7 pendentes", icon: UserRoundCheck, color: "text-sky-700" },
  { label: "Alertas criticos", value: "6", trend: "2 bloqueios", icon: Bell, color: "text-rose-700" }
];

const moduleData: Record<
  Exclude<ModuleKey, "dashboard" | "reservations">,
  {
    metrics: Array<{ label: string; value: string; trend: string }>;
    primaryTitle: string;
    primaryRows: Array<Record<string, string>>;
    secondaryTitle: string;
    secondaryRows: Array<{ title: string; detail: string; status: string }>;
  }
> = {
  frontdesk: {
    metrics: [
      { label: "Check-ins pendentes", value: "7", trend: "3 pre-check-in" },
      { label: "Check-outs hoje", value: "11", trend: "2 contas abertas" },
      { label: "Contas em conferencia", value: "4", trend: "R$ 2.840" },
      { label: "Documentos OCR", value: "86%", trend: "capturados" }
    ],
    primaryTitle: "Fila de atendimento",
    primaryRows: [
      { Hospede: "Rafael Nunes", Quarto: "A alocar", Fluxo: "Check-in completo", Status: "Documento pendente" },
      { Hospede: "Marina Costa", Quarto: "101", Fluxo: "Check-in rapido", Status: "Pronto" },
      { Hospede: "Grupo Orion", Quarto: "202-206", Fluxo: "Grupo", Status: "Rooming list" }
    ],
    secondaryTitle: "Conferencias automaticas",
    secondaryRows: [
      { title: "Frigobar 103", detail: "Consumo nao lancado no checkout", status: "Pendente" },
      { title: "Assinatura digital", detail: "2 fichas FNRH aguardando assinatura", status: "Acao" },
      { title: "Veiculos", detail: "1 placa sem associacao ao hospede", status: "Revisar" }
    ]
  },
  housekeeping: {
    metrics: [
      { label: "Quartos limpos", value: "42", trend: "68%" },
      { label: "Em limpeza", value: "9", trend: "tempo medio 23m" },
      { label: "Inspecoes", value: "14", trend: "3 reprovadas" },
      { label: "Produtividade", value: "91%", trend: "+4%" }
    ],
    primaryTitle: "Painel de quartos",
    primaryRows: [
      { Quarto: "103", Status: "Sujo", Responsavel: "Ana", SLA: "18 min" },
      { Quarto: "201", Status: "Limpeza", Responsavel: "Beatriz", SLA: "09 min" },
      { Quarto: "202", Status: "Inspecionado", Responsavel: "Carla", SLA: "OK" }
    ],
    secondaryTitle: "Checklists e fotos",
    secondaryRows: [
      { title: "Checklist luxo", detail: "2 itens de enxoval abaixo do padrao", status: "Corrigir" },
      { title: "Foto obrigatoria", detail: "Quarto 201 aguardando evidencia", status: "Pendente" },
      { title: "Prioridade recepcao", detail: "Quarto 102 liberado para chegada VIP", status: "OK" }
    ]
  },
  maintenance: {
    metrics: [
      { label: "Chamados abertos", value: "12", trend: "3 urgentes" },
      { label: "Quartos bloqueados", value: "4", trend: "R$ 3.180 impacto" },
      { label: "SLA medio", value: "1h42", trend: "-12 min" },
      { label: "Tecnicos ativos", value: "5", trend: "2 externos" }
    ],
    primaryTitle: "Chamados em execucao",
    primaryRows: [
      { Chamado: "#4582", Local: "301", Prioridade: "Alta", Tecnico: "Marcelo" },
      { Chamado: "#4586", Local: "Cozinha", Prioridade: "Media", Tecnico: "Joao" },
      { Chamado: "#4590", Local: "Piscina", Prioridade: "Baixa", Tecnico: "Equipe externa" }
    ],
    secondaryTitle: "Impacto operacional",
    secondaryRows: [
      { title: "Categoria Master", detail: "1 unidade fora de ordem ate 18:00", status: "Critico" },
      { title: "Preventiva ar-condicionado", detail: "8 quartos programados para quinta", status: "Agenda" },
      { title: "Pecas pendentes", detail: "Solicitacao de compra aprovada", status: "Compras" }
    ]
  },
  finance: {
    metrics: [
      { label: "Receita do dia", value: "R$ 31,8 mil", trend: "+9%" },
      { label: "A receber", value: "R$ 148 mil", trend: "R$ 18 mil vencido" },
      { label: "A pagar", value: "R$ 72 mil", trend: "prox. 7 dias" },
      { label: "Margem", value: "32%", trend: "+3,1%" }
    ],
    primaryTitle: "Fluxo de caixa",
    primaryRows: [
      { Data: "Hoje", Entradas: "R$ 31.820", Saidas: "R$ 12.480", Saldo: "R$ 19.340" },
      { Data: "Semana", Entradas: "R$ 184.600", Saidas: "R$ 96.200", Saldo: "R$ 88.400" },
      { Data: "Mes", Entradas: "R$ 742.000", Saidas: "R$ 504.000", Saldo: "R$ 238.000" }
    ],
    secondaryTitle: "Pendencias financeiras",
    secondaryRows: [
      { title: "Conciliação PIX", detail: "14 transacoes aguardando baixa", status: "Conciliar" },
      { title: "Empresa conveniada", detail: "Fatura Orion vence em 2 dias", status: "Monitorar" },
      { title: "DRE", detail: "Fechamento parcial disponivel", status: "Ver" }
    ]
  },
  pos: {
    metrics: [
      { label: "Vendas abertas", value: "23", trend: "8 mesas" },
      { label: "Room service", value: "11", trend: "4 em preparo" },
      { label: "Ticket medio", value: "R$ 86", trend: "+5%" },
      { label: "Lancado em quarto", value: "R$ 4.280", trend: "hoje" }
    ],
    primaryTitle: "Comandas ativas",
    primaryRows: [
      { Origem: "Mesa 12", Hospede: "Avulso", Total: "R$ 184", Status: "Aberta" },
      { Origem: "Quarto 101", Hospede: "Marina Costa", Total: "R$ 96", Status: "Lancada" },
      { Origem: "Room service", Hospede: "Aline Rocha", Total: "R$ 142", Status: "Em preparo" }
    ],
    secondaryTitle: "Setores",
    secondaryRows: [
      { title: "Restaurante", detail: "12 comandas e 3 mesas aguardando fechamento", status: "Ativo" },
      { title: "Bar", detail: "Estoque de gin abaixo do minimo", status: "Estoque" },
      { title: "Loja", detail: "2 vendas pendentes de emissao", status: "Fiscal" }
    ]
  },
  consumption: {
    metrics: [
      { label: "Frigobares conferidos", value: "38", trend: "72%" },
      { label: "Produtos criticos", value: "9", trend: "abaixo minimo" },
      { label: "Inventarios", value: "3", trend: "em aberto" },
      { label: "Baixas automaticas", value: "156", trend: "hoje" }
    ],
    primaryTitle: "Movimentacoes de estoque",
    primaryRows: [
      { Produto: "Agua 500ml", Entrada: "120", Saida: "86", Saldo: "214" },
      { Produto: "Chocolate", Entrada: "40", Saida: "32", Saldo: "18" },
      { Produto: "Vinho tinto", Entrada: "12", Saida: "7", Saldo: "9" }
    ],
    secondaryTitle: "Controles rigorosos",
    secondaryRows: [
      { title: "Frigobar 201", detail: "Reposicao solicitada apos limpeza", status: "Reposicao" },
      { title: "Transferencia bar", detail: "Baixa automatica aguardando conferencia", status: "Conferir" },
      { title: "Lavanderia", detail: "12 servicos lancados em contas", status: "OK" }
    ]
  },
  reports: {
    metrics: [
      { label: "Relatorios salvos", value: "28", trend: "6 favoritos" },
      { label: "Exportacoes", value: "17", trend: "PDF/Excel/CSV" },
      { label: "Agendados", value: "9", trend: "envio automatico" },
      { label: "Auditorias", value: "1.284", trend: "mes atual" }
    ],
    primaryTitle: "Central de relatorios",
    primaryRows: [
      { Relatorio: "Ocupacao diaria", Area: "Operacional", Formatos: "PDF, Excel", Status: "Disponivel" },
      { Relatorio: "DRE gerencial", Area: "Financeiro", Formatos: "Excel", Status: "Processado" },
      { Relatorio: "Giro de estoque", Area: "Estoque", Formatos: "CSV", Status: "Disponivel" }
    ],
    secondaryTitle: "Insights de relatorio",
    secondaryRows: [
      { title: "Cancelamentos", detail: "Alta de 4% no canal OTA", status: "Analisar" },
      { title: "Governanca", detail: "Tempo medio de limpeza caiu 8 minutos", status: "OK" },
      { title: "Estoque", detail: "Produtos criticos concentrados no bar", status: "Acao" }
    ]
  },
  bi: {
    metrics: [
      { label: "ADR", value: "R$ 386", trend: "+7%" },
      { label: "RevPAR", value: "R$ 286", trend: "+8,1%" },
      { label: "TRevPAR", value: "R$ 421", trend: "+11%" },
      { label: "GOPPAR", value: "R$ 142", trend: "+5,4%" }
    ],
    primaryTitle: "KPIs hoteleiros",
    primaryRows: [
      { KPI: "Ocupacao", Atual: "74%", Meta: "78%", Tendencia: "Subindo" },
      { KPI: "Receita por canal", Atual: "Direto 42%", Meta: "45%", Tendencia: "Estavel" },
      { KPI: "Luxo rentabilidade", Atual: "R$ 512", Meta: "R$ 490", Tendencia: "Acima" }
    ],
    secondaryTitle: "Analises automaticas",
    secondaryRows: [
      { title: "Ocupacao caiu 12%", detail: "Comparado ao mesmo periodo do mes anterior", status: "Investigar" },
      { title: "RevPAR aumentou 8%", detail: "Apos ajuste tarifario no fim de semana", status: "Positivo" },
      { title: "Categoria Luxo", detail: "Melhor rentabilidade entre as categorias", status: "Oportunidade" }
    ]
  },
  settings: {
    metrics: [
      { label: "Perfis ativos", value: "12", trend: "RBAC" },
      { label: "Usuarios", value: "84", trend: "7 online" },
      { label: "Tenants", value: "3", trend: "multi-unidade" },
      { label: "Integracoes", value: "9", trend: "2 pendentes" }
    ],
    primaryTitle: "Parametros da plataforma",
    primaryRows: [
      { Parametro: "Overbooking Standard", Valor: "3%", Escopo: "Hotel Centro", Status: "Ativo" },
      { Parametro: "Check-in digital", Valor: "Obrigatorio", Escopo: "Todos", Status: "Ativo" },
      { Parametro: "Auditoria", Valor: "Completa", Escopo: "Todos", Status: "Ativo" }
    ],
    secondaryTitle: "Seguranca e acesso",
    secondaryRows: [
      { title: "Perfil recepcao", detail: "Sem permissao para overbooking", status: "OK" },
      { title: "Financeiro", detail: "2 usuarios aguardando MFA", status: "Acao" },
      { title: "Logs", detail: "Retencao configurada para 5 anos", status: "OK" }
    ]
  }
};

export function OperationsPage() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("reservations");
  const meta = moduleMeta[activeModule];
  const dashboardMode = activeModule === "dashboard";

  const aiText = useMemo(() => {
    if (activeModule === "finance") return "Inadimplencia concentrada em 2 empresas. Recomendo bloqueio automatico de novo faturamento.";
    if (activeModule === "housekeeping") return "Quartos 102 e 202 devem ser priorizados para chegadas VIP das 15:30.";
    if (activeModule === "bi") return "Categoria Luxo tem melhor GOPPAR. Sugestao: elevar exposicao no motor de reservas.";
    return "Ocupacao de luxo acima da media. Sugestao: elevar tarifa em 6% no fim de semana.";
  }, [activeModule]);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="grid h-screen lg:grid-cols-[264px_1fr]">
        <aside className="hidden h-screen border-r border-slate-200 bg-slate-950 text-white lg:sticky lg:top-0 lg:flex lg:flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500">
              <Hotel className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">HospedeX Network</div>
              <div className="text-xs text-slate-400">Operacao hoteleira</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => (
              <button
                className={
                  activeModule === item.key
                    ? "flex h-10 w-full items-center gap-3 rounded-md bg-white px-3 text-sm font-medium text-slate-950"
                    : "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                }
                key={item.key}
                onClick={() => setActiveModule(item.key)}
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
              <p className="mt-2 text-xs leading-5 text-slate-400">{aiText}</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 overflow-y-auto">
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
                <Input className="max-w-xl border-slate-200 bg-slate-50 pl-9" placeholder="Buscar reserva, hospede, empresa, quarto, produto ou titulo" />
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
            <div className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 lg:hidden">
              {navItems.map((item) => (
                <button
                  className={
                    activeModule === item.key
                      ? "h-9 shrink-0 rounded-md bg-slate-950 px-3 text-sm font-medium text-white"
                      : "h-9 shrink-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600"
                  }
                  key={item.key}
                  onClick={() => setActiveModule(item.key)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-5 p-4 lg:p-6">
            <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>Operacao</span>
                  <span>/</span>
                  <span className="font-medium text-slate-800">{meta.crumb}</span>
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">{meta.title}</h1>
                <p className="mt-1 max-w-3xl text-sm text-slate-600">{meta.subtitle}</p>
              </div>
              <ModuleActions activeModule={activeModule} />
            </section>

            {dashboardMode ? <DashboardContent /> : activeModule === "reservations" ? <ReservationsContent /> : <GenericModuleContent data={moduleData[activeModule]} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function ModuleActions({ activeModule }: { activeModule: ModuleKey }) {
  if (activeModule === "reservations") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">Enviar link</Button>
        <Button variant="outline">Grupo</Button>
        <Button>
          <CalendarDays className="h-4 w-4" />
          Nova reserva
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline">Exportar</Button>
      <Button variant="outline">Filtros</Button>
      <Button>Nova acao</Button>
    </div>
  );
}

function DashboardContent() {
  return (
    <>
      <MetricGrid metrics={dashboardCards} />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Resumo operacional</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Reservas confirmadas", "Quartos para limpeza", "Receita em aberto"].map((title, index) => (
              <div className="rounded-md bg-slate-50 p-4" key={title}>
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-2 text-2xl font-semibold">{["126", "18", "R$ 148 mil"][index]}</div>
                <div className="mt-1 text-xs text-slate-500">{["+8 hoje", "5 prioridades", "12% vencido"][index]}</div>
              </div>
            ))}
          </div>
        </div>
        <InsightPanel title="Alertas inteligentes" rows={alerts.map((alert) => ({ ...alert, status: "IA" }))} />
      </section>
    </>
  );
}

function ReservationsContent() {
  const metrics = [
    { label: "Ocupacao", value: "74%", trend: "+6,2%", icon: BedDouble, color: "text-teal-700" },
    { label: "Check-ins hoje", value: "18", trend: "7 pendentes", icon: ClipboardCheck, color: "text-sky-700" },
    { label: "RevPAR", value: "R$ 286", trend: "+8,1%", icon: BadgeDollarSign, color: "text-indigo-700" },
    { label: "Lista de espera", value: "5", trend: "2 VIP", icon: Users, color: "text-amber-700" }
  ];

  return (
    <>
      <MetricGrid metrics={metrics} />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TimelineCalendar />
        <aside className="space-y-5">
          <ArrivalsPanel />
          <InsightPanel title="Alertas inteligentes" rows={alerts.map((alert) => ({ ...alert, status: "IA" }))} />
        </aside>
      </section>
    </>
  );
}

function GenericModuleContent({ data }: { data: (typeof moduleData)[Exclude<ModuleKey, "dashboard" | "reservations">] }) {
  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={metric.label}>
            <div className="text-sm text-slate-500">{metric.label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-normal">{metric.value}</div>
            <div className="mt-2 text-xs font-medium text-slate-500">{metric.trend}</div>
          </div>
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DataTable title={data.primaryTitle} rows={data.primaryRows} />
        <InsightPanel title={data.secondaryTitle} rows={data.secondaryRows} />
      </section>
    </>
  );
}

function MetricGrid({ metrics }: { metrics: Array<{ label: string; value: string; trend: string; icon: typeof Home; color: string }> }) {
  return (
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
  );
}

function TimelineCalendar() {
  return (
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
              <div className="border-l border-slate-200 px-2 py-2 text-center" key={day}>
                <div className="text-xs font-semibold uppercase text-slate-500">{day}</div>
                <div className="mt-1 grid grid-cols-2 overflow-hidden rounded border border-slate-200 bg-white text-[10px] font-medium uppercase text-slate-400">
                  <span className="border-r border-slate-200 py-1">ate 12h</span>
                  <span className="py-1">apos 13h</span>
                </div>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold">{room.room}</div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{room.type}</div>
                      <div className="text-xs text-slate-500">{room.state}</div>
                    </div>
                  </div>
                  {days.map((day, dayIndex) => {
                    const startSlot = room.reservation.startSlot ?? room.reservation.start * slotsPerDay + 1;
                    const spanSlots = room.reservation.spanSlots ?? Math.max(1, room.reservation.span * slotsPerDay - 1);
                    const dayStartSlot = dayIndex * slotsPerDay;
                    const dayEndSlot = dayStartSlot + slotsPerDay;
                    const isStart = startSlot >= dayStartSlot && startSlot < dayEndSlot;
                    const isInside = startSlot < dayEndSlot && startSlot + spanSlots > dayStartSlot;
                    const leftOffset = isStart ? (startSlot - dayStartSlot) * 50 : 0;
                    const visibleSlotsFromThisDay = Math.min(startSlot + spanSlots, days.length * slotsPerDay) - Math.max(startSlot, dayStartSlot);
                    const widthPercent = visibleSlotsFromThisDay * 50;
                    return (
                      <div className="relative min-h-20 border-l border-slate-200 p-2" key={day}>
                        <div className="absolute inset-y-2 left-1/2 border-l border-dashed border-slate-200" />
                        {isStart ? (
                          <button
                            className={`${room.reservation.tone} absolute top-3 z-10 h-14 rounded-md px-3 text-left text-xs text-white shadow-md`}
                            style={{
                              left: `calc(${leftOffset}% + 0.5rem)`,
                              width: `calc(${widthPercent}% - 1rem)`
                            }}
                            type="button"
                          >
                            <span className="block truncate font-semibold">{room.reservation.guest}</span>
                            <span className="block truncate opacity-90">{room.reservation.code}</span>
                            <span className="mt-1 inline-flex rounded bg-white/20 px-1.5 py-0.5">{room.reservation.status}</span>
                          </button>
                        ) : null}
                        {!isInside ? (
                          <div className="grid h-full grid-cols-2 gap-1">
                            <div className="rounded-md border border-dashed border-slate-200 bg-slate-50/60" />
                            <div className="rounded-md border border-dashed border-slate-200 bg-slate-50/60" />
                          </div>
                        ) : null}
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
  );
}

function DataTable({ title, rows }: { title: string; rows: Array<Record<string, string>> }) {
  const columns = Object.keys(rows[0] ?? {});
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button size="sm" variant="outline">Abrir modulo</Button>
      </div>
      <div className="overflow-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th className="border-b border-slate-200 px-4 py-3 font-semibold" key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr className="hover:bg-slate-50" key={`${title}-${index}`}>
                {columns.map((column) => (
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700" key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArrivalsPanel() {
  return (
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
                <div className="mt-1 text-xs text-slate-500">{arrival.time} - {arrival.room}</div>
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
  );
}

function InsightPanel({ title, rows }: { title: string; rows: Array<{ title: string; detail: string; status: string }> }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div className="rounded-md bg-slate-50 p-3" key={row.title}>
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold">{row.title}</div>
              <span className="rounded bg-white px-2 py-1 text-xs font-medium text-slate-600">{row.status}</span>
            </div>
            <div className="mt-1 text-xs leading-5 text-slate-500">{row.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
