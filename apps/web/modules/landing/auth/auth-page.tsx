import { Dither } from "@meetzeen/ui/src/components/dither/dither";
import { AuthButton } from "./auth-button";

export function AuthPage() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col md:flex-row">
      <section className="relative hidden md:flex md:w-1/2">
        <Dither />
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <p className="text-white text-sm md:text-base lg:text-lg max-w-2xl text-pretty">
            Yango es una empresa de tecnología que transforma las tecnologías
            globales en servicios cotidianos para el enriquecimiento local.
          </p>
        </div>
      </section>

      <section className="relative flex flex-col items-center justify-center px-6 py-8 md:py-0 w-full md:w-1/2 min-h-[100dvh]">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-semibold">Inicia sesión</h1>
          <h2 className="text-sm text-muted-foreground mb-6">
            Ingresa tus credenciales para continuar
          </h2>

          <AuthButton />
        </div>
      </section>
    </div>
  );
}