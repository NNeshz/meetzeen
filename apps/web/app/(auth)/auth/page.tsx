"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { signInWithGoogle } from "@/utils/auth-connection";

export default function AuthPage() {
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
          <h2 className="text-4xl md:text-8xl font-semibold text-white">Comienza en 5 min</h2>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto text-pretty">
            Transforma la manera de agendar tus citas con nuestra plataforma inteligente.
            Programa, modifica o cancela tus citas en cualquier momento con unos cuantos clicks.
          </p>
          <Button size={"lg"} className="rounded-full" onClick={signInWithGoogle}>
            Comienza ahora con Google
            <IconBrandGoogleFilled className="inline-block size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
