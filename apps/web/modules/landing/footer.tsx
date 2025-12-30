import Link from "next/link";

const navLinks = [
  { href: "/", label: "Tutorial" },
  { href: "/", label: "Servicio" },
  { href: "/", label: "Demo" },
  { href: "/", label: "Precios" },
];

const legalLinks = [
  { href: "/privacy", label: "Política de privacidad" },
  { href: "/terms", label: "Términos de servicio" },
];

export function Footer() {
  return (
    <footer className="w-full border-b border-border border-t">
      <div className="max-w-7xl mx-auto border-x border-border">
        {/* Main footer content */}
        <div className="flex flex-col gap-8 px-6 py-12 lg:flex-row lg:justify-between lg:items-start">
          {/* Brand section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight">Meetzeen</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Gestión de citas simplificada,
              <br />
              diseñada para tu negocio.
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-3 lg:flex-row lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Meetzeen. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}