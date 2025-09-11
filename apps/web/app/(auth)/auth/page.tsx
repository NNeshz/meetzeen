"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { signInWithGoogle } from "@/utils/auth-connection";

export default function AuthPage() {
  return (
    <div className="h-screen w-full p-2">
      <section className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-background">
        {/* Círculo difuminado del color brand en el top */}
        <div className="bg-brand w-[60vw] h-[30vw] max-w-[800px] max-h-[800px] rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-70"/>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-4 tracking-tighter">
          <h1 className="text-4xl md:text-6xl font-semibold text-foreground">
            Bienvenido a Meetzeen
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            La mejor manera de organizarte en minutos
          </p>
          <Button size="sm" variant="brand" onClick={signInWithGoogle}>
            Comienza ahora con Google
            <IconBrandGoogleFilled className="inline-block size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
