export function Treats() {
  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-2 lg:gap-24">
          <div className="lg:max-w-[600px]">
            <h2 className="text-2xl md:text-6xl font-semibold tracking-tight text-left">
              Hecho para una
              <br />
              experiencia premium
            </h2>
          </div>
          <div className="lg:max-w-[400px]">
            <p className="text-left text-xs md:text-base text-muted-foreground">
              Tus clientes también tienen días ocupados, ellos quieren ser
              atendidos lo más rápido posible. Nuestro sistema ayuda a que tus
              clientes puedan saber cuando estás disponible
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            <img src="/landing/hero.png" alt="" />
            <div>
              <h3 className="text-xl font-bold">Conocen tus horarios</h3>
              <p>
                No necesitan estar presentes para saber si estás disponible en ese momento.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <img src="/landing/hero.png" alt="" />
            <div>
              <h3 className="text-xl font-bold">No más llamadas innecesarias</h3>
              <p>
                ¿No alcanzaste a responder? No te preocupes, las llamadas ya no
                son necesarias.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <img src="/landing/hero.png" alt="" />
            <div>
              <h3 className="text-xl font-bold">No más tiempo de espera</h3>
              <p>
                Tu cliente llega directo a su servicio, lo que te da más
                prestigio y confianza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
