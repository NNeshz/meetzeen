import { Input } from "@meetzeen/ui/src/components/input";
import { Button } from "@meetzeen/ui/src/components/button";
import { Label } from "@meetzeen/ui/src/components/label";

export function CompanySocials() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">Redes sociales</p>
            <p className="text-sm text-muted-foreground">
              Agrega las redes sociales de tu empresa para que los clientes puedan encontrarte fácilmente.
            </p>
          </div>
          <div className="space-y-4 w-full">
            <div className="space-y-2 w-full">
              <Label>Facebook</Label>
              <Input
                placeholder="https://www.facebook.com/your-page"
                className="w-full max-w-md"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>Instagram</Label>
              <Input
                placeholder="https://www.facebook.com/your-page"
                className="w-full max-w-md"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>Twitter</Label>
              <Input
                placeholder="https://www.facebook.com/your-page"
                className="w-full max-w-md"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>TikTok</Label>
              <Input
                placeholder="https://www.facebook.com/your-page"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Usa como máximo 45 caracteres.
        </p>
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
