import type { RoomOperationalStatus } from "@hospedex/contracts";

export const statusLabel: Record<RoomOperationalStatus, string> = {
  free: "Livre",
  occupied: "Ocupado",
  reserved: "Reservado",
  cleaning: "Limpeza",
  inspected: "Inspecionado",
  maintenance: "Manutencao",
  blocked: "Bloqueado",
  out_of_order: "Interditado"
};

export const statusClass: Record<RoomOperationalStatus, string> = {
  free: "border-emerald-200 bg-emerald-50 text-emerald-900",
  occupied: "border-blue-200 bg-blue-50 text-blue-900",
  reserved: "border-amber-200 bg-amber-50 text-amber-900",
  cleaning: "border-cyan-200 bg-cyan-50 text-cyan-900",
  inspected: "border-teal-200 bg-teal-50 text-teal-900",
  maintenance: "border-rose-200 bg-rose-50 text-rose-900",
  blocked: "border-zinc-300 bg-zinc-100 text-zinc-800",
  out_of_order: "border-zinc-400 bg-zinc-200 text-zinc-900"
};
