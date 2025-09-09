import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@meetzeen/ui/components/accordion";

export function Faq() {
  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h2 className="text-2xl md:text-6xl font-semibold tracking-tight text-center">
          ¿Tienes preguntas?
          <br />
          Tenemos respuestas
        </h2>

        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Qué es Meetzeen?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Meetzeen es la solucion moderna para la gestion de citas y
                turnos dentro de diferentes servicios, ofreciendo una solucion
                integral y personalizada para cada necesidad.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Cómo funciona Meetzeen?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Meetzeen funciona mediante una plataforma intuitiva y fácil de
                usar, que permite a los usuarios agendar, modificar y cancelar
                citas de manera rápida y sencilla. La plataforma también ofrece
                notificaciones por correo electrónico y mensajes de texto para
                recordar a los usuarios sobre sus citas programadas.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              ¿Qué beneficios recibo en el plan gratis?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                El plan gratis de Meetzeen quiere que puedas experimentar y
                probar. Podrás utilizar todas las funciones básicas como son
                crear servicios, categorías y solo tener un empleado disponible
                para comenzar.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              ¿Vendrán nuevas funcionalidades?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                En Meetzeen tenemos la mentalidad de constante evolución y
                mejoras continuas. Claro que por ahora nos enfocamos en que
                tengas un producto de calidad y nos enfocaremos en bajar los
                precios.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
