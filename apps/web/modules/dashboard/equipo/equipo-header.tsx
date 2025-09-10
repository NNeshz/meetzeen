import { IconUserCog } from "@tabler/icons-react";

export function EquipoHeader() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold"><IconUserCog className="mr-2 inline-flex text-brand" /> Equipo</p>
        <p className="text-muted-foreground">
          Maneja todo tu equipo en un solo lugar.
        </p>
      </div>
    </div>
  );
}
