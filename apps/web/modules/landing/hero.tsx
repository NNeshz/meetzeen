import { Button } from "@meetzeen/ui/src/components/button";
import { Badge } from "@meetzeen/ui/src/components/badge";
import { IconCalendar } from "@tabler/icons-react"

export function Hero() {
  return (
    <div className="h-screen w-full p-4">
      <section 
        className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          backgroundImage: 'url(/landing/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-4 tracking-tighter">

          <Badge variant={"secondary"} className="px-4 py-2 rounded-full">
            <IconCalendar className="inline-block w-8 h-8 mr-2" />
            Te regalamos 50 citas 
          </Badge>
        
          <h1 className="text-4xl md:text-6xl font-semibold text-muted">
            Organizado. Simple. Eficiente.
          </h1>
          <h2 className="text-4xl md:text-6xl font-semibold text-muted">
            Todo en completa calma
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-xl mx-auto">
            Organiza tus citas de la manera más simple y sencilla, conoce la manera en la cual puedes 
            ahorrar tiempo.
          </p>
          <Button size={"lg"} variant={"secondary"} className="rounded-full">
            Comienza ahora
          </Button>
        </div>
      </section>
    </div>
  );
}