"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationSettings() {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/dashboard/settings", label: "Configuración" },
    { href: "/dashboard/settings/image", label: "Imagen" },
    { href: "/dashboard/settings/contact", label: "Contacto" },
  ];

  return (
    <nav className="w-full">
      <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex space-x-4 py-3 px-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-sm whitespace-nowrap transition-colors
                  ${isActive ? "text-foreground font-medium" : "text-muted-foreground/50 hover:text-muted-foreground"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}