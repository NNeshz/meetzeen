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
    <div className="h-full">
      <div className="hidden lg:flex h-full">
        <aside className="w-[340px] overflow-y-auto">
          <CustomizationPanel config={config} setConfig={setConfig} />
        </aside>

        <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <CustomizationPreview config={config} />
        </main>
      </div>

      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="fixed bottom-4 right-4">
            <Button size={"lg"}>
              <Settings2 className="h-6 w-6" />
              Personalizar
              <span className="sr-only">Abrir configuración</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[320px] p-0 overflow-y-auto fixed"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Personalizar</SheetTitle>
            </SheetHeader>
            <CustomizationPanel config={config} setConfig={setConfig} />
          </SheetContent>
        </Sheet>

        <main className="min-h-screen">
          <CustomizationPreview config={config} />
        </main>
      </div>
    </div>
  );
}
