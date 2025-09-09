import { Card } from "@meetzeen/ui/components/card";
import {
  IconDeviceMobile,
  IconLinkPlus,
  IconSettingsAutomation,
} from "@tabler/icons-react";

export function Works() {
  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h2 className="text-2xl md:text-6xl font-semibold tracking-tight text-center">
          ¿Cómo funciona Meetzeen?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconSettingsAutomation
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Registro rápido</p>
              <p className="text-base">
                Regístrate, creas tu empresa, agregas unos pequeños pasos y
                comenzamos a funcionar.
              </p>
            </div>
          </Card>
          <Card className="h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconLinkPlus
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Comparte el link</p>
              <p className="text-base">
                Compartes el link entre tus clientes y redes sociales para que
                puedan acceder a tu empresa.
              </p>
            </div>
          </Card>
          <Card className="h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconDeviceMobile
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Tus clientes agendan</p>
              <p className="text-base">
                Tus clientes seleccionan horario, personal, servicio y día. Tu
                solo atiendes
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
