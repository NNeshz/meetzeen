import { Input } from "@meetzeen/ui/src/components/input";
import { Button } from "@meetzeen/ui/src/components/button";

export function CompanyLocation() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">Ubicación de la empresa</p>
            <p className="text-sm text-muted-foreground">
              Este es la ubicación de tu empresa. Puedes cambiarlo en cualquier
              momento.
            </p>
          </div>
          <Input placeholder="Ubicación de la empresa" className="w-full max-w-md" />
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Preferentemente usa un link de Google Maps.</p>
        <Button>
          Guardar
        </Button>
      </div>
    </div>
  );
}
