import type { AvailabilitySlot } from "@hospedex/contracts";

export const availabilityMock: AvailabilitySlot[] = [
  {
    roomId: "101",
    roomNumber: "101",
    roomTypeId: "std",
    roomTypeName: "Standard",
    date: "2026-07-01",
    status: "reserved",
    reservationId: "rsv-1",
    guestName: "Maria Silva"
  },
  {
    roomId: "102",
    roomNumber: "102",
    roomTypeId: "std",
    roomTypeName: "Standard",
    date: "2026-07-01",
    status: "free"
  },
  {
    roomId: "201",
    roomNumber: "201",
    roomTypeId: "lux",
    roomTypeName: "Luxo",
    date: "2026-07-01",
    status: "cleaning"
  },
  {
    roomId: "301",
    roomNumber: "301",
    roomTypeId: "mst",
    roomTypeName: "Master",
    date: "2026-07-01",
    status: "maintenance"
  }
];

export const timelineRooms = [
  {
    floor: "1o andar",
    rooms: [
      {
        room: "101",
        type: "Standard",
        state: "Limpo",
        reservation: {
          guest: "Marina Costa",
          code: "RSV-2026-000142",
          status: "Confirmada",
          channel: "Direto",
          start: 1,
          span: 3,
          tone: "bg-teal-600"
        }
      },
      {
        room: "102",
        type: "Standard",
        state: "Livre",
        reservation: {
          guest: "Livre para venda",
          code: "Inventario aberto",
          status: "Disponivel",
          channel: "HospedeX",
          start: 4,
          span: 2,
          tone: "bg-emerald-600"
        }
      },
      {
        room: "103",
        type: "Standard",
        state: "Sujo",
        reservation: {
          guest: "Paulo Mendes",
          code: "Checkout 11:00",
          status: "Saida hoje",
          channel: "Booking",
          start: 0,
          span: 2,
          tone: "bg-amber-500"
        }
      }
    ]
  },
  {
    floor: "2o andar",
    rooms: [
      {
        room: "201",
        type: "Luxo",
        state: "Limpeza",
        reservation: {
          guest: "Aline Rocha",
          code: "RSV-2026-000151",
          status: "Garantida",
          channel: "OTA",
          start: 2,
          span: 4,
          tone: "bg-indigo-600"
        }
      },
      {
        room: "202",
        type: "Luxo",
        state: "Inspecionado",
        reservation: {
          guest: "Grupo Orion",
          code: "Evento corporativo",
          status: "Bloqueio",
          channel: "Corporativo",
          start: 0,
          span: 5,
          tone: "bg-sky-600"
        }
      }
    ]
  },
  {
    floor: "3o andar",
    rooms: [
      {
        room: "301",
        type: "Master",
        state: "Manutencao",
        reservation: {
          guest: "Interditado",
          code: "Chamado #4582",
          status: "Manutencao",
          channel: "Governanca",
          start: 1,
          span: 2,
          tone: "bg-rose-600"
        }
      }
    ]
  }
];

export const arrivals = [
  { guest: "Marina Costa", room: "101", time: "14:00", balance: "Pago", tag: "VIP" },
  { guest: "Rafael Nunes", room: "Sem quarto", time: "15:30", balance: "R$ 420", tag: "Alocar" },
  { guest: "Grupo Orion", room: "202-206", time: "16:00", balance: "Faturado", tag: "Grupo" }
];

export const alerts = [
  { title: "2 reservas sem quarto alocado", detail: "Prioridade para chegadas de hoje" },
  { title: "1 quarto em manutencao bloqueando categoria Master", detail: "Impacto previsto no RevPAR" },
  { title: "Overbooking permitido ate 3% no Standard", detail: "Parametro ativo para alta demanda" }
];
