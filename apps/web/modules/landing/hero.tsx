import { Button } from "@meetzeen/ui/src/components/button";
import { Badge } from "@meetzeen/ui/src/components/badge";
import { IconArrowRight, IconPointFilled } from "@tabler/icons-react"

export function Hero() {
  return (
    <div className="h-screen w-full p-2">
      <section 
        className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          backgroundImage: 'url(/landing/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-4 tracking-tighter">

          <Badge className="rounded-full shadow-2xl">
            <IconPointFilled className="inline-block size-8" />
            Te regalamos 50 citas 
          </Badge>
        
          <h1 className="text-4xl md:text-8xl font-semibold text-white">
            Citas automaticas,<br/>tiempo recuperado
          </h1>
          
          <p className="text-base md:text-xl max-w-2xl mx-auto text-pretty">
            Transforma la manera de agendar tus citas con nuestra plataforma inteligente.
            Programa, modifica o cancela tus citas en cualquier momento con unos cuantos clicks.
          </p>
          <Button size={"lg"} className="rounded-full">
            Comienza ahora
            <IconArrowRight className="inline-block size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}