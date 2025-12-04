import { Button } from "@meetzeen/ui/components/button";
import { Dither } from "@meetzeen/ui/src/components/dither/dither";
import { IconChevronRight } from "@tabler/icons-react";

export function Hero() {
  return (
    <div className="relative w-full h-[700px] md:h-[800px] lg:h-[900px] mt-16">
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      >
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.4}
          colorNum={12.5}
          waveAmplitude={0.04}
          waveFrequency={3}
          waveSpeed={0.02}
        />
      </div>
      <div className="absolute inset-0 flex items-center left-0 right-0 px-4 md:px-8 lg:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full flex flex-col px-4 gap-6 md:gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white max-w-3xl leading-tighter tracking-tighter">
            Citas automaticas, tiempo recuperado
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl text-white/50 max-w-3xl leading-tight text-pretty">
            Transforma la manera de agendar tus{" "}
            <span className="text-white font-semibold">citas</span> con nuestra
            plataforma{" "}
            <span className="text-white font-semibold">inteligente</span>.{" "}
            <span className="text-white font-semibold">Programa</span>,{" "}
            <span className="text-white font-semibold">modifica</span> o{" "}
            <span className="text-white font-semibold">cancela</span> tus citas
            en cualquier momento con unos cuantos clicks.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-2 pointer-events-auto">
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-8 bg-brand text-black hover:bg-brand/90"
            >
              Comenzar ahora
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-6 md:py-8"
            >
              Ver demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
