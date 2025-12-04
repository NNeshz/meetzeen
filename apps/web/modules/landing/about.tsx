import {
  IconCalendarEvent,
  IconClock,
  IconHammer,
  IconWorldHeart,
} from "@tabler/icons-react";

export function About() {
  return (
    <div className="w-full border-b border-border">
      <div className="max-w-7xl mx-auto flex flex-col border-x border-border">
        <div className="text-center border-b border-border py-8">
          <p className="text-4xl font-semibold tracking-tighter">
            ¿Qué es Meetzeen?
          </p>
          <p className="text-lg text-muted-foreground tracking-tighter">
            Es un lugar que busca la productividad y el tiempo recuperado de tu
            negocio.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-16 space-y-4 border-r border-b border-border md:border-r">
            <IconWorldHeart className="w-10 h-10 text-brand" />
            <p className="font-semibold tracking-tight">
              Administra tu equipo de trabajo
            </p>
            <p>
              Tener un negocio bien organizado es la clave para una
              productividad y eficiencia máxima.
            </p>
          </div>
          <div className="p-16 space-y-4 border-b border-border">
            <IconClock className="w-10 h-10 text-brand" />
            <p className="font-semibold tracking-tight">Horarios flexibles</p>
            <p>
              No te limites a los horarios fijos, crea horarios flexibles y
              personalizados para tu negocio.
            </p>
          </div>
          <div className="p-16 space-y-4 border-r border-border md:border-b-0">
            <IconCalendarEvent className="w-10 h-10 text-brand" />
            <p className="font-semibold tracking-tight">Citas automaticas</p>
            <p>
              Agenda citas automaticas para tu negocio, nosotros te ayudamos a
              agendarlas.
            </p>
          </div>
          <div className="p-16 space-y-4">
            <IconHammer className="w-10 h-10 text-brand" />
            <p className="font-semibold tracking-tight">Productividad</p>
            <p>
              Recupera el tiempo que te toma agendar citas, y utiliza ese tiempo
              para otras cosas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
