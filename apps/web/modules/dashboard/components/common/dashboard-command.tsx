"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChartBar,
  Bot,
  Users,
  Package,
  ShoppingBag,
  Building,
  Computer,
  Wallet,
  CalendarClock,
  Search,
} from "lucide-react";
import { IconUserHeart } from "@tabler/icons-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@meetzeen/ui/src/components/command";
import { Input } from "@meetzeen/ui/src/components/input";

const navMain = [
  {
    title: "Inicio",
    url: "/admin",
    icon: ChartBar,
  },
  {
    title: "CMS",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Blog",
        url: "/admin/blog",
      },
      {
        title: "Billboards",
        url: "/admin/billboards",
      },
    ],
  },
  {
    title: "Usuarios",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Lista",
        url: "/admin/usuarios",
      },
      {
        title: "Permitidos",
        url: "/admin/usuarios/permitidos",
      },
    ],
  },
  {
    title: "Inventario",
    url: "#",
    icon: Package,
    items: [
      {
        title: "Productos",
        url: "/admin/productos",
      },
      {
        title: "Colores",
        url: "/admin/productos/colores",
      },
      {
        title: "Tallas",
        url: "/admin/productos/tallas",
      },
      {
        title: "Categorias",
        url: "/admin/productos/categorias",
      },
    ],
  },
  {
    title: "Catálogo",
    url: "#",
    icon: ShoppingBag,
    items: [
      {
        title: "Servicios",
        url: "/admin/servicios",
      },
      {
        title: "Categorias",
        url: "/admin/servicios/categorias",
      },
    ],
  },
  {
    title: "Sucursales",
    url: "/admin/sucursales",
    icon: Building,
  },
  {
    title: "Sesiones",
    url: "/admin/sesiones",
    icon: Computer,
  },
  {
    title: "Gastos",
    url: "/admin/gastos",
    icon: Wallet,
  },
  {
    title: "Clientes",
    url: "/admin/clientes",
    icon: IconUserHeart,
  },
  {
    title: "Citas",
    url: "/admin/citas",
    icon: CalendarClock,
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
      icon: any;
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
      "Páginas principales": [],
      "CMS": [],
      "Usuarios": [],
      "Inventario": [],
      "Catálogo": [],
      "Gestión": [],
    };

    flattenedRoutes.forEach((route) => {
      if (route.parentTitle) {
        // Es un subitem, asignar a su grupo correspondiente
        if (groups[route.parentTitle]) {
          groups[route.parentTitle]?.push(route);
        }
      } else {
        // Es un item principal
        if (["Sucursales", "Sesiones", "Gastos", "Clientes", "Citas"].includes(route.title)) {
          groups["Gestión"]?.push(route);
        } else {
          groups["Páginas principales"]?.push(route);
        }
      }
    });

    // Filtrar grupos vacíos
    return Object.entries(groups).filter(([_, routes]) => routes.length > 0);
  }, [flattenedRoutes]);

  return (
    <>
      {/* Input que activa el command box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Busqueda global..."
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
        <CommandInput placeholder="Busqueda global..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {groupedRoutes.map(([groupName, routes]) => (
            <CommandGroup key={groupName} heading={groupName}>
              {routes.map((route) => {
                const Icon = route.icon;
                return (
                  <CommandItem
                    key={route.url}
                    onSelect={() => handleNavigation(route.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{route.title}</span>
                      {route.parentTitle && (
                        <span className="text-xs text-muted-foreground">
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

// Componente alternativo con vista más compacta
export function DashboardSimpleCommand() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleNavigation = (url: string) => {
    if (url !== "#") {
      setOpen(false);
      router.push(url);
    }
  };

  // Obtener todas las rutas navegables con sus labels
  const getAllNavigableRoutes = () => {
    const routes: Array<{
      title: string;
      url: string;
      icon: any;
      searchLabel: string;
    }> = [];

    navMain.forEach((item) => {
      if (!item.items && item.url !== "#") {
        routes.push({
          title: item.title,
          url: item.url,
          icon: item.icon,
          searchLabel: item.title,
        });
      }
      
      if (item.items) {
        item.items.forEach((subItem) => {
          routes.push({
            title: subItem.title,
            url: subItem.url,
            icon: item.icon,
            searchLabel: `${item.title} ${subItem.title}`,
          });
        });
      }
    });

    return routes;
  };

  const allRoutes = getAllNavigableRoutes();

  return (
    <>
      <div 
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Buscar en admin...</span>
        <kbd className="ml-auto bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="Todas las páginas">
            {allRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <CommandItem
                  key={route.url}
                  onSelect={() => handleNavigation(route.url)}
                  className="cursor-pointer"
                  keywords={[route.searchLabel]}
                >
                  <Icon className="h-4 w-4" />
                  <span>{route.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {route.url}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}