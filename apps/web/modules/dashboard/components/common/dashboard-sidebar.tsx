"use client";

import * as React from "react";
import {
  IconHome,
  IconUsers,
  IconCalendar,
  IconSettings,
  IconHeart,
  IconGridDots,
} from "@tabler/icons-react";

import { NavMain } from "@/modules/dashboard/components/common/nav-main";
import { NavUser } from "@/modules/dashboard/components/common/nav-user";
import { TeamSwitcher } from "@/modules/dashboard/components/common/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@meetzeen/ui/components/sidebar";

// This is sample data.
const data = {
  navMain: [
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
          title: "Plan",
          url: "/dashboard/settings/subscription",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen, state, isMobile } = useSidebar();
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Función para verificar si un elemento está dentro de un dropdown
  const isElementInDropdown = React.useCallback(
    (element: HTMLElement | null): boolean => {
      if (!element) return false;

      // Verificar que el elemento sea un Element y tenga el método closest
      if (!(element instanceof Element) || typeof element.closest !== "function") {
        return false;
      }

      // Verificar si el elemento o alguno de sus ancestros es un dropdown
      const dropdownSelectors = [
        "[data-radix-dropdown-menu-content]",
        "[data-radix-dropdown-menu-viewport]",
        '[role="menu"]',
      ];

      return dropdownSelectors.some((selector) => {
        const dropdown = element.closest(selector);
        if (dropdown) {
          const style = window.getComputedStyle(dropdown);
          return style.display !== "none" && style.visibility !== "hidden";
        }
        return false;
      });
    },
    []
  );

  // Función para verificar si hay un dropdown visible en el DOM
  const isDropdownVisible = React.useCallback((): boolean => {
    const selectors = [
      "[data-radix-dropdown-menu-content]",
      "[data-radix-dropdown-menu-viewport]",
      '[role="menu"]',
    ];

    return selectors.some((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const style = window.getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      }
      return false;
    });
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (state === "collapsed" && !isMobile) {
      setOpen(true);
    }
  }, [state, isMobile, setOpen]);

  const handleMouseLeave = React.useCallback(
    (e: React.MouseEvent) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Verificar que relatedTarget sea un HTMLElement antes de usarlo
      const relatedTarget =
        e.relatedTarget instanceof HTMLElement
          ? (e.relatedTarget as HTMLElement)
          : null;

      // Verificar si el mouse se está moviendo hacia un dropdown
      const isMovingToDropdown = isElementInDropdown(relatedTarget);

      // Verificar si hay un dropdown visible
      const hasDropdownVisible = isDropdownVisible();

      // No colapsar si el mouse se mueve hacia un dropdown o hay un dropdown visible
      if (isMovingToDropdown || hasDropdownVisible) {
        return;
      }

      hoverTimeoutRef.current = setTimeout(() => {
        // Verificar nuevamente antes de colapsar
        if (!isDropdownVisible() && state === "expanded" && !isMobile) {
          setOpen(false);
        }
        hoverTimeoutRef.current = null;
      }, 150);
    },
    [state, isMobile, setOpen, isElementInDropdown, isDropdownVisible]
  );

  // Listener para detectar cuando aparece un dropdown y agregar listeners a él
  React.useEffect(() => {
    if (isMobile) return;

    const processedDropdowns = new WeakSet<Element>();

    const setupDropdownListeners = (dropdown: Element) => {
      if (processedDropdowns.has(dropdown)) return;
      processedDropdowns.add(dropdown);

      const handleDropdownEnter = () => {
        // Cancelar cualquier timeout de colapso
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      };

      const handleDropdownLeave = () => {
        // Cuando se sale del dropdown, colapsar el sidebar si no está sobre el sidebar
        hoverTimeoutRef.current = setTimeout(() => {
          const sidebarElement = document.querySelector(
            '[data-slot="sidebar-container"]'
          );
          const isOverSidebar = sidebarElement?.matches(":hover");

          if (!isOverSidebar && state === "expanded" && !isMobile) {
            setOpen(false);
          }
          hoverTimeoutRef.current = null;
        }, 150);
      };

      dropdown.addEventListener("mouseenter", handleDropdownEnter);
      dropdown.addEventListener("mouseleave", handleDropdownLeave);
    };

    const observer = new MutationObserver((mutations) => {
      const dropdownSelectors = [
        "[data-radix-dropdown-menu-content]",
        "[data-radix-dropdown-menu-viewport]",
        '[role="menu"]',
      ];

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Verificar si el nodo agregado es un dropdown
            dropdownSelectors.forEach((selector) => {
              if (element.matches?.(selector)) {
                setupDropdownListeners(element);
              }
            });

            // Verificar si el nodo agregado contiene un dropdown
            dropdownSelectors.forEach((selector) => {
              const dropdown = element.querySelector?.(selector);
              if (dropdown) {
                setupDropdownListeners(dropdown);
              }
            });
          }
        });
      });
    });

    // Configurar listeners para dropdowns existentes
    const dropdownSelectors = [
      "[data-radix-dropdown-menu-content]",
      "[data-radix-dropdown-menu-viewport]",
      '[role="menu"]',
    ];
    dropdownSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach(setupDropdownListeners);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [state, isMobile, setOpen]);

  // Limpiar timeout
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
