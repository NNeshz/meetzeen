export function Demo() {
  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-8">
          <h2 className="text-left text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Trabaja de la manera más libre posible
          </h2>

          <p className="text-left text-lg leading-relaxed text-muted-foreground md:text-xl lg:max-w-4xl">
            Meetzeen nace con la idea de ayudar a empresas y emprendedores a
            poder lograr una libertad en tiempo, brindando tiempo de calidad y
            una gran organización al mismo tiempo. Con Meetzeen cambias las
            llamadas por tiempo de calidad y productividad.
          </p>

          <div className="w-full">
            <img
              src="/landing/hero.png"
              alt="Nuestro equipo trabajando en un ambiente colaborativo y moderno"
              className="h-auto w-full rounded-lg object-cover shadow-lg md:rounded-xl"
              style={{ aspectRatio: "16/9" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
