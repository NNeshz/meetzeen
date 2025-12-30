"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconHome,
  IconUsers,
  IconCalendar,
  IconSettings,
  IconHeart,
  IconGridDots,
  IconMessage,
} from "@tabler/icons-react";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@meetzeen/ui/src/components/command";
import { Input } from "@meetzeen/ui/src/components/input";

// Rutas del sidebar - misma estructura que dashboard-sidebar.tsx
const navMain = [
  {
    title: "Resumen",
    url: "/dashboard",
    icon: IconHome,
  },
  {
    title: "Citas",
    url: "#",
    icon: IconCalendar,
    items: [
      {
        title: "Calendario",
        url: "/dashboard/calendar",
      },
      {
        title: "Historial",
        url: "/dashboard/calendar/history",
      },
    ],
  },
  {
    title: "Clientes",
    url: "/dashboard/customers",
    icon: IconUsers,
  },
  {
    title: "Servicios",
    url: "/dashboard/services",
    icon: IconHeart,
  },
  {
    title: "Equipo",
    url: "/dashboard/team",
    icon: IconGridDots,
  },
  {
    title: "Configuración",
    url: "#",
    icon: IconSettings,
    items: [
      {
        title: "General",
        url: "/dashboard/settings",
      },
      {
        title: "Información",
        url: "/dashboard/settings/about",
      },
      {
        title: "Invitaciones",
        url: "/dashboard/settings/invitations",
      },
      {
        title: "Personalización",
        url: "/dashboard/settings/customization",
      },
      {
        title: "Plan",
        url: "/dashboard/settings/subscription",
      },
    ],
  },
];

export function DashboardCommand() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Efecto para el atajo de teclado
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Función para manejar la navegación
  const handleNavigation = (url: string) => {
    if (url !== "#") {
      setOpen(false);
      router.push(url);
    }
  };

  // Función para aplanar las rutas con labels jerárquicas
  const getFlattenedRoutes = () => {
    const flatRoutes: Array<{
      title: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      parentTitle?: string;
    }> = [];

    navMain.forEach((item) => {
      // Si es un item directo (no tiene subitems)
      if (!item.items && item.url !== "#") {
        flatRoutes.push({
          title: item.title,
          url: item.url,
          icon: item.icon,
          label: item.title,
        });
      }
      
      // Si tiene subitems, agregarlos con label jerárquico
      if (item.items) {
        item.items.forEach((subItem) => {
          flatRoutes.push({
            title: subItem.title,
            url: subItem.url,
            icon: item.icon,
            label: `${item.title} > ${subItem.title}`,
            parentTitle: item.title,
          });
        });
      }
    });

    return flatRoutes;
  };

  const flattenedRoutes = getFlattenedRoutes();

  // Agrupar rutas por categoría
  const groupedRoutes = React.useMemo(() => {
    const groups: { [key: string]: typeof flattenedRoutes } = {
      "Principal": [],
      "Citas": [],
      "Configuración": [],
    };

    flattenedRoutes.forEach((route) => {
      if (route.parentTitle) {
        // Es un subitem, asignar a su grupo correspondiente
        if (route.parentTitle === "Citas") {
          groups["Citas"]?.push(route);
        } else if (route.parentTitle === "Configuración") {
          groups["Configuración"]?.push(route);
        }
      } else {
        // Es un item principal
        if (route.title === "Citas" || route.title === "Configuración") {
          // Estos tienen subitems, no agregar aquí
        } else {
          groups["Principal"]?.push(route);
        }
      }
    });

    // Filtrar grupos vacíos
    return Object.entries(groups).filter(([, routes]) => routes.length > 0);
  }, [flattenedRoutes]);

  return (
    <>
      {/* Input que activa el command box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar páginas..."
          className="h-10 w-full bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          onClick={() => setOpen(true)}
          readOnly
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {groupedRoutes.map(([groupName, routes]) => (
            <CommandGroup key={groupName} heading={groupName}>
              {routes.map((route) => {
                const Icon = route.icon;
                return (
                  <CommandItem
                    key={route.url}
                    onSelect={() => handleNavigation(route.url)}
                    className="cursor-pointer data-[selected=true]:bg-brand data-[selected=true]:text-black group"
                    value={`${route.title} ${route.url} ${route.label}`}
                  >
                    <Icon className="h-4 w-4 group-data-[selected=true]:text-black" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium">{route.title}</span>
                      {route.parentTitle && (
                        <span className="text-xs text-muted-foreground truncate group-data-[selected=true]:text-black/70">
                          {route.label}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
