import { Button } from "@meetzeen/ui/src/components/button"
import { Badge } from "@meetzeen/ui/src/components/badge"
import { IconArrowRight } from "@tabler/icons-react"

export function Hero() {
  return (
    <div className="w-full pt-36">
      <section className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden">
        <div className="absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 tracking-tighter">
          <Badge className="inline-flex items-center gap-2 px-2 py-1 rounded-full">
            <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
            <p className="text-sm font-medium">Te regalamos 10 citas</p>
          </Badge>

          <h1 className="text-4xl md:text-8xl font-semibold tracking-tight">Citas automaticas, tiempo recuperado</h1>

          <p className="text-base md:text-xl max-w-2xl mx-auto text-pretty">
            Transforma la manera de agendar tus citas con nuestra plataforma inteligente. Programa, modifica o cancela
            tus citas en cualquier momento con unos cuantos clicks.
          </p>
          <div className="flex justify-center gap-4">
            <Button size={"sm"}>Ver demo</Button>
            <Button size={"sm"} variant={"default"} className="bg-brand hover:bg-brand/90">
              Comienza ahora
              <IconArrowRight className="inline-block size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
