import Image from "next/image";

export function Pros() {
  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-8">
          <h2 className="text-left text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Más tiempo, menos trabajo.
            <br />
            Una increíble organización
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl border bg-card text-card-foreground shadow p-4 pb-0 flex flex-col">
              <div className="relative h-3/4 w-full">
                <Image
                  src="/landing/hero.png"
                  alt="Feature 1"
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="h-1/4 flex flex-col justify-center">
                <p className="text-left font-bold tracking-tight text-foreground md:text-xl lg:text-2xl">
                  Gestiona tu tiempo eficientemente
                </p>
                <p className="text-left text-lg leading-relaxed text-muted-foreground md:text-lg pr-28">
                  Meetzeen nace con la idea de ayudar a empresas y emprendedores
                  a poder lograr una libertad en tiempo
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-2xl border bg-card text-card-foreground shadow p-4 pb-0 flex flex-col">
              <div className="relative h-3/4 w-full">
                <Image
                  src="/landing/hero.png"
                  alt="Feature 2"
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="h-1/4 flex flex-col justify-center">
                <p className="text-left font-bold tracking-tight text-foreground md:text-xl lg:text-2xl">
                  Gestiona tu tiempo eficientemente
                </p>
                <p className="text-left text-lg leading-relaxed text-muted-foreground md:text-lg pr-28">
                  Meetzeen nace con la idea de ayudar a empresas y emprendedores
                  a poder lograr una libertad en tiempo
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-2xl border bg-card text-card-foreground shadow p-4 pb-0 flex flex-col">
              <div className="relative h-3/4 w-full">
                <Image
                  src="/landing/hero.png"
                  alt="Feature 1"
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="h-1/4 flex flex-col justify-center">
                <p className="text-left font-bold tracking-tight text-foreground md:text-xl lg:text-2xl">
                  Gestiona tu tiempo eficientemente
                </p>
                <p className="text-left text-lg leading-relaxed text-muted-foreground md:text-lg pr-28">
                  Meetzeen nace con la idea de ayudar a empresas y emprendedores
                  a poder lograr una libertad en tiempo
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-2xl border bg-card text-card-foreground shadow p-4 pb-0 flex flex-col">
              <div className="relative h-3/4 w-full">
                <Image
                  src="/landing/hero.png"
                  alt="Feature 2"
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="h-1/4 flex flex-col justify-center">
                <p className="text-left font-bold tracking-tight text-foreground md:text-xl lg:text-2xl">
                  Gestiona tu tiempo eficientemente
                </p>
                <p className="text-left text-lg leading-relaxed text-muted-foreground md:text-lg pr-28">
                  Meetzeen nace con la idea de ayudar a empresas y emprendedores
                  a poder lograr una libertad en tiempo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
