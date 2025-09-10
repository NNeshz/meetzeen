import { IconCategory } from "@tabler/icons-react";

export function CategoriasHeader() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold"><IconCategory className="mr-2 inline-flex text-brand" /> Categorias</p>
        <p className="text-muted-foreground">
          Maneja todo tus categorias en un solo lugar.
        </p>
      </div>
    </div>
  );
}
