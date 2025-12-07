import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function CompanyHoraryClose() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">Hora de cierre</p>
            <p className="text-sm text-muted-foreground">
              Este es la hora de cierre de tu empresa. Puedes cambiarlo en
              cualquier momento.
            </p>
          </div>
          <ButtonGroup className="w-full max-w-md">
            {/* HORA */}
            <Select value="12">
              <SelectTrigger className="w-full" data-slot="select-trigger">
                12 h
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h} h
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* MINUTO */}
            <Select value="00">
              <SelectTrigger className="w-full" data-slot="select-trigger">
                00 m
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m} m
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ButtonGroup>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Horario de cierre para los clientes. Esto será publico para todos los clientes.
        </p>
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
