import Image from "next/image"

export function Demo() {
  return (
    <section className="relative w-full px-4 py-32 md:px-6 lg:px-8 overflow-x-hidden">
      <div className="bg-brand w-[60vw] h-[28vw] max-w-[800px] max-h-[800px] rounded-full absolute top-1/2 -translate-y-1/2 -left-[20vw] blur-3xl opacity-70" />
      <div className="bg-brand w-[60vw] h-[28vw] max-w-[800px] max-h-[800px] rounded-full absolute top-1/2 -translate-y-1/2 -right-[20vw] blur-3xl opacity-70" />

      <div className="mx-auto max-w-7xl border border-white/20 p-2 md:p-4 rounded-2xl backdrop-blur-2xl bg-white/10 shadow-xl relative z-10 w-full">
        <div className="space-y-8">
          <div className="w-full relative">
            <Image
              src="/landing/demo.png"
              alt="Nuestro equipo trabajando en un ambiente colaborativo y moderno"
              width={1600}
              height={900}
              className="h-auto w-full rounded-xl object-cover shadow-2xl relative z-0"
              style={{ aspectRatio: "16/9" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              quality={90}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
