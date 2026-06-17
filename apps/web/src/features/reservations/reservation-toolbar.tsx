import { CalendarDays, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";

export function ReservationToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar hospede, quarto ou codigo" />
        </div>
        <Select defaultValue="all" aria-label="Categoria de quarto">
          <option value="all">Todas as categorias</option>
          <option value="std">Standard</option>
          <option value="lux">Luxo</option>
          <option value="mst">Master</option>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="grid grid-cols-4 rounded-md border border-border p-1 text-sm">
          {["Dia", "Semana", "15 dias", "Mes"].map((label, index) => (
            <button
              className={index === 1 ? "rounded-sm bg-primary px-3 py-1.5 text-primary-foreground" : "px-3 py-1.5 text-muted-foreground"}
              key={label}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <Button variant="outline">
          <CalendarDays className="h-4 w-4" />
          Periodo
        </Button>
        <Button>
          <Plus className="h-4 w-4" />
          Reserva
        </Button>
      </div>
    </div>
  );
}
