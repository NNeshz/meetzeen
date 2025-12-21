"use client"

import type * as React from "react"
import { Paintbrush } from "lucide-react"
import { Label } from "@meetzeen/ui/src/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@meetzeen/ui/src/components/select"
import { ColorPicker } from "@/modules/customization/components/customization-color-picket"
import type { ThemeConfig } from "@/modules/customization/components/customization-page"

interface CustomizerPanelProps {
  config: ThemeConfig
  setConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>
}

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
  { value: "montserrat", label: "Montserrat" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "playfair", label: "Playfair Display" },
]

const roundedOptions = [
  { value: "none", label: "Sin bordes" },
  { value: "sm", label: "Pequeño" },
  { value: "md", label: "Medio" },
  { value: "lg", label: "Grande" },
  { value: "xl", label: "Extra grande" },
  { value: "full", label: "Completo" },
]

const alignmentOptions = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
]

export function CustomizationPanel({ config, setConfig }: CustomizerPanelProps) {
  const updateConfig = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="px-4 py-4 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 rounded-lg bg-primary/10">
          <Paintbrush className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Personalizar</h2>
          <p className="text-sm text-muted-foreground">Configura el estilo de tu empresa</p>
        </div>
      </div>

      {/* Colores */}
      <div className="space-y-5">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Colores</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Color Principal</Label>
            <ColorPicker
              id="primary-color"
              value={config.primaryColor}
              onChange={(color) => updateConfig("primaryColor", color)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color">Color Secundario</Label>
            <ColorPicker
              id="secondary-color"
              value={config.secondaryColor}
              onChange={(color) => updateConfig("secondaryColor", color)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tertiary-color">Color Terciario</Label>
            <ColorPicker
              id="tertiary-color"
              value={config.tertiaryColor}
              onChange={(color) => updateConfig("tertiaryColor", color)}
            />
          </div>
        </div>
      </div>

      {/* Tipografía */}
      <div className="space-y-5">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tipografía</h3>

        <div className="space-y-2">
          <Label htmlFor="font">Fuente</Label>
          <Select value={config.font} onValueChange={(value) => updateConfig("font", value)}>
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
      <div className="space-y-5">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Layout</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alignment">Alineación</Label>
            <Select
              value={config.alignment}
              onValueChange={(value) => updateConfig("alignment", value as "left" | "center" | "right")}
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

          <div className="space-y-2">
            <Label htmlFor="rounded">Bordes redondeados</Label>
            <Select value={config.rounded} onValueChange={(value) => updateConfig("rounded", value)}>
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
  )
}
