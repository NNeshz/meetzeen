import { Button } from "@meetzeen/ui/components/button";
import { Card } from "@meetzeen/ui/components/card";
import { Badge } from "@meetzeen/ui/src/components/badge";
import { IconCheck, IconSettingsAutomation } from "@tabler/icons-react";

export function Pricing() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl md:text-6xl font-semibold tracking-tight text-center">
        Nos adaptamos a ti
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="h-96 p-2 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-4">
            <div className="space-y-2">
              <Badge className="px-4 rounded-full">Gratis</Badge>
              <span className="text-4xl font-bold flex items-end">
                <p>$0</p>
                <p className="text-sm font-bold mb-1">/mes</p>
              </span>
            </div>
            <p className="text-xl font-bold">Perfecto para comenzar.</p>
            <ul>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Registro rápido
              </li>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Comparte el link
              </li>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Tus clientes agendan
              </li>
            </ul>
            <Button className="w-full" size={"sm"}>
              Comenzar
            </Button>
          </div>
        </Card>
        <Card className="h-96 p-2 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-4">
            <div className="space-y-2">
              <Badge className="px-4 rounded-full bg-brand text-black">Pro</Badge>
              <span className="text-4xl font-bold flex items-end">
                <p>$25</p>
                <p className="text-sm font-bold mb-1">/mes</p>
              </span>
            </div>
            <p className="text-xl font-bold">Para empresas establecidas.</p>
            <ul>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                300 citas mensuales
              </li>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Hasta 3 personas en tu equipo
              </li>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Soporte básico
              </li>
            </ul>
            <Button className="w-full" size={"sm"} variant={"brand"}>
              Comenzar
            </Button>
          </div>
        </Card>
        <Card className="h-96 p-2 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-4">
            <div className="space-y-2">
              <Badge className="px-4 rounded-full">Premium</Badge>
              <span className="text-4xl font-bold flex items-end">
                <p>$50</p>
                <p className="text-sm font-bold mb-1">/mes</p>
              </span>
            </div>
            <p className="text-xl font-bold">Empresas grandes.</p>
            <ul>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                800 citas mensuales
              </li>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Empleados ilimitados
              </li>
              <li className="flex items-center">
                <IconCheck className="mr-2 text-brand" size={20} />
                Reportes, métricas y soporte premium
              </li>
            </ul>
            <Button className="w-full" size={"sm"}>
              Comenzar
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
