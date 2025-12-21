"use client"
import { Star, ShoppingCart, Heart, ArrowRight } from "lucide-react"
import { cn } from "@meetzeen/ui/src/lib/utils"
import type { ThemeConfig } from "@/modules/customization/components/customization-page"

interface PreviewSectionProps {
  config: ThemeConfig
}

const roundedMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

const alignmentMap: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
}

const fontMap: Record<string, string> = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  poppins: "'Poppins', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  "open-sans": "'Open Sans', sans-serif",
  lato: "'Lato', sans-serif",
  playfair: "'Playfair Display', serif",
}

export function CustomizationPreview({ config }: PreviewSectionProps) {
  const rounded = roundedMap[config.rounded] || "rounded-md"
  const alignment = alignmentMap[config.alignment] || "text-center items-center"
  const fontFamily = fontMap[config.font] || "'Inter', sans-serif"

  return (
    <div className="p-6 lg:p-10 bg-muted/30" style={{ fontFamily }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Preview */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Vista previa</h3>

          <div className={cn("flex flex-col gap-4", alignment)}>
            <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: config.primaryColor }}>
              Tu Empresa
            </h1>
            <p className="text-muted-foreground max-w-md">
              Esta es una descripción de ejemplo para ver cómo se verá tu contenido con la configuración actual.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                className={cn("px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90", rounded)}
                style={{ backgroundColor: config.primaryColor }}
              >
                Botón Principal
              </button>
              <button
                className={cn("px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90", rounded)}
                style={{ backgroundColor: config.secondaryColor }}
              >
                Botón Secundario
              </button>
            </div>
          </div>
        </div>

        {/* Cards Preview */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Tarjetas de producto
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn("border bg-background overflow-hidden transition-shadow hover:shadow-md", rounded)}
              >
                <div
                  className="h-32 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${config.primaryColor}20, ${config.secondaryColor}20)`,
                  }}
                >
                  <div
                    className={cn("h-16 w-16", rounded)}
                    style={{
                      backgroundColor:
                        i === 1 ? config.primaryColor : i === 2 ? config.secondaryColor : config.tertiaryColor,
                    }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3" fill={config.tertiaryColor} color={config.tertiaryColor} />
                    ))}
                  </div>
                  <h4 className="font-semibold">Producto {i}</h4>
                  <p className="text-sm text-muted-foreground">Descripción breve del producto</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold" style={{ color: config.primaryColor }}>
                      $99.00
                    </span>
                    <button
                      className={cn("p-2 text-white transition-opacity hover:opacity-90", rounded)}
                      style={{ backgroundColor: config.secondaryColor }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Preview */}
        <div
          className={cn("p-8 text-white", rounded)}
          style={{
            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
          }}
        >
          <div className={cn("flex flex-col gap-4", alignment)}>
            <h2 className="text-2xl lg:text-3xl font-bold">¡Únete a nosotros!</h2>
            <p className="opacity-90 max-w-lg">Descubre todas las ventajas de formar parte de nuestra comunidad.</p>
            <button
              className={cn(
                "px-6 py-3 font-medium bg-white flex items-center gap-2 transition-opacity hover:opacity-90",
                rounded,
              )}
              style={{ color: config.primaryColor }}
            >
              Empezar ahora
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badges & Tags Preview */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Badges y etiquetas
          </h3>

          <div className="flex flex-wrap gap-3">
            <span
              className={cn("px-3 py-1 text-sm font-medium text-white", rounded)}
              style={{ backgroundColor: config.primaryColor }}
            >
              Nuevo
            </span>
            <span
              className={cn("px-3 py-1 text-sm font-medium text-white", rounded)}
              style={{ backgroundColor: config.secondaryColor }}
            >
              Popular
            </span>
            <span
              className={cn("px-3 py-1 text-sm font-medium text-white", rounded)}
              style={{ backgroundColor: config.tertiaryColor }}
            >
              Oferta
            </span>
            <span
              className={cn("px-3 py-1 text-sm font-medium border", rounded)}
              style={{
                borderColor: config.primaryColor,
                color: config.primaryColor,
              }}
            >
              Outline
            </span>
            <span
              className={cn("px-3 py-1 text-sm font-medium flex items-center gap-1", rounded)}
              style={{
                backgroundColor: `${config.primaryColor}15`,
                color: config.primaryColor,
              }}
            >
              <Heart className="h-3 w-3" /> Favorito
            </span>
          </div>
        </div>

        {/* Colors Summary */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Resumen de colores
          </h3>

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn("h-16 w-16 border-2 border-background shadow-md", rounded)}
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="text-xs text-muted-foreground">Principal</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn("h-16 w-16 border-2 border-background shadow-md", rounded)}
                style={{ backgroundColor: config.secondaryColor }}
              />
              <span className="text-xs text-muted-foreground">Secundario</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn("h-16 w-16 border-2 border-background shadow-md", rounded)}
                style={{ backgroundColor: config.tertiaryColor }}
              />
              <span className="text-xs text-muted-foreground">Terciario</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
