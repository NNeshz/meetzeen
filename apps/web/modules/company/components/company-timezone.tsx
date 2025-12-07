import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { timezones } from "@/modules/company/constants/timezones";

export function CompanyTimezone() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">Zona horaria de la empresa</p>
            <p className="text-sm text-muted-foreground">
              Este es la zona horaria de tu empresa. Puedes cambiarlo en
              cualquier momento.
            </p>
          </div>
          <Select>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecciona una zona horaria" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          La zona horaria es la zona horaria de tu empresa o donde te encuentras.
        </p>
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
