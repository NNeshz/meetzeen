"use client"

import * as React from "react"
import { IconCalendar, IconSettings, IconCalendarCog, IconHome, IconBrandAppgallery } from "@tabler/icons-react"

import { NavMain } from "@/modules/dashboard/components/nav-main"
import { NavUser } from "@/modules/dashboard/components/nav-user"
import { TeamSwitcher } from "@/modules/dashboard/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@meetzeen/ui/components/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: IconHome,
      isActive: true,
    },
    {
      title: "Citas",
      url: "#",
      icon: IconCalendar,
      items: [
        {
          title: "Proximas",
          url: "#",
        },
        {
          title: "Historial",
          url: "#",
        },
      ],
    },
    {
      title: "Horarios",
      url: "#",
      icon: IconCalendarCog,
      items: [
        {
          title: "Dias",
          url: "#",
        },
        {
          title: "Horarios",
          url: "#",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: IconSettings,
      items: [
        {
          title: "Negocio",
          url: "/dashboard/negocio",
        },
        {
          title: "Categorias",
          url: "/dashboard/categorias",
        },
        {
          title: "Equipo",
          url: "/dashboard/equipo",
        },
        {
          title: "Servicios",
          url: "/dashboard/servicios",
        }
      ],
    },
  ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher icon={IconBrandAppgallery} title="Meetzeen" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
