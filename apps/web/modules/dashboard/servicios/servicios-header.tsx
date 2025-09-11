import { IconHeartHandshake } from "@tabler/icons-react";

export function ServiciosHeader() {
    return (
      <div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">
            <IconHeartHandshake className="mr-2 inline-flex text-brand" /> Servicios</p>
          <p className="text-muted-foreground">
            Maneja todo tus servicios en un solo lugar.
          </p>
        </div>
      </div>
    );
  }
  