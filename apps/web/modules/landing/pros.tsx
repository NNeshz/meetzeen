import Image from "next/image";
import { Card } from "@meetzeen/ui/src/components/card";
import {
  IconClock,
  IconFolder,
  IconHammer,
  IconUsersGroup,
} from "@tabler/icons-react";

export function Pros() {
  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h2 className="text-2xl md:text-6xl font-semibold tracking-tight text-center">
          ¿Por qué escoger Meetzeen?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="col-span-1 lg:col-span-2 h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconClock
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Ahorra tiempo diario</p>
              <p className="text-base">
                Permite ahorrar tiempo diario en tareas administrativas, como la
                gestión de horarios, la planificación de citas.
              </p>
            </div>
          </Card>
          <Card className="col-span-1 lg:col-span-3 h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconFolder
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Una mejor organización</p>
              <p className="text-base text-pretty lg:pr-48"> 
                Organiza tu día de manera sencilla, no necesitas estar presente
                para tener seguridad de que tus horarios estén organizados.
              </p>
            </div>
          </Card>
          <Card className="col-span-1 lg:col-span-3 h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconUsersGroup
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Conoce a tus clientes</p>
              <p className="text-base text-pretty lg:pr-48">
                Conoce como es que tus clientes se desarrollan dentro de tu
                empresa, puedes ofrecer promociones o detectar quien es un
                cliente problema.
              </p>
            </div>
          </Card>
          <Card className="col-span-1 lg:col-span-2 h-96 p-2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <IconHammer
                size={64}
                className="bg-brand text-black p-2 rounded-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-xl font-bold">Simplifica tu trabajo</p>
              <p className="text-base">
                Queremos que tu trabajo sea más sencillo, nos encargamos de lo
                administrativo, tu tranquilo.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
