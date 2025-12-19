"use client";

import confetti from "canvas-confetti";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import { IconRocket } from "@tabler/icons-react";

export function ConfettiSideCannons() {
  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <Card className="border">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-primary/10 p-3">
                <IconRocket className="size-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Confetti Side Cannons
            </CardTitle>
            <CardDescription className="text-base">
              Dispara confeti desde ambos lados de la pantalla con un efecto espectacular
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button
              onClick={handleClick}
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
            >
              <IconRocket className="size-4 mr-2" />
              Disparar Confeti
            </Button>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Haz clic en el botón para activar el efecto de confeti desde los lados de la pantalla.
              El efecto durará 3 segundos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
