"use client";

import type * as React from "react";
import { Paintbrush, Save } from "lucide-react";
import { Label } from "@meetzeen/ui/src/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { ColorPicker } from "@/modules/customization/components/customization-color-picket";
import type { ThemeConfig } from "@/modules/customization/components/customization-page";

interface CustomizerPanelProps {
  config: ThemeConfig;
  setConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
  { value: "montserrat", label: "Montserrat" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "playfair", label: "Playfair Display" },
];

const roundedOptions = [
  { value: "none", label: "Sin bordes" },
  { value: "sm", label: "Pequeño" },
  { value: "md", label: "Medio" },
  { value: "lg", label: "Grande" },
  { value: "xl", label: "Extra grande" },
  { value: "full", label: "Completo" },
];

const alignmentOptions = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

export function CustomizationPanel({
  config,
  setConfig,
}: CustomizerPanelProps) {
  const updateConfig = <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Paintbrush className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Personalizar</h2>
            <p className="text-sm text-muted-foreground">
              Configura el estilo
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Colores */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Colores de marca
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="primary-color" className="text-xs">
                Principal
              </Label>
              <ColorPicker
                id="primary-color"
                value={config.primaryColor}
                onChange={(color) => updateConfig("primaryColor", color)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secondary-color" className="text-xs">
                Secundario
              </Label>
              <ColorPicker
                id="secondary-color"
                value={config.secondaryColor}
                onChange={(color) => updateConfig("secondaryColor", color)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tertiary-color" className="text-xs">
                Terciario
              </Label>
              <ColorPicker
                id="tertiary-color"
                value={config.tertiaryColor}
                onChange={(color) => updateConfig("tertiaryColor", color)}
              />
            </div>
          </div>
        </div>

        {/* Tipografía */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tipografía
          </h3>

          <div className="space-y-1.5">
            <Label htmlFor="font" className="text-xs">
              Fuente
            </Label>
            <Select
              value={config.font}
              onValueChange={(value) => updateConfig("font", value)}
            >
              <SelectTrigger id="font" className="w-full">
                <SelectValue placeholder="Selecciona una fuente" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Apariencia
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="alignment" className="text-xs">
                Alineación de contenido
              </Label>
              <Select
                value={config.alignment}
                onValueChange={(value) =>
                  updateConfig("alignment", value as "left" | "center" | "right")
                }
              >
                <SelectTrigger id="alignment" className="w-full">
                  <SelectValue placeholder="Selecciona alineación" />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rounded" className="text-xs">
                Radio de bordes
              </Label>
              <Select
                value={config.rounded}
                onValueChange={(value) => updateConfig("rounded", value)}
              >
                <SelectTrigger id="rounded" className="w-full">
                  <SelectValue placeholder="Selecciona el redondeo" />
                </SelectTrigger>
                <SelectContent>
                  {roundedOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-background mt-auto sticky bottom-0 z-10">
        <Button className="w-full gap-2" size="lg">
          <Save className="h-4 w-4" />
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
