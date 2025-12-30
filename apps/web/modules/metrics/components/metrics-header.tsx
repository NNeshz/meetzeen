"use client";

import { useEffect, useState } from "react";
import { MetricsFilterDates } from "@/modules/metrics/components/metrics-filter-dates";
import { MetricsFilterPages } from "@/modules/metrics/components/metrics-filter-pages";
import { authClient } from "@meetzeen/auth/client";
import { Temporal } from "@js-temporal/polyfill";

export function MetricsHeader() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [greeting, setGreeting] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const time = Temporal.Now.plainTimeISO();
    const hour = time.hour;

    let phrases: string[] = [];

    if (hour >= 5 && hour < 12) {
      phrases = ["Buenos días", "Excelente mañana", "¿Qué tal?", "¿Con que comenzamos?"];
    } else if (hour >= 12 && hour < 19) {
      phrases = ["Buenas tardes", "Linda tarde", "¿En que te puedo ayudar?"];
    } else {
      phrases = ["Buenas noches", "Feliz noche"];
    }

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)] ?? "Hola";
    
    // Pequeño delay para una transición más elegante
    const timer = setTimeout(() => {
      setGreeting(randomPhrase);
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          <span
            className={`inline-block transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {greeting || "\u00A0"}
            {greeting && ","}{" "}
            <span className="text-brand">{user?.name.split(" ")[0]}</span>
          </span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Aquí hay una vista rápida del desempeño de tu negocio.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MetricsFilterDates />
        <MetricsFilterPages />
      </div>
    </div>
  );
}
