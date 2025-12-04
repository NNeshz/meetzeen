import { IconCancel, IconChartArcs, IconRobot } from "@tabler/icons-react";
import { Badge } from "@meetzeen/ui/components/badge";

export function Features() {
  return (
    <div className="w-full border-b border-border">
      <div className="max-w-7xl mx-auto flex flex-col border-x border-border">
        <p className="text-4xl font-semibold tracking-tighter text-center border-b border-border py-8">
          Funcionalidades construidas para ti.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-8 border-r border-b border-border lg:border-b-0 lg:border-r space-y-4">
            <IconChartArcs className="w-10 h-10 text-brand" />
            <p className="text-lg font-semibold">Analiza tus datos</p>
            <p className="text-sm text-muted-foreground">
              Conoce el flujo y el comportamiento de tu negocio para tomar
              mejores decisiones. Conoce tus clientes y sus preferencias. Esto y
              mucho más.
            </p>
          </div>
          <div className="p-8 border-r border-b border-border lg:border-b-0 lg:border-r space-y-4">
            <IconCancel className="w-10 h-10 text-brand" />
            <p className="text-lg font-semibold">Cancela citas</p>
            <p className="text-sm text-muted-foreground">
              Cancela citas de forma sencilla y rápida. Puedes llevar un
              registro de tus citas canceladas y conocer clientes que no han
              llegado a su cita.
            </p>
          </div>
          <div className="p-8 border-b border-border lg:border-b-0 space-y-4">
            <IconRobot className="w-10 h-10 text-brand" />
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">IA Integrada</p>
              <Badge variant="outline">Proximamente</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Conoce la IA integrada en Meetzeen, una IA que te ayuda a
              identificar problemas, y generar reportes de una manera eficiente,
              rapida y sencilla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
