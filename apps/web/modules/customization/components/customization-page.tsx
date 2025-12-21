"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { CustomizationPanel } from "@/modules/customization/components/customization-panel";
import { CustomizationPreview } from "@/modules/customization/components/customization-preview";

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  alignment: "left" | "center" | "right";
  font: string;
  rounded: string;
}

const defaultConfig: ThemeConfig = {
  primaryColor: "#3b82f6",
  secondaryColor: "#10b981",
  tertiaryColor: "#f59e0b",
  alignment: "center",
  font: "inter",
  rounded: "md",
};

export function CustomizationPage() {
  const [config, setConfig] = React.useState<ThemeConfig>(defaultConfig);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <div className="bg-background">
      {/* Desktop Layout: Panel fijo + Preview */}
      <div className="hidden lg:flex h-screen">
        {/* Panel lateral fijo (no es sidebar, es parte del layout) */}
        <aside className="w-[340px] border-r bg-card flex-shrink-0 overflow-y-auto">
          <CustomizationPanel config={config} setConfig={setConfig} />
        </aside>

        {/* Área de previsualización */}
        <main className="flex-1 overflow-y-auto">
          <CustomizationPreview config={config} />
        </main>
      </div>

      {/* Mobile Layout: Sheet + Preview */}
      <div className="lg:hidden">
        {/* Botón flotante para abrir el sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
            >
              <Settings2 className="h-6 w-6" />
              <span className="sr-only">Abrir configuración</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] p-0 overflow-y-auto">
            <SheetHeader className="sr-only">
              <SheetTitle>Personalizar</SheetTitle>
            </SheetHeader>
            <CustomizationPanel config={config} setConfig={setConfig} />
          </SheetContent>
        </Sheet>

        {/* Preview en mobile */}
        <main className="min-h-screen">
          <CustomizationPreview config={config} />
        </main>
      </div>
    </div>
  );
}
