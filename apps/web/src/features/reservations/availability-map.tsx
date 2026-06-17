import { AvailabilitySlot } from "@hospedex/contracts";
import { cn } from "../../lib/utils";
import { statusClass, statusLabel } from "./status-style";

const dates = ["01 Jul", "02 Jul", "03 Jul", "04 Jul", "05 Jul", "06 Jul", "07 Jul"];

export function AvailabilityMap({ slots }: { slots: AvailabilitySlot[] }) {
  return (
    <div className="overflow-auto">
      <div className="min-w-[860px]">
        <div className="grid grid-cols-[160px_repeat(7,minmax(96px,1fr))] border-b border-border bg-muted/60 text-xs font-medium text-muted-foreground">
          <div className="px-4 py-3">Quarto</div>
          {dates.map((date) => (
            <div className="border-l border-border px-3 py-3 text-center" key={date}>
              {date}
            </div>
          ))}
        </div>
        {slots.map((slot) => (
          <div className="grid grid-cols-[160px_repeat(7,minmax(96px,1fr))] border-b border-border" key={slot.roomId}>
            <div className="px-4 py-3">
              <div className="text-sm font-semibold">{slot.roomNumber}</div>
              <div className="text-xs text-muted-foreground">{slot.roomTypeName}</div>
            </div>
            {dates.map((date, index) => (
              <div className="min-h-20 border-l border-border p-2" key={date}>
                {index === 0 ? (
                  <button
                    className={cn("h-full min-h-14 w-full rounded-md border px-2 py-2 text-left text-xs shadow-sm", statusClass[slot.status])}
                    draggable
                    type="button"
                  >
                    <span className="block font-semibold">{statusLabel[slot.status]}</span>
                    <span className="block truncate">{slot.guestName ?? "Disponivel"}</span>
                  </button>
                ) : (
                  <button className="h-full min-h-14 w-full rounded-md border border-dashed border-border text-xs text-muted-foreground" type="button">
                    Livre
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
