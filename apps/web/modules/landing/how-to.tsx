import {
  IconBrandGoogleFilled,
  IconForms,
  IconUsers,
  IconChartBar,
  IconLink,
} from "@tabler/icons-react";

export function HowTo() {
  return (
    <div className="w-full border-b border-border">
      <div className="max-w-7xl mx-auto flex flex-col border-x border-border">
        <div className="text-center border-b border-border py-8">
          <p className="text-4xl font-semibold tracking-tighter">
            ¿Cómo hacemos que funcione?
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-16 space-y-4 border-r border-b border-border flex flex-col items-center text-center">
            <IconBrandGoogleFilled
              className="w-16 h-16 text-brand mb-4"
            />
            <p className="font-semibold tracking-tight">Inicias sesión</p>
            <p className="text-sm text-muted-foreground">
              Inicias sesión con tu correo electrónico o con Google, ¡esto es
              importante!
            </p>
          </div>
          <div className="p-16 space-y-4 border-r border-b border-border lg:border-r flex flex-col items-center text-center">
            <IconForms className="w-16 h-16 text-brand mb-4" />
            <p className="font-semibold tracking-tight">Registra tu negocio</p>
            <p className="text-sm text-muted-foreground">
              Registra tu negocio y comienza a agendar citas.
            </p>
          </div>
          <div className="p-16 space-y-4 border-b border-border flex flex-col items-center text-center">
            <IconUsers className="w-16 h-16 text-brand mb-4" />
            <p className="font-semibold tracking-tight">Agrega a tu equipo</p>
            <p className="text-sm text-muted-foreground">
              Agrega a tu equipo de trabajo y comienza a agendar citas.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-16 space-y-4 border-r aspect-square border-b border-border lg:border-b-0 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <IconChartBar className="w-24 h-24 text-brand" />
            </div>
            <p className="font-semibold tracking-tight">
              Registra tus servicios
            </p>
            <p className="text-sm text-muted-foreground">
              Podrás tener hasta métricas en base a tus servicios, precios y
              tiempos.
            </p>
          </div>
          <div className="p-16 space-y-4 border-b aspect-square border-border lg:border-b-0 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <IconLink className="w-24 h-24 text-brand" />
            </div>
            <p className="font-semibold tracking-tight">
              Comparte tu enlace de agendamiento
            </p>
            <p className="text-sm text-muted-foreground">
              Tendrás visibilidad de tu disponibilidad sin molestas llamadas
              diarias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
